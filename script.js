async function generateResume() {
  document.getElementById("loading").style.display = "block";
  document.getElementById("resumeContent").innerHTML = "";

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const linkedin = document.getElementById("linkedin").value;

  const educationEntries = document.querySelectorAll("#educationSection .education-entry");
  let educationList = [];

  educationEntries.forEach(entry => {
    const degree = entry.querySelector('input[name="education"]')?.value || "";
    const university = entry.querySelector('input[name="university"]')?.value || "";
    const gradYear = entry.querySelector('input[name="gradYear"]')?.value || "";
    if (degree && university && gradYear) {
      educationList.push(`${degree} - ${university} (${gradYear})`);
    }
  });

  const experienceEntries = document.querySelectorAll("#experienceSection .experience-entry");
  let experienceList = [];

  experienceEntries.forEach(entry => {
    const job = entry.querySelector('input[name="experience"]')?.value || "";
    const company = entry.querySelector('input[name="company"]')?.value || "";
    const duration = entry.querySelector('input[name="duration"]')?.value || "";
    const responsibilities = entry.querySelector('textarea[name="responsibilities"]')?.value || "";
    if (job && company && duration) {
      experienceList.push(`${job} at ${company} (${duration}) - ${responsibilities}`);
    }
  });

  const skills = document.getElementById("skills").value;
  const projects = document.getElementById("projects").value;
  const industry = document.getElementById("industry").value;
  const jobDescription = document.getElementById("jobDescription").value;
  const template = document.getElementById("templateSelect").value;

  const prompt = `
You are an expert resume writer, career strategist, and ATS optimization specialist.

Generate a complete, ATS-optimized, professional resume in HTML format using the "${template}" style.

Candidate Info:
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Address: ${address}
LinkedIn: ${linkedin}

Education:
${educationList.join("\n")}

Experience:
${experienceList.join("\n")}

Skills: ${skills}
Projects: ${projects}
Industry: ${industry}
Target Job Description: ${jobDescription}
`;

  try {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        Authorization: "Bearer cQfKlyNzlphLOcmsXVxdgYOUiImSTHfpWg86HDl9", // Replace with real key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-r",
        message: prompt,
        temperature: 0.7,
        max_tokens: 1800,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API Error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const result = data.text || data.generation || data.response || "No response.";

    // Clean output
    const cleanHTML = result
      .replace(/```html/g, "")
      .replace(/```/g, "")
      .trim();

    document.getElementById("resumeContent").innerHTML = cleanHTML;
  } catch (error) {
    console.error("Error generating resume:", error);
    alert("An error occurred while generating the resume.");
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}


function exportPDF() {
  const resumeContent = document.getElementById("resumeContent").innerHTML;
  const fullName = document.getElementById("fullName").value || "resume";

  const win = window.open("", "", "height=800,width=800");
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${fullName} - Resume</title>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 0; 
          color: #333;
          line-height: 1.6;
        }
        .resume-template {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding: 20mm;
        }
        .resume-header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 2px solid #007bff;
        }
        .resume-section {
          margin-bottom: 20px;
        }
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="resume-template">
        ${resumeContent}
      </div>
      <script>
        setTimeout(function() {
          window.print();
          window.close();
        }, 500);
      </script>
    </body>
    </html>
  `);
  win.document.close();
}

function exportHTML() {
  const resumeContent = document.getElementById("resumeContent").innerHTML;
  const fullName = document.getElementById("fullName").value || "resume";
  const blob = new Blob(
    [
      `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${fullName} - Resume</title>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 20mm; 
          color: #333;
          line-height: 1.6;
        }
        .resume-header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 2px solid #007bff;
        }
        .resume-section {
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      ${resumeContent}
    </body>
    </html>
  `,
    ],
    { type: "text/html" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${fullName.replace(/\s+/g, "_")}_resume.html`;
  a.click();
}

function exportDOC() {
  const resumeContent = document.getElementById("resumeContent").innerHTML;
  const fullName = document.getElementById("fullName").value || "resume";

  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>Export HTML To Doc</title></head><body>`;

  const footer = `</body></html>`;
  const sourceHTML = header + resumeContent + footer;

  const blob = new Blob(["\ufeff", sourceHTML], {
    type: "application/msword",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${fullName.replace(/\s+/g, "_")}_resume.doc`;
  a.click();
}
function addEducation() {
  const educationSection = document.createElement("div");
  educationSection.classList.add("education-entry");

  educationSection.innerHTML = `
    <label>Degree:</label>
    <input type="text" name="education" placeholder="e.g., Bachelor of Science in Computer Science" required />

    <label>University Name:</label>
    <input type="text" name="university" placeholder="e.g., University of Cape Town" required />

    <label>Graduation Year:</label>
    <input type="text" name="gradYear" placeholder="e.g., 2024" required />
    <hr/>
  `;

  const container = document.getElementById("educationSection");
  container.insertBefore(educationSection, container.querySelector(".add-btn"));
}

function addExperience() {
  const experienceSection = document.createElement("div");
  experienceSection.classList.add("experience-entry");

  experienceSection.innerHTML = `
    <label>Job Title:</label>
    <input type="text" name="experience" placeholder="e.g., Software Developer Intern" required />

    <label>Company Name:</label>
    <input type="text" name="company" placeholder="e.g., Microsoft" required />

    <label>Duration:</label>
    <input type="text" name="duration" placeholder="e.g., Jan 2023 - Dec 2023" required />

    <label>Key Responsibilities (comma separated):</label>
    <textarea name="responsibilities" placeholder="e.g., Developed web applications, Collaborated with cross-functional teams"></textarea>
    <hr/>
  `;

  const container = document.getElementById("experienceSection");
  container.insertBefore(
    experienceSection,
    container.querySelector(".add-btn")
  );
}