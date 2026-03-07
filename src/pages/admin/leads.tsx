import { useState, useEffect } from 'react'
import Head from 'next/head'
import { createClient } from '@supabase/supabase-js'

// Página protegida por senha simples - apenas para o admin ver os leads
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'maicknuclear2025'

export default function AdminLeads() {
  const [authenticated, setAuthenticated] = useState(false)
  const [pwd, setPwd] = useState('')
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const login = () => {
    if (pwd === ADMIN_PASSWORD) {
      setAuthenticated(true)
      loadLeads()
    } else {
      alert('Senha incorreta')
    }
  }

  const loadLeads = async () => {
    setLoading(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const client = createClient(supabaseUrl, supabaseKey)
    const { data } = await client.from('profiles').select('email, financial_profile, level, objective, created_at').order('created_at', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  const exportCSV = () => {
    const header = 'Email,Perfil,Nível,Objetivo,Data\n'
    const rows = leads.map(l => `${l.email},${l.financial_profile},${l.level},${l.objective},${new Date(l.created_at).toLocaleDateString('pt-BR')}`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-financial-freedom-${Date.now()}.csv`
    a.click()
  }

  if (!authenticated) {
    return (
      <>
        <Head><title>Admin — Financial Freedom</title></Head>
        <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--obsidian)'}}>
          <div className="w-full max-w-sm p-6 rounded-xl border-gold-glow" style={{background: 'rgba(10,10,15,0.9)'}}>
            <h1 className="font-display text-xl font-bold text-gold-gradient mb-6 text-center">Admin — Leads</h1>
            <input type="password" value={pwd} onChange={e => setPwd(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="Senha admin" className="input-gold w-full px-4 py-3 rounded-lg text-sm mb-3" />
            <button onClick={login} className="btn-gold w-full py-3 rounded-lg font-semibold text-sm">Entrar</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head><title>Admin Leads — Financial Freedom</title></Head>
      <div className="min-h-screen p-6" style={{background: 'var(--obsidian)'}}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-gold-gradient">Leads Cadastrados</h1>
              <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{leads.length} usuários registrados</p>
            </div>
            <button onClick={exportCSV} className="btn-gold px-5 py-2 rounded-lg text-sm font-semibold">
              📥 Exportar CSV
            </button>
          </div>

          {loading ? (
            <p style={{color: 'var(--text-secondary)'}}>Carregando...</p>
          ) : (
            <div className="rounded-xl overflow-hidden border-gold-glow">
              <table className="w-full text-sm">
                <thead style={{background: 'rgba(217,119,6,0.1)'}}>
                  <tr>
                    {['Email', 'Perfil', 'Nível', 'Objetivo', 'Data'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{color: '#d97706'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr key={i} style={{borderTop: '1px solid rgba(217,119,6,0.1)', background: i % 2 === 0 ? 'rgba(10,10,15,0.8)' : 'rgba(15,15,24,0.8)'}}>
                      <td className="px-4 py-3" style={{color: 'var(--text-primary)'}}>{lead.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs"
                          style={{
                            background: lead.financial_profile === 'conservador' ? 'rgba(22,163,74,0.2)' : lead.financial_profile === 'moderado' ? 'rgba(217,119,6,0.2)' : 'rgba(220,38,38,0.2)',
                            color: lead.financial_profile === 'conservador' ? '#16a34a' : lead.financial_profile === 'moderado' ? '#d97706' : '#dc2626',
                          }}>
                          {lead.financial_profile || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{color: 'var(--text-secondary)'}}>{lead.level || '—'}</td>
                      <td className="px-4 py-3 text-xs" style={{color: 'var(--text-secondary)'}}>{lead.objective || '—'}</td>
                      <td className="px-4 py-3 text-xs" style={{color: 'var(--text-secondary)'}}>
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
