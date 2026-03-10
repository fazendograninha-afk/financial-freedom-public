import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Head from 'next/head'
import Footer from '../components/Footer'

const DISCLAIMER_SHORT = `Esta plataforma é uma ferramenta digital de organização e visualização de informações financeiras para fins exclusivamente educacionais e informacionais. Não constitui consultoria financeira, recomendação de investimento ou assessoria de qualquer natureza. Toda decisão financeira é de exclusiva responsabilidade do usuário.`

const GESTOR_MONEY = `https://hotm.io/sJ54hz`

export default function Home() {
  const router = useRouter()
  const [mode, setMode] = useState<'landing' | 'login' | 'register' | 'success'>('landing')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkboxes, setCheckboxes] = useState({
    notConsultancy: false,
    myResponsibility: false,
    understandRisk: false,
    acceptTerms: false,
  })
  const [particles, setParticles] = useState<Array<{id:number,size:number,left:number,duration:number,delay:number}>>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push('/dashboard')
    })
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i, size: Math.random() * 3 + 1, left: Math.random() * 100,
      duration: Math.random() * 15 + 10, delay: Math.random() * -20,
    }))
    setParticles(p)
  }, [])

  // ── MAGIC LINK — envia link de acesso por e-mail ───────────────────────
  const handleMagicLink = async () => {
    if (!email) return toast.error('Digite seu e-mail')
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error('E-mail inválido')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'https://financial-freedom-by-maicknuclear.up.railway.app/dashboard',
        data: { financial_profile: 'conservador', level: 'iniciante' }
      }
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      setMode('success')
      setLoading(false)
    }
  }

  const allChecked = Object.values(checkboxes).every(Boolean)

  // ── LANDING ──────────────────────────────────────────────────────────────
  if (mode === 'landing') {
    return (
      <>
        <Head><title>Financial Freedom by MaicknucleaR </title></Head>
        <div className="min-h-screen relative overflow-hidden" style={{background: 'var(--obsidian)'}}>
          <div className="atomic-bg">
            {particles.map(p => (
              <div key={p.id} className="particle" style={{
                width: p.size, height: p.size, left: `${p.left}%`,
                animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
              }} />
            ))}
          </div>
          <div className="fixed inset-0 hex-pattern opacity-30 pointer-events-none" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
            style={{background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)'}} />

          <header className="relative z-10 flex justify-between items-center px-6 py-5"
            style={{borderBottom: '1px solid rgba(217,119,6,0.15)'}}>
            <div>
              <h1 className="font-display text-xl font-bold text-gold-gradient">Financial Freedom</h1>
              <p className="text-xs font-semibold">
                <a href="https://maicknuclear.wixsite.com/online" target="_blank" rel="noopener noreferrer"
                  className="hover:underline" style={{color: '#ffffff'}}>by MaicknucleaR</a>
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setMode('login')}
                className="px-5 py-2 text-sm font-medium rounded-lg border transition-all"
                style={{borderColor: 'rgba(217,119,6,0.3)', color: '#d97706'}}>
                Entrar
              </button>
              <button onClick={() => setMode('register')} className="btn-gold px-5 py-2 text-sm rounded-lg">
                Começar Grátis
              </button>
            </div>
          </header>

          <main className="relative z-10 flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-medium"
              style={{background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.3)', color: '#d97706'}}>
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              Versão Beta — Temporariamente Gratuita
            </div>

            <div className="relative w-40 h-40 mx-auto mb-10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style={{background: 'linear-gradient(135deg, #d97706, #92400e)', boxShadow: '0 0 40px rgba(217,119,6,0.4)'}}>
                  ₿
                </div>
              </div>
              <div className="absolute inset-0 rounded-full" style={{border: '1px solid rgba(217,119,6,0.2)'}} />
              <div className="absolute inset-4 rounded-full" style={{border: '1px dashed rgba(217,119,6,0.15)'}} />
              <div className="orbit-1 absolute top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 rounded-full"
                style={{background: '#f59e0b', boxShadow: '0 0 8px #f59e0b'}} />
              <div className="orbit-2 absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1 rounded-full"
                style={{background: '#d97706', boxShadow: '0 0 6px #d97706'}} />
            </div>

            <h2 className="font-display text-5xl md:text-7xl font-black mb-4 leading-tight">
              <span className="text-gold-shimmer">Do Salário Mínimo</span><br />
              <span style={{color: 'var(--text-primary)'}}>ao Primeiro</span>
              <span className="text-gold-gradient"> Milhão</span>
            </h2>

            <p className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed" style={{color: 'var(--text-secondary)'}}>
              Plataforma educacional com as mentalidades dos maiores investidores do mundo.
              <br className="hidden md:block" />
              Inteligência financeira para quem quer transformar sua realidade.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['Warren Buffett','Ray Dalio','Michael Saylor','George Soros','Jim Simons','+10 lendas'].map(name => (
                <span key={name} className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', color: '#d97706'}}>
                  {name}
                </span>
              ))}
            </div>

            <button onClick={() => setMode('register')}
              className="btn-gold px-10 py-4 rounded-xl text-lg font-semibold mb-4">
              Criar Conta Gratuita →
            </button>
            <p className="text-xs" style={{color: 'var(--text-secondary)'}}>Apenas seu e-mail. Sem senha. Sem cartão.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 max-w-4xl w-full">
              {[
                { icon: '🌱', title: 'Iniciante', desc: 'Salário mínimo → Primeiros investimentos', color: '#16a34a' },
                { icon: '📈', title: 'Empreendedor', desc: 'Negócios → Geração de riqueza', color: '#d97706' },
                { icon: '💎', title: 'Investidor', desc: 'Patrimônio → Proteção e crescimento', color: '#7c3aed' },
              ].map(level => (
                <div key={level.title} className="border-gold-glow rounded-xl p-5 text-left"
                  style={{background: 'rgba(10,10,15,0.6)'}}>
                  <span className="text-3xl mb-3 block">{level.icon}</span>
                  <h3 className="font-display text-lg font-bold mb-1" style={{color: level.color}}>{level.title}</h3>
                  <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{level.desc}</p>
                </div>
              ))}
            </div>

            {/* GestorMoney — Afiliado Principal */}
            <div className="mt-16 p-5 rounded-xl max-w-lg w-full"
              style={{background: 'rgba(217,119,6,0.08)', border: '2px solid rgba(217,119,6,0.3)'}}>
              <p className="text-xs mb-1" style={{color: 'var(--text-secondary)'}}>🔗 Parceiro recomendado</p>
              <a href={GESTOR_MONEY} target="_blank" rel="noopener noreferrer"
                className="text-base font-bold block mb-1 hover:underline" style={{color: '#d97706'}}>
                💚 GestorMoney — Controle financeiro pelo WhatsApp
              </a>
              <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                Controle suas finanças de forma simples e rápida direto no WhatsApp
              </p>
              <a href={GESTOR_MONEY} target="_blank" rel="noopener noreferrer"
                className="inline-block mt-3 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{background: 'rgba(217,119,6,0.15)', color: '#d97706', border: '1px solid rgba(217,119,6,0.4)'}}>
                Conhecer o GestorMoney →
              </a>
              <p className="text-xs mt-2" style={{color: 'rgba(168,159,140,0.4)'}}>
                (Link de afiliado — posso receber comissão sem custo adicional para você)
              </p>
            </div>

            {/* QR Code */}
            <div className="mt-8 p-4 rounded-xl text-center"
              style={{background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(217,119,6,0.15)'}}>
              <p className="text-sm mb-3" style={{color: 'var(--text-secondary)'}}>☕ Apoie este projeto com qualquer valor</p>
              <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden"
                style={{border: '2px solid rgba(217,119,6,0.3)', background: 'white', padding: '6px'}}>
                <img src="/qrcode-donation.jpg" alt="QR Code PIX" className="w-full h-full object-cover rounded-lg" />
              </div>
              <p className="text-xs mt-2" style={{color: '#d97706'}}>PIX / Qualquer valor 🙏</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    )
  }

  // ── SUCESSO — e-mail enviado ──────────────────────────────────────────────
  if (mode === 'success') {
    return (
      <>
        <Head><title>Verifique seu e-mail — Financial Freedom</title></Head>
        <div className="min-h-screen flex flex-col items-center justify-center px-4"
          style={{background: 'var(--obsidian)'}}>
          <div className="fixed inset-0 hex-pattern opacity-20 pointer-events-none" />
          <div className="relative z-10 w-full max-w-md text-center">
            <div className="text-6xl mb-6">📬</div>
            <h1 className="font-display text-3xl font-bold text-gold-gradient mb-3">
              Verifique seu e-mail!
            </h1>
            <p className="text-base mb-2" style={{color: 'var(--text-primary)'}}>
              Enviamos um link mágico para:
            </p>
            <p className="text-lg font-bold mb-6" style={{color: '#d97706'}}>{email}</p>
            <div className="rounded-2xl p-6 mb-6" style={{background: 'rgba(10,10,15,0.9)', border: '1px solid rgba(217,119,6,0.2)'}}>
              <p className="text-sm mb-4" style={{color: 'var(--text-secondary)'}}>
                Clique no link do e-mail para acessar a plataforma. Sem senha necessária!
              </p>
              <div className="flex flex-col gap-2 text-xs" style={{color: 'rgba(168,159,140,0.6)'}}>
                <p>📁 Verifique também a pasta <strong>Spam / Lixo Eletrônico</strong></p>
                <p>⏱️ O link expira em <strong>60 minutos</strong></p>
                <p>🔒 Acesso seguro, sem necessidade de senha</p>
              </div>
            </div>
            <button onClick={() => { setMode('login'); setEmail('') }}
              className="text-sm" style={{color: '#d97706'}}>
              ← Usar outro e-mail
            </button>
          </div>
          <Footer compact />
        </div>
      </>
    )
  }

  // ── LOGIN / REGISTER ──────────────────────────────────────────────────────
  return (
    <>
      <Head><title>{mode === 'login' ? 'Entrar' : 'Criar Conta'} — Financial Freedom</title></Head>
      <div className="min-h-screen relative overflow-hidden flex flex-col" style={{background: 'var(--obsidian)'}}>
        <div className="fixed inset-0 hex-pattern opacity-20 pointer-events-none" />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{background: 'radial-gradient(circle, rgba(217,119,6,0.06) 0%, transparent 70%)'}} />

        <header className="relative z-10 px-6 py-4">
          <button onClick={() => setMode('landing')} className="text-sm transition-colors"
            style={{color: 'var(--text-secondary)'}}>← Voltar</button>
        </header>

        <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3"
                style={{background: 'linear-gradient(135deg, #d97706, #92400e)', boxShadow: '0 0 30px rgba(217,119,6,0.3)'}}>
                ₿
              </div>
              <h1 className="font-display text-2xl font-bold text-gold-gradient">Financial Freedom</h1>
              <p className="text-sm mt-1" style={{color: 'var(--text-secondary)'}}>
                {mode === 'login' ? 'Bem-vindo de volta' : 'Comece sua jornada'}
              </p>
              {mode === 'register' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-2 text-xs"
                  style={{background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.3)', color: '#d97706'}}>
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                  Versão Beta — Temporariamente Gratuita
                </div>
              )}
            </div>

            <div className="rounded-2xl p-6 border-gold-glow" style={{background: 'rgba(10,10,15,0.9)'}}>
              <div className="space-y-4">

                {/* Explicação magic link */}
                <div className="rounded-lg p-3 text-xs text-center"
                  style={{background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.15)', color: 'var(--text-secondary)'}}>
                  🔑 Sem senha! Digite seu e-mail e receba um link de acesso instantâneo.
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{color: 'var(--text-secondary)'}}>
                    Seu e-mail
                  </label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="input-gold w-full px-4 py-3 rounded-lg text-sm"
                    onKeyDown={e => e.key === 'Enter' && (allChecked || mode === 'login') && handleMagicLink()} />
                </div>

                {mode === 'register' && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-medium" style={{color: '#d97706'}}>⚠️ Antes de continuar, confirme:</p>
                    {[
                      { key: 'notConsultancy', label: 'Entendo que esta plataforma não fornece consultoria ou recomendação de investimentos' },
                      { key: 'myResponsibility', label: 'Reconheço que todas as decisões financeiras são de minha exclusiva responsabilidade' },
                      { key: 'understandRisk', label: 'Compreendo que investimentos podem resultar em perdas financeiras' },
                      { key: 'acceptTerms', label: 'Aceito os Termos de Uso, Disclaimer Financeiro e Política de Privacidade' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex gap-3 cursor-pointer">
                        <div className="relative mt-0.5 flex-shrink-0">
                          <input type="checkbox"
                            checked={checkboxes[key as keyof typeof checkboxes]}
                            onChange={e => setCheckboxes(prev => ({...prev, [key]: e.target.checked}))}
                            className="sr-only" />
                          <div className="w-4 h-4 rounded border transition-all flex items-center justify-center"
                            style={{
                              background: checkboxes[key as keyof typeof checkboxes] ? '#d97706' : 'transparent',
                              borderColor: checkboxes[key as keyof typeof checkboxes] ? '#d97706' : 'rgba(217,119,6,0.4)'
                            }}>
                            {checkboxes[key as keyof typeof checkboxes] && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-xs leading-relaxed" style={{color: 'var(--text-secondary)'}}>{label}</span>
                      </label>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleMagicLink}
                  disabled={loading || (mode === 'register' && !allChecked)}
                  className="w-full btn-gold py-3 rounded-lg font-semibold text-sm mt-2 disabled:opacity-40 disabled:cursor-not-allowed">
                  {loading ? 'Enviando link...' : mode === 'login' ? '✉️ Enviar Link de Acesso' : '✉️ Criar Conta e Enviar Link'}
                </button>

                <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="w-full text-center text-sm py-2" style={{color: 'var(--text-secondary)'}}>
                  {mode === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
                  <span style={{color: '#d97706'}}>{mode === 'login' ? 'Criar grátis' : 'Entrar'}</span>
                </button>
              </div>
            </div>

            <div className="disclaimer-box rounded-lg p-4 mt-4 text-xs leading-relaxed" style={{color: 'var(--text-secondary)'}}>
              ⚠️ {DISCLAIMER_SHORT}
            </div>

            <div className="flex justify-center gap-4 mt-4 text-xs" style={{color: 'var(--text-secondary)'}}>
              <a href="/disclaimer" className="hover:underline" style={{color: '#d97706'}}>Disclaimer</a>
              <span>·</span>
              <a href="/terms" className="hover:underline" style={{color: '#d97706'}}>Termos de Uso</a>
              <span>·</span>
              <a href="/privacy" className="hover:underline" style={{color: '#d97706'}}>Privacidade</a>
            </div>
          </div>
        </div>
        <Footer compact />
      </div>
    </>
  )
}
