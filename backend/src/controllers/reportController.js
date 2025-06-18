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

    // Ajout récupération des notes du patient
    let notes = [];
    if (selectedSections.includes('notes')) {
      notes = await prisma.note.findMany({
        where: { patientId: patient.id },
        orderBy: { noteDate: 'desc' },
      });
    }

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: {
        activities: { include: { activity: true } },
        feedbacks: { include: { evaluationItem: true } },
      },
      orderBy: { date: 'asc' }
    });

    const references = patient.contacts.filter((c) => c.type === "reference");
    const personals = patient.contacts.filter((c) => c.type === "personal");
    let motif = patient.interventionReasons[0] || {};

    // Correction : parser les champs JSON du motif
    if (motif) {
      if (typeof motif.situation === 'string') {
        try { motif.situation = JSON.parse(motif.situation); } catch { motif.situation = {}; }
      }
      if (typeof motif.therapeutic === 'string') {
        try { motif.therapeutic = JSON.parse(motif.therapeutic); } catch { motif.therapeutic = {}; }
      }
      if (typeof motif.objectives === 'string') {
        try { motif.objectives = JSON.parse(motif.objectives); } catch { motif.objectives = []; }
      }
      if (typeof motif.compteRenduInterventions === 'string') {
        try { motif.compteRenduInterventions = JSON.parse(motif.compteRenduInterventions); } catch { motif.compteRenduInterventions = []; }
      }
      // Ajout : parser batteries Code CIF si présent
      if (typeof motif.batteriesCIF === 'string') {
        try { motif.batteriesCIF = JSON.parse(motif.batteriesCIF); } catch { motif.batteriesCIF = []; }
      }
    }

    // Correction robustesse batteriesCIF :
    // 1. Gérer batteriesCIF venant de batteriesCodeCIF si batteriesCIF absent
    if (!motif.batteriesCIF && motif.batteriesCodeCIF) {
      // batteriesCodeCIF peut être string (JSON) ou array
      if (typeof motif.batteriesCodeCIF === 'string') {
        try { motif.batteriesCIF = JSON.parse(motif.batteriesCodeCIF); } catch { motif.batteriesCIF = []; }
      } else if (Array.isArray(motif.batteriesCodeCIF)) {
        motif.batteriesCIF = motif.batteriesCodeCIF;
      } else {
        motif.batteriesCIF = [];
      }
    }
    // 2. Si batteriesCIF est string, parser
    if (typeof motif.batteriesCIF === 'string') {
      try { motif.batteriesCIF = JSON.parse(motif.batteriesCIF); } catch { motif.batteriesCIF = []; }
    }
    // 3. Si batteriesCIF est un objet unique, transformer en array
    if (motif.batteriesCIF && !Array.isArray(motif.batteriesCIF)) {
      motif.batteriesCIF = [motif.batteriesCIF];
    }

    // Correction batteriesCIF : récupérer depuis therapeutic.assesments si batteriesCIF vide
    if ((!motif.batteriesCIF || motif.batteriesCIF.length === 0) && motif.therapeutic && motif.therapeutic.assesments) {
      // assesments peut être string (JSON), array, ou string simple
      if (typeof motif.therapeutic.assesments === 'string') {
        try {
          const parsed = JSON.parse(motif.therapeutic.assesments);
          motif.batteriesCIF = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          // Si ce n'est pas du JSON, on considère comme string simple
          motif.batteriesCIF = [motif.therapeutic.assesments];
        }
      } else if (Array.isArray(motif.therapeutic.assesments)) {
        motif.batteriesCIF = motif.therapeutic.assesments;
      } else {
        motif.batteriesCIF = [motif.therapeutic.assesments];
      }
    }

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
                `<p>${"★".repeat(fb.rating)}${"☆".repeat(5 - fb.rating)} — ${fb.evaluationItem?.title || "Non précisé"} ${fb.completed ? "(✅ terminé)" : ""}</p>`
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

    // Génération dynamique des champs non vides pour la section Données client
    const patientFieldLabels = {
      firstName: "Prénom",
      lastName: "Nom",
      birthdate: "Date de naissance",
      sex: "Sexe",
      nationality: "Nationalité",
      address: "Adresse",
      phone1: "Téléphone 1",
      phone2: "Téléphone 2",
      email: "Email",
      facturerA: "Facturer à",
      zoneResidence: "Zone de résidence",
      etatCivil: "État civil",
      nbrEnfants: "Nombre d'enfants",
      profession: "Profession",
      employeur: "Employeur",
      mutuelle: "Mutuelle",
      numeroMutuelle: "Numéro mutuelle",
      numeroRegistre: "Numéro registre national",
      medecinTraitant: "Médecin traitant",
      medecinSpecialiste: "Médecin spécialiste",
      // Ajoute ici d'autres champs pertinents si besoin
    };
    const patientInfoRows = Object.entries(patientFieldLabels)
      .filter(([key]) => patient[key])
      .map(([key, label]) => `<tr><td style='font-weight:bold;padding-right:10px;'>${label}</td><td>${patient[key]}</td></tr>`)
      .join("");

    const sections = {
      patientInfo: {
        title: "Données client",
        content: `<table style='border:none;'>${patientInfoRows}</table>`
      },
      contacts: {
        title: "Références & Contacts",
        content: `
<h4 style='margin-bottom:4px;'>Références</h4>
<table style='border-collapse:collapse;width:100%;margin-bottom:10px;'>
  <thead>
    <tr style='background:#f0f0f0;'>
      <th style='border:1px solid #ccc;padding:4px;'>Nom</th>
      <th style='border:1px solid #ccc;padding:4px;'>Prénom</th>
      <th style='border:1px solid #ccc;padding:4px;'>Relation</th>
      <th style='border:1px solid #ccc;padding:4px;'>Téléphone</th>
      <th style='border:1px solid #ccc;padding:4px;'>Email</th>
      <th style='border:1px solid #ccc;padding:4px;'>Commentaire</th>
    </tr>
  </thead>
  <tbody>
    ${references.length > 0
      ? references.map(c => `
        <tr>
          <td style='border:1px solid #ccc;padding:4px;'>${c.lastName || ""}</td>
          <td style='border:1px solid #ccc;padding:4px;'>${c.firstName || ""}</td>
          <td style='border:1px solid #ccc;padding:4px;'>${c.relation || ""}</td>
          <td style='border:1px solid #ccc;padding:4px;'>${c.phone || ""}</td>
          <td style='border:1px solid #ccc;padding:4px;'>${c.email || ""}</td>
          <td style='border:1px solid #ccc;padding:4px;'>${c.comment || ""}</td>
        </tr>
      `).join("")
      : `<tr><td colspan='6' style='text-align:center;'>Aucune référence renseignée</td></tr>`}
  </tbody>
</table>
<h4 style='margin-bottom:4px;'>Contacts personnels</h4>
<table style='border-collapse:collapse;width:100%;margin-bottom:10px;'>
  <thead>
    <tr style='background:#f0f0f0;'>
      <th style='border:1px solid #ccc;padding:4px;'>Nom</th>
      <th style='border:1px solid #ccc;padding:4px;'>Prénom</th>
      <th style='border:1px solid #ccc;padding:4px;'>Relation</th>
      <th style='border:1px solid #ccc;padding:4px;'>Téléphone</th>
      <th style='border:1px solid #ccc;padding:4px;'>Email</th>
      <th style='border:1px solid #ccc;padding:4px;'>Commentaire</th>
    </tr>
  </thead>
  <tbody>
    ${personals.length > 0
      ? personals.map(c => `
        <tr>
          <td style='border:1px solid #ccc;padding:4px;'>${c.lastName || ""}</td>
          <td style='border:1px solid #ccc;padding:4px;'>${c.firstName || ""}</td>
          <td style='border:1px solid #ccc;padding:4px;'>${c.relation || ""}</td>
          <td style='border:1px solid #ccc;padding:4px;'>${c.phone || ""}</td>
          <td style='border:1px solid #ccc;padding:4px;'>${c.email || ""}</td>
          <td style='border:1px solid #ccc;padding:4px;'>${c.comment || ""}</td>
        </tr>
      `).join("")
      : `<tr><td colspan='6' style='text-align:center;'>Aucun contact personnel renseigné</td></tr>`}
  </tbody>
</table>`
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
<h3>Situation personnelle</h3>
${motif?.situation?.personne || ""}<br/>
${motif?.situation?.occupation || ""}<br/>
${motif?.situation?.environnement || ""}

<h3>Perspective thérapeutique</h3>
${Array.isArray(motif.batteriesCIF) && motif.batteriesCIF.length > 0
  ? `<div style='margin-top:8px;'><strong>Batteries Code CIF :</strong><ul>${motif.batteriesCIF.map(b => `<li>${b.nom || b.name || b}</li>`).join("")}</ul></div>`
  : "<div style='margin-top:8px;'><strong>Batteries Code CIF :</strong> <em>Aucune batterie renseignée</em></div>"}
${motif?.therapeutic?.syntheseEvaluation || ""}<br/>
${motif?.therapeutic?.restrictionsSouhaits || ""}<br/>
${motif?.therapeutic?.diagnosticOccupationnel || ""}



<h3>Objectifs</h3>
${Array.isArray(motif.objectives) && motif.objectives.length > 0
  ? `<ul>${motif.objectives.map(obj => `
      <li>
        <strong>${obj.titre || obj.title || "Sans titre"}</strong><br/>
        <span style='font-size:12px;color:#888;'>Début : ${obj.dateDebut ? new Date(obj.dateDebut).toLocaleDateString("fr-FR") : "-"} / Fin : ${obj.dateFin ? new Date(obj.dateFin).toLocaleDateString("fr-FR") : "-"}</span><br/>
        <span>${obj.description || ""}</span><br/>
        <span>Statut : ${obj.statut || obj.status || "-"}</span>
      </li>`).join("")}</ul>`
  : "<em>Aucun objectif renseigné</em>"}

<h3>Diagnostic</h3>
${motif?.diagnostic || "<em>Non renseigné</em>"}

<h3>Compte rendu</h3>
${Array.isArray(motif.compteRenduInterventions) && motif.compteRenduInterventions.length > 0
  ? motif.compteRenduInterventions.map(i => `<p><strong>${i.date ? new Date(i.date).toLocaleDateString("fr-FR") : ""}</strong><br/>${i.texte || i.text || ""}</p>`).join("")
  : "<em>Aucun compte rendu</em>"}

<h3>Synthèse</h3>
${motif?.synthese || "<em>Non renseigné</em>"}`
      },
      appointments: appointmentsSection,
      notes: {
        title: "Carnet de notes",
        content: notes.length > 0
          ? `<ul>${notes.map(note => `
              <li style='margin-bottom:10px;'>
                <strong>${note.title || "Sans titre"}</strong><br/>
                <span style='font-size:12px;color:#888;'>${new Date(note.noteDate).toLocaleDateString("fr-FR")}</span><br/>
                <span>${note.description || ""}</span>
              </li>
            `).join("")}</ul>`
          : "<em>Aucune note pour ce patient.</em>"
      },
    };

    const reportContent = selectedSections.map((key) => ({
      title: sections[key]?.title || "",
      content: sections[key]?.content || "<em>Non renseigné</em>"
    }));

    // Nettoyage du sommaire : ne garder que les sections effectivement présentes
    const filteredReportContent = reportContent.filter(section => section.title && section.content && section.content !== "<em>Non renseigné</em>");

    filteredReportContent.forEach((section, sIndex) => {
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
      reportContent: filteredReportContent,
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