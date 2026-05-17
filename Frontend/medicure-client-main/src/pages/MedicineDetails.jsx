import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import API from '../api/axios'

const normalizeList = (data, key) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.[key])) return data[key]
  return []
}

const MedicineDetails = () => {
  const [medicines, setMedicines] = useState([])

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const { data } = await API.get('/medicines')
        setMedicines(normalizeList(data, 'medicines'))
      } catch (error) {
        console.log(error)
      }
    }

    fetchMedicines()
  }, [])

  return (
    <MainLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Medicines</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Track your medications and dosages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {medicines.map(medicine => (
          <div key={medicine._id || medicine.id || medicine.name} className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">
                  {medicine.name}
                </h3>

                <p className="text-gray-500">
                  {medicine.dosage}
                </p>
              </div>

              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {medicine.status || 'Active'}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>Timing: {medicine.timing || 'Not specified'}</p>
              <p>Duration: {medicine.duration || 'Not specified'}</p>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  )
}

export default MedicineDetails
