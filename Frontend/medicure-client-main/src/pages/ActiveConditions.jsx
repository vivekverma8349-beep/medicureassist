import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import API from '../api/axios'

const statusStyle = {
  Active: 'badge-active',
  Monitoring: 'badge-monitoring',
  Resolved: 'badge-inactive',
}

const ActiveConditions = () => {

  const [conditions, setConditions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchDiseases = async () => {

      try {

        const { data } = await API.get('/diseases')

        setConditions(data?.diseases || [])

      } catch (error) {

        console.log('Disease fetch error:', error)

      } finally {

        setLoading(false)

      }

    }

    fetchDiseases()

  }, [])

  return (
    <MainLayout>

      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '22px',
            fontWeight: 700,
            color: '#0f172a',
          }}
        >
          Active Conditions
        </h1>

        <p
          style={{
            color: '#64748b',
            fontSize: '14px',
            marginTop: '4px',
          }}
        >
          Track and manage your medical conditions
        </p>
      </div>

      {loading ? (

        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            color: '#64748b',
          }}
        >
          Loading conditions...
        </div>

      ) : conditions.length === 0 ? (

        <div
          className="card"
          style={{
            padding: '40px',
            textAlign: 'center',
            color: '#64748b',
          }}
        >
          No diseases found
        </div>

      ) : (

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}
        >

          {conditions.map((c) => {

            const status =
              c.status || 'Active'

            return (

              <div
                key={c._id}
                className="card"
                style={{ padding: '20px' }}
              >

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '14px',
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >

                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background:
                          status === 'Active'
                            ? '#f0fdf4'
                            : status === 'Monitoring'
                            ? '#fffbeb'
                            : '#f1f5f9',

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >

                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={
                          status === 'Active'
                            ? '#22c55e'
                            : status === 'Monitoring'
                            ? '#f59e0b'
                            : '#94a3b8'
                        }
                        strokeWidth="2"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>

                    </div>

                    <div>

                      <div
                        style={{
                          fontFamily: 'Sora, sans-serif',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#0f172a',
                        }}
                      >
                        {c.name || 'Unknown Disease'}
                      </div>

                      <div
                        style={{
                          fontSize: '12px',
                          color: '#94a3b8',
                        }}
                      >
                        {c.severity || 'Medical Condition'}
                      </div>

                    </div>

                  </div>

                  <span className={statusStyle[status]}>
                    {status}
                  </span>

                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '13px',
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >

                    <span style={{ color: '#64748b' }}>
                      Diagnosed on
                    </span>

                    <span
                      style={{
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    >
                      {
                        c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString()
                          : '--'
                      }
                    </span>

                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >

                    <span style={{ color: '#64748b' }}>
                      Reports Linked
                    </span>

                    <span
                      style={{
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    >
                      {c.reports?.length || 0}
                    </span>

                  </div>

                </div>

                <div
                  style={{
                    marginTop: '12px',
                    padding: '10px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#64748b',
                  }}
                >
                  📋
                  {
                    c.description ||
                    c.notes ||
                    'Condition detected from medical analysis'
                  }
                </div>

              </div>

            )

          })}

        </div>

      )}

    </MainLayout>
  )

}

export default ActiveConditions