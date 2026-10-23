import { useState } from 'react'
import { FileText, Upload, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import { extractResumeText } from '../resumeParser.js'
import { analyzeCandidate, calculateMatch } from '../machineEngine.js'

function ResumeAnalyzer({ jobs }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [skills, setSkills] = useState([])
  const [results, setResults] = useState([])
  const [analyzed, setAnalyzed] = useState(false)

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    setSelectedFile(file || null)
    setError('')
    setSkills([])
    setResults([])
    setAnalyzed(false)
  }

  async function handleAnalyze() {
    if (!selectedFile) {
      setError('Please choose your resume first.')
      return
    }

    setLoading(true)
    setError('')
    setAnalyzed(false)

    try {
      const resumeText = await extractResumeText(selectedFile)
      const candidate = analyzeCandidate({ resumeText })
      const detectedSkills = candidate.detectedSkills

      const jobResults = jobs.map((job) => ({
        ...job,
        match: calculateMatch(detectedSkills, job.skills),
      })).sort((a, b) => b.match.score - a.match.score)

      setSkills(detectedSkills)
      setResults(jobResults)
      setAnalyzed(true)

      if (detectedSkills.length === 0) {
        setError('Resume read ho gaya, lekin supported skills nahi mili. Try a text-based resume with skills clearly listed.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resume could not be analyzed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="resume-analyzer panel">
      <div className="resume-heading">
        <div>
          <p className="eyebrow">YOUR CAREER, YOUR NEXT STEP</p>
          <h2>Resume Analyzer</h2>
          <p className="resume-subtitle">Upload your resume to discover your skills and see how they match available jobs.</p>
        </div>
        <div className="resume-heading-icon"><FileText size={25} /></div>
      </div>

      <div className="resume-upload-area">
        <div className="resume-upload-icon"><Upload size={23} /></div>
        <h3>Upload your resume</h3>
        <p>Choose a PDF or TXT file · Maximum 5 MB</p>
        <label className="resume-file-label">
          <input
            type="file"
            accept=".pdf,.txt,application/pdf,text/plain"
            onChange={handleFileChange}
          />
          <span>{selectedFile ? 'Choose another file' : 'Choose resume'}</span>
        </label>
        {selectedFile && (
          <div className="resume-selected-file">
            <FileText size={17} />
            <span>{selectedFile.name}</span>
            <CheckCircle2 size={17} />
          </div>
        )}
        <button
          type="button"
          className="resume-analyze-button"
          onClick={handleAnalyze}
          disabled={loading || !selectedFile}
        >
          <Sparkles size={17} />
          {loading ? 'Analyzing resume...' : 'Analyze my resume'}
        </button>
        <p className="resume-privacy-note">Your selected file is read in this browser; this component does not upload it to a server.</p>
      </div>

      {error && (
        <div className={`resume-message ${analyzed ? 'resume-message-info' : 'resume-message-error'}`}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {analyzed && (
        <div className="resume-results">
          <div className="resume-result-title">
            <div>
              <p className="eyebrow">ANALYSIS COMPLETE</p>
              <h3>Your resume results</h3>
            </div>
            <span className="resume-skill-count">{skills.length} skills found</span>
          </div>

          {skills.length > 0 ? (
            <div className="resume-skills">
              {skills.map((skill) => <span className="resume-skill-chip" key={skill}>{skill}</span>)}
            </div>
          ) : (
            <p className="resume-subtitle">No supported skills were detected in this resume.</p>
          )}

          <h3 className="resume-jobs-title">Job matches</h3>
          <p className="resume-subtitle">Match score means the percentage of each sample job's listed skills found in your resume. It is not a hiring probability.</p>

          <div className="resume-match-list">
            {results.map((job) => (
              <article className="resume-match-card" key={job.id}>
                <div className="resume-match-top">
                  <div>
                    <h4>{job.title}</h4>
                    <p>{job.company} · {job.type} · {job.mode}</p>
                  </div>
                  <strong>{job.match.score}%</strong>
                </div>
                <div className="resume-match-track">
                  <span style={{ width: `${job.match.score}%` }} />
                </div>
                <p className="resume-match-detail">
                  <span>Matched: {job.match.matchedSkills.join(', ') || 'None yet'}</span>
                  <span>To learn: {job.match.missingSkills.join(', ') || 'No listed skill gaps'}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default ResumeAnalyzer
