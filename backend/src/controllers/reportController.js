const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const generatePatientReport = async (req, res) => {
  const { patientId } = req.params;
  const { selectedSections } = req.body;

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) },
      include: {
        therapist: true,
        contacts: true,
        diagnostics: true,
        interventionReports: true,
        syntheses: true,
        interventionReasons: true
      }
    });

    if (!patient) return res.status(404).json({ message: 'Patient introuvable' });

    const references = patient.contacts.filter(c => c.type === 'reference');
    const personals = patient.contacts.filter(c => c.type === 'personal');

    const motif = patient.interventionReasons[0] || {};
    const therapeutic = motif.therapeutic || {};

    const sections = {
      patientInfo: {
        title: 'Données client',
        content: `Nom: ${patient.lastName} ${patient.firstName}
Sexe: ${patient.sex}
Date de naissance: ${patient.birthdate?.toLocaleDateString() || ''}
Nationalité: ${patient.nationality || ''}
Adresse: ${patient.address || ''}
Téléphone: ${patient.phone1 || ''}${patient.phone2 ? ', ' + patient.phone2 : ''}
Email: ${patient.email || ''}`
      },
      references: {
        title: 'Références et Contacts',
        content: references.map(c => `- ${c.firstName || ''} ${c.lastName || ''} (${c.relation || ''}) - ${c.phone || ''}`).join('\n')
      },
      personalContacts: {
        title: 'Contacts Personnels',
        content: personals.map(c => `- ${c.firstName || ''} ${c.lastName || ''} (${c.relation || ''}) - ${c.phone || ''}`).join('\n')
      },
      medicalData: {
        title: 'Données de Santé',
        content: `Diagnostic Médical :\n${patient.medicalDiagnosis || ''}
\nAntécédents Médicaux :\n${patient.medicalHistory || ''}
\nChronique de santé :\n${patient.healthChronicle || ''}`
      },
      motif: {
        title: 'Motif d’intervention',
        content: `Synthèse de l'évaluation :\n${therapeutic.syntheseEvaluation || ''}
\nRestrictions de participation :\n${therapeutic.restrictionsSouhaits || ''}
\nDiagnostic occupationnel :\n${therapeutic.diagnosticOccupationnel || ''}`
      },
      diagnostic: {
        title: 'Diagnostic',
        content: patient.diagnostics.map(d => `- ${new Date(d.createdAt).toLocaleDateString()} : ${d.diagnosticText}`).join('\n')
      },
      comptesRendus: {
        title: 'Comptes rendus',
        content: patient.interventionReports.map(r => `- ${new Date(r.date).toLocaleDateString()} : ${r.interventionText}`).join('\n')
      },
      synthese: {
        title: 'Synthèse',
        content: patient.syntheses.map(s => `- ${new Date(s.createdAt).toLocaleDateString()} : ${s.synthesisText}`).join('\n')
      }
    };

    const reportContent = selectedSections.map(key => ({
      title: sections[key]?.title || '',
      content: sections[key]?.content || ''
    }));

    const templatePath = path.resolve(__dirname, '..', '..', 'templates', 'reportTemplate.hbs');
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateHtml);
    const html = compiledTemplate({
      patientName: `${patient.firstName} ${patient.lastName}`,
      birthDate: patient.birthdate?.toLocaleDateString() || '',
      reportDate: new Date().toLocaleDateString(),
      therapistName: patient.therapist?.name || 'Ergothérapeute',
      reportContent
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('screen');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=rapport_patient.pdf',
      'Content-Length': pdfBuffer.length
    });
    res.end(pdfBuffer);
  } catch (err) {
    console.error('Erreur génération rapport PDF:', err);
    res.status(500).json({ message: 'Erreur lors de la génération du rapport' });
  }
};

module.exports = { generatePatientReport };
