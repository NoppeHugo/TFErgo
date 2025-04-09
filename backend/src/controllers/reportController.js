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
    // Récupération du patient et de ses données
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

    // Séparation des contacts par type
    const references = patient.contacts.filter((c) => c.type === "reference");
    const personals = patient.contacts.filter((c) => c.type === "personal");

    // Récupération du premier motif d’intervention (s’il existe)
    const motif = patient.interventionReasons[0] || {};

    // Définition des sections
    // Fusionner "Références et Contacts" et "Contacts Personnels" sous la clé "contacts"
    const sections = {
      patientInfo: {
        title: "Données client",
        content: `
<strong>Sexe :</strong> ${patient.sex || ""}<br/>
<strong>Nationalité :</strong> ${patient.nationality || ""}<br/>
<strong>Adresse :</strong> ${patient.address || ""}<br/>
<strong>Téléphone :</strong> ${patient.phone1 || ""}, ${patient.phone2 || ""}<br/>
<strong>Email :</strong> ${patient.email || ""}
        `,
      },
      contacts: {
        title: "Références & Contacts",
        content: `
${references.map((r) => `${r.relation || ""} (${r.firstName || ""} ${r.lastName || ""})`).join("<br/>")}
<br/>
${personals.map((p) => `${p.relation || ""} (${p.firstName || ""} ${p.lastName || ""})`).join("<br/>")}
        `,
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
        `,
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
        `,
      },
      diagnostic: {
        title: "Diagnostic",
        content: patient.diagnostics
          .map((d) =>
            `<p><strong>${new Date(d.createdAt).toLocaleDateString()}</strong> — ${d.diagnosticText}</p>`
          )
          .join(""),
      },
      comptesRendus: {
        title: "Comptes rendus",
        content:
          motif?.compteRenduInterventions
            ?.map((i) => `<p><strong>${i.date}</strong><br/>${i.texte}</p>`)
            .join("") || "",
      },
      synthese: {
        title: "Synthèse",
        content: motif?.synthese || "",
      },
    };

    // Ne conserver que les sections sélectionnées
    const reportContent = selectedSections.map((key) => ({
      title: sections[key]?.title || "",
      content: sections[key]?.content || "<em>Non renseigné</em>",
    }));

    // Extraction des sous-sections (<h3>) pour chaque section
    // On génère une numérotation "Section.SousIndex" pour chaque <h3> trouvé dans le contenu
    reportContent.forEach((section, sIndex) => {
      const regex = /<h3>(.*?)<\/h3>/g;
      section.subsections = [];
      let match;
      let subCounter = 1;
      while ((match = regex.exec(section.content)) !== null) {
        const subTitle = match[1].trim();
        // Génère un numéro sous la forme "X.Y" où X = numéro de section
        const subNumber = `${sIndex + 1}.${subCounter}`;
        section.subsections.push({
          number: subNumber,
          title: subTitle,
        });
        subCounter++;
      }
    });

    // Helpers Handlebars pour la numérotation dans le contenu
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

    // Lecture et compilation du template Handlebars
    const templatePath = path.resolve(__dirname, "../../templates/reportTemplate.hbs");
    const source = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(source);

    // Injection des données dans le template
    const html = template({
      patientName: `${patient.firstName} ${patient.lastName}`,
      birthDate: new Date(patient.birthdate).toLocaleDateString(),
      reportDate: new Date().toLocaleDateString(),
      therapistName: `${patient.therapist.name}`,
      reportContent,
    });

    // Génération du PDF via Puppeteer
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

    // Construction du nom du fichier PDF
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
