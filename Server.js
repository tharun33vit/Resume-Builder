const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { name, education, experience, jobRole } = req.body;

  const prompt = `
You are a professional HR assistant.

Generate a full professional resume and a customized cover letter using the following details:

Name: ${name}
Education: ${education}
Experience: ${experience}
Job Role: ${jobRole}

✅ Resume should include:
- Objective
- Education
- Experience
- Skills (guess based on job role if not provided)

✅ Cover Letter should include:
- Greeting
- Introduction
- Role of interest
- Why the candidate is a good fit
- Closing with contact info

🎯 Format the output clearly with section headings like:

Resume:
[Full resume]

Cover Letter:
[Full cover letter]
`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "tinyllama",  // ✅ Using lightweight, low-RAM model
        prompt: prompt,
        stream: false
      })
    });

    const data = await response.json();

    if (!data || !data.response) {
      return res.status(500).json({
        error: "TinyLLaMA response is invalid or empty.",
        details: data
      });
    }

    res.json({ output: data.response });

  } catch (err) {
    console.error("❌ Local AI generation error:", err);
    res.status(500).json({ error: "Failed to generate using TinyLLaMA." });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000 using TinyLLaMA");
});