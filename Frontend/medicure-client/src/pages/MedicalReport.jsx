import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import API from '../api/axios'
import { analyzeReport } from '../services/reportService'
import Loader from '../components/Loader'
import ReportCard from '../components/ReportCard'
import ReportModal from '../components/ReportModal'

const normalizeList = (data, key) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.[key])) return data[key]
  return []
}

const MedicalReport = () => {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  const fetchReports = async () => {
    try {
      setLoading(true)

      const { data } = await API.get('/reports')

      setReports(normalizeList(data, 'reports'))
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setAnalyzing(true)
    try {
      const data = await analyzeReport(file)
      setResult(data)
      await fetchReports()
    } catch (e) {
      setResult({ error: 'Analysis failed. Check backend connection.' })
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <MainLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Medical Reports</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Upload and analyze your medical reports with AI</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
              Upload Report
            </h2>

            <div
              onDragEnter={() => setDragging(true)}
              onDragLeave={() => setDragging(false)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]); setDragging(false) }}
              style={{
                border: `2px dashed ${dragging ? '#2563eb' : '#e2e8f0'}`,
                borderRadius: '12px', padding: '32px', textAlign: 'center',
                background: dragging ? '#eff6ff' : '#f8fafc', cursor: 'pointer',
                marginBottom: '16px', transition: 'all 0.2s'
              }}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                {file ? file.name : 'Drop file or click to upload'}
              </p>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>PDF, JPG, PNG up to 10MB</p>
              <input id="fileInput" type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />
            </div>

            <button onClick={handleSubmit} disabled={!file || analyzing} style={{
              width: '100%', padding: '12px', background: !file || analyzing ? '#93c5fd' : '#2563eb',
              color: 'white', border: 'none', borderRadius: '10px', cursor: !file || analyzing ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif'
            }}>
              {analyzing ? 'Analyzing...' : 'Analyze Report'}
            </button>

          {result && (
  <div
    style={{
      marginTop: '16px',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
    }}
  >

    {/* HEADER */}

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}
    >
      <div>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '4px'
          }}
        >
          AI Analysis Result
        </h3>

        <p
          style={{
            fontSize: '13px',
            color: '#64748b'
          }}
        >
          Medical report analyzed successfully
        </p>
      </div>

      <span
        style={{
          background: '#dcfce7',
          color: '#15803d',
          fontSize: '12px',
          padding: '6px 12px',
          borderRadius: '999px',
          fontWeight: '600'
        }}
      >
        Completed
      </span>
    </div>

    {/* SUMMARY */}

    <div style={{ marginBottom: '22px' }}>
      <h4
        style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '10px'
        }}
      >
        Summary
      </h4>

      <p
        style={{
          fontSize: '14px',
          lineHeight: '1.8',
          color: '#475569'
        }}
      >
        {
          result?.sections?.find(
            section => section.type === 'summary'
          )?.content || 'Analysis completed successfully.'
        }
      </p>
    </div>

    {/* PATIENT DETAILS */}

    {result?.sections?.find(
      section => section.type === 'patient'
    ) && (
      <div style={{ marginBottom: '24px' }}>
        <h4
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '14px'
          }}
        >
          Patient Details
        </h4>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}
        >
          {result.sections
            .find(section => section.type === 'patient')
            ?.content?.map((item, index) => (
              <div
                key={index}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              >
                <p
                  style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginBottom: '4px'
                  }}
                >
                  {item.label}
                </p>

                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0f172a'
                  }}
                >
                  {item.value || 'N/A'}
                </p>
              </div>
            ))}
        </div>
      </div>
    )}

    {/* DISEASES */}

    {result?.diseases?.length > 0 && (
      <div style={{ marginBottom: '20px' }}>
        <h4
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#dc2626',
            marginBottom: '12px'
          }}
        >
          Diseases
        </h4>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          {result.diseases.map((disease, index) => (
            <span
              key={index}
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '8px 14px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {
                typeof disease === 'object'
                  ? disease.name
                  : disease
              }
            </span>
          ))}
        </div>
      </div>
    )}

    {/* MEDICINES */}

    {result?.medicines?.length > 0 && (
      <div style={{ marginBottom: '20px' }}>
        <h4
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#2563eb',
            marginBottom: '12px'
          }}
        >
          Medicines
        </h4>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          {result.medicines.map((medicine, index) => (
            <span
              key={index}
              style={{
                background: '#dbeafe',
                color: '#2563eb',
                padding: '8px 14px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {
                typeof medicine === 'object'
                  ? medicine.name
                  : medicine
              }
            </span>
          ))}
        </div>
      </div>
    )}

    {/* TESTS */}

    {result?.tests?.length > 0 && (
      <div>
        <h4
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#15803d',
            marginBottom: '12px'
          }}
        >
          Tests
        </h4>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          {result.tests.map((test, index) => (
            <span
              key={index}
              style={{
                background: '#dcfce7',
                color: '#15803d',
                padding: '8px 14px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {
                typeof test === 'object'
                  ? test.name
                  : test
              }
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
)}
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            All Reports
          </h2>

          {loading ? (
            <Loader />
          ) : reports.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-600">
                No Reports Found
              </h3>

              <p className="text-gray-400 mt-2">
                Upload a medical report to begin analysis.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {reports.map(report => (
                <ReportCard
                  key={report._id || report.id || report.fileName}
                  report={report}
                  onClick={setSelectedReport}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
    </MainLayout>
  )
}

export default MedicalReport
