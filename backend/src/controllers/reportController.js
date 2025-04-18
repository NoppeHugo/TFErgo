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

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: {
        activities: { include: { activity: true } },
        feedbacks: true,
      },
      orderBy: { date: 'asc' }
    });

    const references = patient.contacts.filter((c) => c.type === "reference");
    const personals = patient.contacts.filter((c) => c.type === "personal");
    const motif = patient.interventionReasons[0] || {};

    const appointmentsSection = {
      title: "Rendez-vous",
      content: appointments.map((apt) => {
        const date = new Date(apt.date).toLocaleDateString("fr-FR");
        const activities = apt.activities.length
          ? `<ul>${apt.activities.map((link) => `<li>${link.activity.name}</li>`).join("")}</ul>`
          : "<em>Aucune activité</em>";

        const feedbacks = apt.feedbacks.length
          ? apt.feedbacks.map(
              (fb) =>
                `<p>${"★".repeat(fb.rating)}${"☆".repeat(5 - fb.rating)} — ${fb.objective} ${fb.completed ? "(✅ terminé)" : ""}</p>`
            ).join("")
          : "<em>Aucun retour</em>";

        return `
          <h3>${apt.title} — ${date}</h3>
          <p>${apt.description || ""}</p>
          <p><strong>Activités réalisées :</strong></p>
          ${activities}
          <p><strong>Retour sur la séance :</strong></p>
          ${feedbacks}
          ${apt.sessionReport ? `<p><strong>Compte rendu :</strong><br/>${apt.sessionReport}</p>` : ""}
        `;
      }).join("<hr/>")
    };

    const sections = {
      patientInfo: {
        title: "Données client",
        content: `
<strong>Sexe :</strong> ${patient.sex || ""}<br/>
<strong>Nationalité :</strong> ${patient.nationality || ""}<br/>
<strong>Adresse :</strong> ${patient.address || ""}<br/>
<strong>Téléphone :</strong> ${patient.phone1 || ""}, ${patient.phone2 || ""}<br/>
<strong>Email :</strong> ${patient.email || ""}`
      },
      contacts: {
        title: "Références & Contacts",
        content: `
${references.map((r) => `${r.relation || ""} (${r.firstName || ""} ${r.lastName || ""})`).join("<br/>")}
<br/>
${personals.map((p) => `${p.relation || ""} (${p.firstName || ""} ${p.lastName || ""})`).join("<br/>")}`
      },
      medicalData: {
        title: "Données de Santé",
        content: `
<h3>Diagnostic Médical</h3>
${patient.medicalDiagnosis || ""}
<h3>Antécédents Médicaux</h3>
${patient.medicalHistory || ""}
<h3>Chronique de Santé</h3>
${patient.healthChronicle || ""}`
      },
      motif: {
        title: "Motif d’intervention",
        content: `
<h3>Synthèse de l'évaluation</h3>
${motif?.therapeutic?.syntheseEvaluation || ""}
<h3>Restrictions de participation</h3>
${motif?.therapeutic?.restrictionsSouhaits || ""}
<h3>Diagnostic occupationnel</h3>
${motif?.therapeutic?.diagnosticOccupationnel || ""}`
      },
      diagnostic: {
        title: "Diagnostic",
        content: patient.diagnostics
          .map((d) => `<p><strong>${new Date(d.createdAt).toLocaleDateString()}</strong> — ${d.diagnosticText}</p>`)
          .join("")
      },
      comptesRendus: {
        title: "Comptes rendus",
        content:
          motif?.compteRenduInterventions
            ?.map((i) => `<p><strong>${i.date}</strong><br/>${i.texte}</p>`)
            .join("") || ""
      },
      synthese: {
        title: "Synthèse",
        content: motif?.synthese || ""
      },
      appointments: appointmentsSection
    };

    const reportContent = selectedSections.map((key) => ({
      title: sections[key]?.title || "",
      content: sections[key]?.content || "<em>Non renseigné</em>"
    }));

    reportContent.forEach((section, sIndex) => {
      const regex = /<h3>(.*?)<\/h3>/g;
      section.subsections = [];
      let match;
      let subCounter = 1;
      while ((match = regex.exec(section.content)) !== null) {
        const subTitle = match[1].trim();
        const subNumber = `${sIndex + 1}.${subCounter}`;
        section.subsections.push({
          number: subNumber,
          title: subTitle,
        });
        subCounter++;
      }
    });

    handlebars.registerHelper("addOne", function (index) {
      return index + 1;
    });
    handlebars.registerHelper("autoNumberSubsections", function (content, sectionNumber) {
      if (!content) return "";
      return content.replace(/<h3>(.*?)<\/h3>/g, function (_, title) {
        if (!this._counter) this._counter = {};
        if (!this._counter[sectionNumber]) this._counter[sectionNumber] = 1;
        const subNum = this._counter[sectionNumber]++;
        return `<h3>${sectionNumber}.${subNum} ${title}</h3>`;
      }.bind(this));
    });

    const templatePath = path.resolve(__dirname, "../../templates/reportTemplate.hbs");
    const source = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(source);

    const html = template({
      patientName: `${patient.firstName} ${patient.lastName}`,
      birthDate: new Date(patient.birthdate).toLocaleDateString(),
      reportDate: new Date().toLocaleDateString(),
      therapistName: `${patient.therapist.name}`,
      reportContent,
    });

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      margin: {
        top: "20mm",
        right: "24mm",
        bottom: "30mm",
        left: "24mm",
      },
      headerTemplate: "<span></span>",
      footerTemplate: `
        <div style="font-size:12px; width:100%; text-align:right; padding-right:80px; padding-bottom:10px;">
          <span class="pageNumber"></span>
        </div>
      `,
    });
    await browser.close();

    const today = new Date().toISOString().split("T")[0];
    const firstName = patient.firstName.trim().replace(/\s+/g, "_");
    const lastName = patient.lastName.trim().replace(/\s+/g, "_");
    const fileName = `${today}_${firstName}_${lastName}_Rapport.pdf`;
    const encodedFileName = encodeURIComponent(fileName);
    res.set({
      "Access-Control-Expose-Headers": "Content-Disposition",
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"; filename*=UTF-8''${encodedFileName}`,
      "Content-Length": pdfBuffer.length,
    });
    res.end(pdfBuffer);
  } catch (err) {
    console.error("Erreur génération PDF:", err);
    res.status(500).json({ error: "Erreur génération PDF" });
  }
};

module.exports = { generatePatientReport };
