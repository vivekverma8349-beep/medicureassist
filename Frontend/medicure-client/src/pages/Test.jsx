import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import API from '../api/axios'

const normalizeList = (data, key) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.[key])) return data[key]
  return []
}

const resultColor = { Normal: { bg: '#f0fdf4', color: '#16a34a' }, Abnormal: { bg: '#fef2f2', color: '#dc2626' } }

const Test = () => {
  const [tests, setTests] = useState([])

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await API.get('/tests')
        setTests(normalizeList(data, 'tests'))
      } catch (error) {
        console.log(error)
      }
    }

    fetchTests()
  }, [])

  return (
    <MainLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Medical Tests</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Scheduled and completed lab tests</p>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Test Name', 'Category', 'Lab', 'Result', 'Status', 'Date'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', letterSpacing: '0.02em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tests.map((test, i) => (
              <tr key={test._id || test.id || test.name} style={{ borderBottom: i < tests.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{test.name}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{test.category}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{test.lab}</td>
                <td style={{ padding: '14px 16px' }}>
                  {test.result ? (
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px',
                      background: resultColor[test.result]?.bg || '#eff6ff', color: resultColor[test.result]?.color || '#2563eb'
                    }}>
                      {test.result}
                    </span>
                  ) : <span style={{ color: '#94a3b8', fontSize: '13px' }}>Pending</span>}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={test.status === 'Completed' ? 'badge-active' : 'badge-monitoring'}>
                    {test.status || 'Pending'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{test.date || test.scheduledDate || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  )
}

export default Test
