const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
        syntheses: true,
        interventionReports: true,
        interventionReasons: true,
      },
    });

    const references = patient.contacts.filter(c => c.type === "reference");
    const personals = patient.contacts.filter(c => c.type === "personal");
    const motif = patient.interventionReasons[0] || {};

    const sections = {
      patientInfo: {
        title: "Données client",
        content: `
<strong>Sexe :</strong> ${patient.sex || ""}<br/>
<strong>Nationalité :</strong> ${patient.nationality || ""}<br/>
<strong>Adresse :</strong> ${patient.address || ""}<br/>
<strong>Téléphone :</strong> ${patient.phone1 || ""}, ${patient.phone2 || ""}<br/>
<strong>Email :</strong> ${patient.email || ""}
        `
      },
      references: {
        title: "Références et Contacts",
        content: references.map(r => `${r.relation || ""} (${r.firstName || ""} ${r.lastName || ""})`).join("<br/>")
      },
      personalContacts: {
        title: "Contacts Personnels",
        content: personals.map(p => `${p.relation || ""} (${p.firstName || ""} ${p.lastName || ""})`).join("<br/>")
      },
      medicalData: {
        title: "Données de Santé",
        content: `
<h3>Diagnostic Médical</h3>
${patient.medicalDiagnosis || ""}
<h3>Antécédents Médicaux</h3>
${patient.medicalHistory || ""}
<h3>Chronique de Santé</h3>
${patient.healthChronicle || ""}
        `
      },
      motif: {
        title: "Motif d’intervention",
        content: `
<h3>Synthèse de l'évaluation</h3>
${motif?.therapeutic?.syntheseEvaluation || ""}
<h3>Restrictions de participation</h3>
${motif?.therapeutic?.restrictionsSouhaits || ""}
<h3>Diagnostic occupationnel</h3>
${motif?.therapeutic?.diagnosticOccupationnel || ""}
        `
      },
      diagnostic: {
        title: "Diagnostic",
        content: patient.diagnostics.map(d => `<p><strong>${new Date(d.createdAt).toLocaleDateString()}</strong> — ${d.diagnosticText}</p>`).join("")
      },
      comptesRendus: {
        title: "Comptes rendus",
        content: motif?.compteRenduInterventions?.map(i => `<p><strong>${i.date}</strong><br/>${i.texte}</p>`).join("") || ""
      },
      synthese: {
        title: "Synthèse",
        content: motif?.synthese || ""
      }
    };

    const reportContent = selectedSections.map((key) => ({
      title: sections[key]?.title || "",
      content: sections[key]?.content || "<em>Non renseigné</em>"
    }));

    const templatePath = path.resolve(__dirname, "../../templates/reportTemplate.hbs");
    const source = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(source);
    const html = template({
      patientName: `${patient.firstName} ${patient.lastName}`,
      birthDate: patient.birthdate?.toLocaleDateString() || "",
      reportDate: new Date().toLocaleDateString("fr-FR"),
      therapistName: patient.therapist?.name || "Ergothérapeute",
      reportContent
    });

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=rapport_patient.pdf",
      "Content-Length": pdfBuffer.length,
    });

    res.end(pdfBuffer);
  } catch (err) {
    console.error("Erreur génération PDF:", err);
    res.status(500).json({ error: "Erreur génération PDF" });
  }
};

module.exports = { generatePatientReport };
