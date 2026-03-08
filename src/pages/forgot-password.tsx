import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Head from 'next/head'

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleReset = async () => {
    if (!email) return toast.error('Digite seu e-mail')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <>
      <Head><title>Recuperar Senha — Financial Freedom</title></Head>
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{background: 'var(--obsidian)'}}>
        <div className="fixed inset-0 hex-pattern opacity-20 pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3"
              style={{background: 'linear-gradient(135deg, #d97706, #92400e)', boxShadow: '0 0 30px rgba(217,119,6,0.3)'}}>
              ₿
            </div>
            <h1 className="font-display text-2xl font-bold text-gold-gradient">Financial Freedom</h1>
            <p className="text-sm mt-1" style={{color: 'var(--text-secondary)'}}>Recuperação de senha</p>
          </div>

          <div className="rounded-2xl p-6 border-gold-glow" style={{background: 'rgba(10,10,15,0.9)'}}>
            {!sent ? (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <span className="text-3xl">🔑</span>
                  <h2 className="font-display text-lg font-bold mt-2" style={{color: 'var(--text-primary)'}}>
                    Esqueceu sua senha?
                  </h2>
                  <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>
                    Digite seu e-mail e enviaremos um link para redefinir sua senha
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{color: 'var(--text-secondary)'}}>
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleReset()}
                    placeholder="seu@email.com"
                    className="input-gold w-full px-4 py-3 rounded-lg text-sm"
                  />
                </div>

                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="w-full btn-gold py-3 rounded-lg font-semibold text-sm disabled:opacity-40">
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>

                <button onClick={() => router.push('/')}
                  className="w-full text-center text-sm py-2"
                  style={{color: 'var(--text-secondary)'}}>
                  ← Voltar ao login
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto"
                  style={{background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)'}}>
                  ✉️
                </div>
                <h2 className="font-display text-lg font-bold" style={{color: 'var(--text-primary)'}}>
                  E-mail enviado!
                </h2>
                <p className="text-sm leading-relaxed" style={{color: 'var(--text-secondary)'}}>
                  Verifique sua caixa de entrada em <span style={{color: '#d97706'}}>{email}</span>
                  <br />e clique no link para redefinir sua senha.
                </p>
                <p className="text-xs" style={{color: 'rgba(168,159,140,0.5)'}}>
                  Não recebeu? Verifique o spam ou tente novamente.
                </p>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setSent(false)}
                    className="flex-1 py-2.5 rounded-lg text-sm border transition-colors"
                    style={{borderColor: 'rgba(217,119,6,0.3)', color: '#d97706'}}>
                    Tentar novamente
                  </button>
                  <button onClick={() => router.push('/')}
                    className="flex-1 btn-gold py-2.5 rounded-lg text-sm font-semibold">
                    Ir para login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
