import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import Head from 'next/head'
import Footer from '../components/Footer'

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase injeta o token na URL automaticamente após clicar no link do e-mail
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
  }, [])

  const handleReset = async () => {
    if (!password || !confirm) return toast.error('Preencha todos os campos')
    if (password.length < 6) return toast.error('A senha deve ter pelo menos 6 caracteres')
    if (password !== confirm) return toast.error('As senhas não coincidem')
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Senha atualizada com sucesso!')
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <>
      <Head><title>Nova Senha — Financial Freedom</title></Head>
      <div className="min-h-screen flex flex-col" style={{background: 'var(--obsidian)'}}>
        <div className="fixed inset-0 hex-pattern opacity-20 pointer-events-none" />
        <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🔐</div>
              <h1 className="font-display text-2xl font-bold text-gold-gradient">Nova Senha</h1>
              <p className="text-sm mt-1" style={{color: 'var(--text-secondary)'}}>
                {ready ? 'Digite sua nova senha abaixo' : 'Aguardando verificação do link...'}
              </p>
            </div>

            {ready ? (
              <div className="rounded-2xl p-6 border-gold-glow" style={{background: 'rgba(10,10,15,0.9)'}}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{color: 'var(--text-secondary)'}}>
                      Nova senha
                    </label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="input-gold w-full px-4 py-3 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{color: 'var(--text-secondary)'}}>
                      Confirmar nova senha
                    </label>
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="input-gold w-full px-4 py-3 rounded-lg text-sm"
                      onKeyDown={e => e.key === 'Enter' && handleReset()} />
                  </div>
                  <button onClick={handleReset} disabled={loading}
                    className="w-full btn-gold py-3 rounded-lg font-semibold text-sm disabled:opacity-40">
                    {loading ? 'Atualizando...' : 'Definir Nova Senha'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 rounded-2xl border-gold-glow" style={{background: 'rgba(10,10,15,0.9)'}}>
                <div className="flex gap-1.5 justify-center mb-3">
                  {[0,1,2].map(i => (
                    <div key={i} className="typing-dot w-2 h-2 rounded-full"
                      style={{background: '#d97706', animationDelay: `${i * 0.2}s`}} />
                  ))}
                </div>
                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                  Verificando link de recuperação...
                </p>
                <p className="text-xs mt-2" style={{color: 'rgba(168,159,140,0.5)'}}>
                  Se demorar, volte ao e-mail e clique no link novamente.
                </p>
              </div>
            )}
          </div>
        </div>
        <Footer compact />
      </div>
    </>
  )
}
