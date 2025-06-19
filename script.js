async function generateResume() {
  document.getElementById("loading").style.display = "block";
  document.getElementById("resumeContent").innerHTML = "";
 
  // Get user inputs
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const linkedin = document.getElementById("linkedin").value;

  // Education entries
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

// Experience entries
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

// Also include the original static fields
const staticEducation = {
  degree: document.getElementById("education")?.value,
  university: document.getElementById("university")?.value,
  gradYear: document.getElementById("gradYear")?.value,
};

if (staticEducation.degree && staticEducation.university && staticEducation.gradYear) {
  educationList.unshift(`${staticEducation.degree} - ${staticEducation.university} (${staticEducation.gradYear})`);
}

const staticExperience = {
  job: document.getElementById("experience")?.value,
  company: document.getElementById("company")?.value,
  duration: document.getElementById("duration")?.value,
  responsibilities: document.getElementById("responsibilities")?.value,
};

if (staticExperience.job && staticExperience.company && staticExperience.duration) {
  experienceList.unshift(`${staticExperience.job} at ${staticExperience.company} (${staticExperience.duration}) - ${staticExperience.responsibilities}`);
}

  const skills = document.getElementById("skills").value;
  const projects = document.getElementById("projects").value;
  const industry = document.getElementById("industry").value;
  const jobDescription = document.getElementById("jobDescription").value;

  // New: get selected template
  const template = document.getElementById("templateSelect").value;

  // Basic validation
  if (
    !fullName ||
    !email ||
    !education ||
    !university ||
    !gradYear ||
    !experience ||
    !company ||
    !duration ||
    !jobDescription
  ) {
    alert("Please fill in all required fields");
    document.getElementById("loading").style.display = "none";
    return;
  }

  // Construct the prompt including template style
  const prompt = `
You are an expert resume writer, career strategist, and ATS optimization specialist.

Generate a complete, ATS-optimized, visually professional resume in **clean, valid HTML format** only (no markdown, no explanations, no code blocks), using the "${template}" template style.

---

🎯 Your Task:

Generate a full resume using the candidate details below, **and intelligently expand any missing or vague fields** using knowledge of:

- The target job description
- Industry standards
- The candidate’s job title and education

If any section (e.g., **skills, responsibilities, projects**) is weak or missing:
- **Add realistic, valuable content** based on the candidate's role and the job description
- **Infer commonly used tools, technologies, programming languages**, and relevant experience
- **Write bullet points** that reflect the **impact**, not just duties
- Align content to **real-world expectations** for that role

---

📄 Formatting & Output Rules:

- ATS-friendly, single-column HTML layout
- Use professional section headers: **Summary, Skills, Experience, Education, Projects**
- Prioritize clear structure and scanability
- 3-4 lines of education
- Each section must include **at least 3-5 bullet points** or descriptive items
- The resume should be complete and detailed enough to be **2 pages long**


---

👤 Candidate Info:

- Full Name: ${fullName}
- Email: ${email}
- Phone: ${phone || "Not provided"}
- Address: ${address || "Not provided"}
- LinkedIn: ${linkedin || "Not provided"}

📚 Education Entries:
${educationList.join("\n")}

🧪 Experience Entries:
${experienceList.join("\n")}


🛠️ Skills: ${skills || "Not provided"}
🚀 Projects: ${projects || "Not provided"}
🏢 Industry: ${industry || "Not specified"}

📌 Job Description:
${jobDescription}
`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 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",
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.href,
          "X-Title": "AI Resume Generator",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);
    const result = data.choices[0].message.content;

    let cleanHTML = result
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