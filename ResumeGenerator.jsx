import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const ResumeGenerator = () => {
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    experience: '',
    jobRole: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setOutput('');

    try {
      const res = await fetch('http://localhost:3000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.output) {
        setOutput(data.output.trim());
      } else {
        alert("No response from server.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('resume-output');
    const opt = {
      margin:       0.5,
      filename:     'Resume_and_Cover_Letter.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="container" style={{ maxWidth: '900px', marginTop: '40px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 className="mb-4 text-center">📄 Resume & Cover Letter Generator</h2>

      <div className="card shadow-sm p-4">
        <form onSubmit={handleGenerate}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">👤 Name</label>
            <input 
              type="text" className="form-control" id="name" 
              placeholder="e.g., Tharun Kumar M"
              value={formData.name} onChange={handleChange} required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="education" className="form-label">🎓 Education</label>
            <textarea 
              className="form-control" id="education" 
              placeholder="e.g., B.Tech in Computer Science, XYZ University"
              value={formData.education} onChange={handleChange} required
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="experience" className="form-label">💼 Work Experience</label>
            <textarea 
              className="form-control" id="experience" 
              placeholder="e.g., 2 years as AI Intern at ABC Corp"
              value={formData.experience} onChange={handleChange} required
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="jobRole" className="form-label">🎯 Job Role Applying For</label>
            <input 
              type="text" className="form-control" id="jobRole" 
              placeholder="e.g., AI Engineer"
              value={formData.jobRole} onChange={handleChange} required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? 'Generating...' : '🚀 Generate'}
          </button>

          {isLoading && (
            <div className="mt-3 text-center text-muted">
              <div className="spinner-border text-primary" role="status" style={{ width: '1.5rem', height: '1.5rem' }}></div>
              <span className="ms-2">Generating, please wait...</span>
            </div>
          )}
        </form>
      </div>

      {output && (
        <div className="mt-4" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">📄 Generated Output</h4>
            <button className="btn btn-success" onClick={handleDownloadPDF}>
              📥 Download PDF
            </button>
          </div>
          
          <div id="resume-output" className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>
            {output}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeGenerator;
