const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const generatePatientReport = async (req, res) => {
  const { patientId } = req.params;
  const { selectedSections } = req.body; // tableau: ['patientInfo', 'notes', 'diagnostic', ...]

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) },
      include: {
        notes: true,
        diagnostics: true,
        syntheses: true,
        interventionReports: true,
        appointments: true,
        interventionReasons: {
          include: {
            longTermObjectives: {
              include: {
                shortTermObjectives: true
              }
            },
            patientRecords: true
          }
        }
      }
    });

    if (!patient) return res.status(404).json({ message: 'Patient introuvable' });

    const sections = {
      patientInfo: {
        title: 'Informations patient',
        content: `${patient.firstName} ${patient.lastName}\nSexe: ${patient.sex}\nDate de naissance: ${patient.birthdate?.toLocaleDateString()}`
      },
      notes: {
        title: 'Notes du thérapeute',
        content: patient.notes.map(n => `\n- ${n.title || ''} (${new Date(n.noteDate).toLocaleDateString()}): ${n.description}`).join('\n')
      },
      diagnostic: {
        title: 'Diagnostics',
        content: patient.diagnostics.map(d => `\n- ${new Date(d.createdAt).toLocaleDateString()} : ${d.diagnosticText}`).join('\n')
      },
      synthese: {
        title: 'Synthèses',
        content: patient.syntheses.map(s => `\n- ${new Date(s.createdAt).toLocaleDateString()} : ${s.synthesisText}`).join('\n')
      },
      interventions: {
        title: 'Interventions',
        content: patient.interventionReports.map(i => `\n- ${new Date(i.date).toLocaleDateString()} : ${i.interventionText}`).join('\n')
      },
      objectifs: {
        title: 'Objectifs thérapeutiques',
        content: patient.interventionReasons.map(motif => {
          const longTerms = motif.longTermObjectives.map(l => `\n  ➤ ${l.title} (${l.status})` +
            l.shortTermObjectives.map(s => `\n     ↳ ${s.title} (${s.status})`).join('')).join('');
          return `\n🟢 ${motif.title}${longTerms}`;
        }).join('\n')
      }
    };

    const reportContent = selectedSections.map(key => ({
      title: sections[key]?.title || '',
      content: sections[key]?.content || ''
    }));

    const templatePath = path.resolve(__dirname, '..', '..', 'templates', 'reportTemplate.hbs');
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateHtml);
    const html = compiledTemplate({ reportContent });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('screen');

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
      });
    fs.writeFileSync(path.join(__dirname, 'test-output.pdf'), pdfBuffer);
    console.log('✅ PDF écrit localement dans controllers/test-output.pdf');
      
    await browser.close();
    res.attachment('rapport_patient.pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la génération du rapport' });
  }
};

module.exports = { generatePatientReport };