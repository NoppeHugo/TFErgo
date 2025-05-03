import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from "../api/api.js";


export default function RequireAuth({ children }) {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/auth/me', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) navigate('/login')
        else setLoading(false)
      })
      .catch(() => navigate('/login'))
  }, [navigate])

  if (loading) return <div>Chargement...</div>

  return children
}
