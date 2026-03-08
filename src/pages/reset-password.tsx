import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Head from 'next/head'

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase injeta o token na URL como hash — precisamos capturar
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleUpdate = async () => {
    if (!password) return toast.error('Digite a nova senha')
    if (password.length < 6) return toast.error('A senha deve ter pelo menos 6 caracteres')
    if (password !== confirm) return toast.error('As senhas não coincidem')

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Senha atualizada com sucesso!')
      setTimeout(() => router.push('/dashboard'), 1500)
    }
    setLoading(false)
  }

  return (
    <>
      <Head><title>Nova Senha — Financial Freedom</title></Head>
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{background: 'var(--obsidian)'}}>
        <div className="fixed inset-0 hex-pattern opacity-20 pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3"
              style={{background: 'linear-gradient(135deg, #d97706, #92400e)', boxShadow: '0 0 30px rgba(217,119,6,0.3)'}}>
              ₿
            </div>
            <h1 className="font-display text-2xl font-bold text-gold-gradient">Financial Freedom</h1>
            <p className="text-sm mt-1" style={{color: 'var(--text-secondary)'}}>Definir nova senha</p>
          </div>

          <div className="rounded-2xl p-6 border-gold-glow" style={{background: 'rgba(10,10,15,0.9)'}}>
            {!ready ? (
              <div className="text-center py-6">
                <div className="flex gap-1.5 justify-center mb-3">
                  {[0,1,2].map(i => (
                    <div key={i} className="typing-dot w-2 h-2 rounded-full"
                      style={{background: '#d97706', animationDelay: `${i * 0.2}s`}} />
                  ))}
                </div>
                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                  Validando link de recuperação...
                </p>
                <p className="text-xs mt-2" style={{color: 'rgba(168,159,140,0.5)'}}>
                  Se demorar muito, solicite um novo link de recuperação.
                </p>
                <button onClick={() => router.push('/forgot-password')}
                  className="mt-4 text-sm hover:underline" style={{color: '#d97706'}}>
                  Solicitar novo link
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <span className="text-3xl">🔐</span>
                  <h2 className="font-display text-lg font-bold mt-2" style={{color: 'var(--text-primary)'}}>
                    Crie sua nova senha
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{color: 'var(--text-secondary)'}}>
                    Nova senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="input-gold w-full px-4 py-3 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{color: 'var(--text-secondary)'}}>
                    Confirmar nova senha
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleUpdate()}
                    placeholder="Repita a senha"
                    className="input-gold w-full px-4 py-3 rounded-lg text-sm"
                  />
                  {confirm && password !== confirm && (
                    <p className="text-xs mt-1" style={{color: '#dc2626'}}>As senhas não coincidem</p>
                  )}
                  {confirm && password === confirm && confirm.length >= 6 && (
                    <p className="text-xs mt-1" style={{color: '#16a34a'}}>✓ Senhas coincidem</p>
                  )}
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={loading || !password || !confirm}
                  className="w-full btn-gold py-3 rounded-lg font-semibold text-sm disabled:opacity-40">
                  {loading ? 'Atualizando...' : 'Salvar nova senha'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
