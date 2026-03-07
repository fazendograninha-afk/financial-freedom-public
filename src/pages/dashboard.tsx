import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { agents } from '../agents/agents'
import Head from 'next/head'
import toast from 'react-hot-toast'

const DISCLAIMER_MINI = "⚠️ Ferramenta educacional e informacional. Não constitui consultoria ou recomendação de investimento. Decisões financeiras são de sua exclusiva responsabilidade."

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      setUser(user)
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
      setLoading(false)
    }
    init()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Até logo!')
    router.push('/')
  }

  if (loading) return <LoadingScreen />

  if (selectedAgent) {
    return <ChatScreen agent={selectedAgent} user={user} onBack={() => setSelectedAgent(null)} />
  }

  const profileLabel = profile?.financial_profile || 'conservador'
  const profileColors: Record<string, string> = {
    conservador: '#16a34a',
    moderado: '#d97706',
    arrojado: '#dc2626'
  }

  // Filter agents by profile relevance
  const recommendedAgents = agents.filter(a => 
    a.profile === profileLabel || a.bestFor.includes(profile?.objective || '')
  ).slice(0, 6)
  
  const otherAgents = agents.filter(a => !recommendedAgents.includes(a))

  return (
    <>
      <Head><title>Dashboard — Financial Freedom</title></Head>
      <div className="min-h-screen" style={{background: 'var(--obsidian)'}}>
        <div className="fixed inset-0 hex-pattern opacity-15 pointer-events-none" />

        {/* Header */}
        <header className="sticky top-0 z-40 glass" style={{borderBottom: '1px solid rgba(217,119,6,0.15)'}}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{background: 'linear-gradient(135deg, #d97706, #92400e)'}}>
                ₿
              </div>
              <div>
                <h1 className="font-display text-sm font-bold text-gold-gradient">Financial Freedom</h1>
                <p className="text-xs" style={{color: 'var(--text-secondary)'}}>by MaicknucleaR</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs"
                style={{background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)'}}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background: profileColors[profileLabel]}} />
                <span style={{color: profileColors[profileLabel], textTransform: 'capitalize'}}>{profileLabel}</span>
              </div>
              <button onClick={handleLogout} className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{color: 'var(--text-secondary)', border: '1px solid rgba(217,119,6,0.2)'}}>
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          {/* Disclaimer */}
          <div className="disclaimer-box rounded-lg p-3 mb-6 text-xs" style={{color: 'var(--text-secondary)'}}>
            {DISCLAIMER_MINI}
          </div>

          {/* Welcome */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold mb-1">
              <span style={{color: 'var(--text-primary)'}}>Olá, </span>
              <span className="text-gold-gradient">{user?.email?.split('@')[0]}</span>
            </h2>
            <p style={{color: 'var(--text-secondary)'}}>
              Escolha um especialista para começar sua jornada de educação financeira
            </p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { icon: '📋', label: 'Meu Plano', action: () => setSelectedAgent(agents.find(a => a.id === 'dalio')!) },
              { icon: '🎯', label: 'Traçar Perfil', action: () => router.push('/onboarding') },
              { icon: '📰', label: 'Cenário Global', action: () => setSelectedAgent(agents.find(a => a.id === 'soros')!) },
              { icon: '₿', label: 'Análise Cripto', action: () => setSelectedAgent(agents.find(a => a.id === 'saylor')!) },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                className="border-gold-glow rounded-xl p-4 text-left transition-all hover:scale-[1.02]"
                style={{background: 'rgba(10,10,15,0.6)'}}>
                <span className="text-2xl block mb-1">{item.icon}</span>
                <span className="text-sm font-medium" style={{color: 'var(--text-primary)'}}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Recommended agents */}
          <div className="mb-8">
            <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-gold-gradient">Recomendados para você</span>
              <span className="text-sm font-normal px-2 py-0.5 rounded-full"
                style={{background: 'rgba(217,119,6,0.1)', color: '#d97706', border: '1px solid rgba(217,119,6,0.2)'}}>
                Perfil {profileLabel}
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedAgents.map(agent => (
                <AgentCard key={agent.id} agent={agent} onClick={() => setSelectedAgent(agent)} recommended />
              ))}
            </div>
          </div>

          {/* All agents */}
          <div className="mb-8">
            <h3 className="font-display text-xl font-bold mb-4 text-gold-gradient">
              Todos os Especialistas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherAgents.map(agent => (
                <AgentCard key={agent.id} agent={agent} onClick={() => setSelectedAgent(agent)} />
              ))}
            </div>
          </div>

          {/* Affiliate & Donation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl p-5" style={{background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.15)'}}>
              <p className="text-xs mb-2" style={{color: 'var(--text-secondary)'}}>🔗 Link de afiliado</p>
              <a href="https://hotmart.com/pt-br/marketplace/produtos/oryon-mesas-proprietarias/G102265023L?ref=F104360614F"
                target="_blank" rel="noopener noreferrer"
                className="font-semibold text-sm block mb-1 hover:underline" style={{color: '#d97706'}}>
                🏆 ORYON Mesas Proprietárias
              </a>
              <p className="text-xs" style={{color: 'var(--text-secondary)'}}>
                Opere com capital financiado. (Comissão paga pelo vendedor, sem custo para você)
              </p>
            </div>
            <div className="rounded-xl p-5 text-center" style={{background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(217,119,6,0.15)'}}>
              <p className="text-sm mb-2" style={{color: 'var(--text-secondary)'}}>☕ Apoie este projeto</p>
              <div className="w-28 h-28 mx-auto rounded-xl overflow-hidden"
                style={{border: '2px solid rgba(217,119,6,0.3)', background: 'white', padding: '5px'}}>
                <img src="/qrcode-donation.jpg" alt="QR Code PIX" className="w-full h-full object-cover rounded-lg" />
              </div>
              <p className="text-xs mt-2" style={{color: '#d97706'}}>PIX / Qualquer valor 🙏</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-4 px-4 text-center" style={{borderTop: '1px solid rgba(217,119,6,0.1)'}}>
          <div className="flex justify-center gap-4 text-xs mb-2" style={{color: 'var(--text-secondary)'}}>
            <a href="/disclaimer" className="hover:underline" style={{color: '#d97706'}}>Disclaimer</a>
            <span>·</span>
            <a href="/terms" className="hover:underline" style={{color: '#d97706'}}>Termos</a>
            <span>·</span>
            <a href="/privacy" className="hover:underline" style={{color: '#d97706'}}>Privacidade</a>
          </div>
          <p className="text-xs" style={{color: 'rgba(168,159,140,0.5)'}}>
            Criado Por MaicknucleaR — <a href="https://instagram.com/dubmariachi" target="_blank" rel="noopener noreferrer"
              style={{color: '#d97706'}}>@dubmariachi</a>
          </p>
        </footer>
      </div>
    </>
  )
}

function AgentCard({ agent, onClick, recommended }: { agent: any, onClick: () => void, recommended?: boolean }) {
  return (
    <button onClick={onClick}
      className="border-gold-glow rounded-xl p-5 text-left transition-all hover:scale-[1.02] group w-full"
      style={{background: 'rgba(10,10,15,0.7)', position: 'relative', overflow: 'hidden'}}>
      {recommended && (
        <div className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full"
          style={{background: 'rgba(217,119,6,0.2)', color: '#d97706', border: '1px solid rgba(217,119,6,0.3)'}}>
          ★ Ideal
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{background: `${agent.color}15`, border: `1px solid ${agent.color}40`}}>
          {agent.avatar}
        </div>
        <div>
          <h4 className="font-semibold text-sm" style={{color: 'var(--text-primary)'}}>{agent.name}</h4>
          <p className="text-xs" style={{color: agent.color}}>{agent.role}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed" style={{color: 'var(--text-secondary)'}}>{agent.specialty}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {agent.bestFor.slice(0, 3).map((tag: string) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
            style={{background: 'rgba(217,119,6,0.08)', color: 'rgba(217,119,6,0.7)', border: '1px solid rgba(217,119,6,0.15)'}}>
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}

function ChatScreen({ agent, user, onBack }: { agent: any, user: any, onBack: () => void }) {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showExport, setShowExport] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    
    const userMsg = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          agentId: agent.id,
          systemPrompt: agent.systemPrompt,
        })
      })
      const data = await res.json()
      if (data.content) {
        setMessages([...newMessages, { role: 'assistant', content: data.content }])
      }
    } catch (e) {
      toast.error('Erro ao conectar. Verifique a API.')
    }
    setLoading(false)
  }

  const exportPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      let y = 20
      
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Financial Freedom by MaicknucleaR', 10, y)
      y += 8
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(`Sessão com: ${agent.name} — ${agent.role}`, 10, y)
      y += 6
      doc.setFontSize(8)
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')} | Usuário: ${user?.email}`, 10, y)
      y += 10
      doc.setFontSize(8)
      doc.setTextColor(150)
      const disclaimer = 'AVISO: Este conteúdo é exclusivamente educacional e informacional. Não constitui consultoria ou recomendação de investimento.'
      const splitDisclaimer = doc.splitTextToSize(disclaimer, 190)
      doc.text(splitDisclaimer, 10, y)
      y += splitDisclaimer.length * 5 + 5
      doc.setTextColor(0)
      
      messages.forEach(msg => {
        if (y > 270) { doc.addPage(); y = 20 }
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text(msg.role === 'user' ? 'Você:' : `${agent.name}:`, 10, y)
        y += 5
        doc.setFont('helvetica', 'normal')
        const lines = doc.splitTextToSize(msg.content, 185)
        doc.text(lines, 10, y)
        y += lines.length * 4.5 + 6
      })
      
      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text('Criado por MaicknucleaR — @dubmariachi | financialfreedom.vercel.app', 10, 290)
      doc.save(`financial-freedom-${agent.id}-${Date.now()}.pdf`)
      toast.success('PDF exportado com sucesso!')
    } catch (e) {
      toast.error('Erro ao gerar PDF')
    }
  }

  return (
    <div className="h-screen flex flex-col" style={{background: 'var(--obsidian)'}}>
      <div className="fixed inset-0 hex-pattern opacity-10 pointer-events-none" />
      
      {/* Chat header */}
      <header className="relative z-40 glass" style={{borderBottom: '1px solid rgba(217,119,6,0.15)'}}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-sm transition-colors mr-1" style={{color: 'var(--text-secondary)'}}>←</button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{background: `${agent.color}15`, border: `1px solid ${agent.color}40`}}>
              {agent.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{color: 'var(--text-primary)'}}>{agent.name}</h3>
              <p className="text-xs" style={{color: agent.color}}>{agent.role}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={exportPDF}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{color: '#d97706', border: '1px solid rgba(217,119,6,0.3)'}}>
              📄 Exportar PDF
            </button>
          </div>
        </div>
        <div className="px-4 pb-2">
          <div className="disclaimer-box rounded px-3 py-1.5 text-xs" style={{color: 'rgba(168,159,140,0.7)'}}>
            ⚠️ Conteúdo educacional e informacional. Não constitui recomendação de investimento. Mensagens apagadas ao fechar.
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <WelcomeMessage agent={agent} onSuggestion={(s) => { setInput(s) }} />
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg mr-2 flex-shrink-0 mt-1"
                  style={{background: `${agent.color}20`, border: `1px solid ${agent.color}30`}}>
                  {agent.avatar}
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'chat-user' : 'chat-ai'}`}
                style={{color: 'var(--text-primary)', whiteSpace: 'pre-wrap'}}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{background: `${agent.color}20`, border: `1px solid ${agent.color}30`}}>
                {agent.avatar}
              </div>
              <div className="chat-ai px-4 py-3 flex gap-1.5">
                {[0,1,2].map(i => (
                  <div key={i} className="typing-dot w-2 h-2 rounded-full"
                    style={{background: '#d97706', animationDelay: `${i * 0.2}s`}} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="relative z-40 glass" style={{borderTop: '1px solid rgba(217,119,6,0.15)'}}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Faça uma pergunta ou traga seu plano financeiro..."
              rows={2}
              className="input-gold flex-1 px-4 py-3 rounded-xl text-sm resize-none"
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}
              className="btn-gold px-5 rounded-xl disabled:opacity-40">
              →
            </button>
          </div>
          <p className="text-xs mt-1.5 text-center" style={{color: 'rgba(168,159,140,0.4)'}}>
            Enter para enviar • Shift+Enter para nova linha • Mensagens apagadas ao fechar
          </p>
        </div>
      </div>
    </div>
  )
}

function WelcomeMessage({ agent, onSuggestion }: { agent: any, onSuggestion: (s: string) => void }) {
  const suggestions: Record<string, string[]> = {
    buffett: [
      'Como identificar uma empresa com vantagem competitiva?',
      'O que é margem de segurança e como calcular?',
      'Tenho R$500/mês para investir. Por onde começo?',
      'Como o value investing pode me levar ao primeiro milhão?'
    ],
    dalio: [
      'O que é o portfólio All Weather e como montar um?',
      'Estamos em qual fase do ciclo econômico atual?',
      'Como proteger meu patrimônio da inflação?',
      'Explique os ciclos de dívida de curto e longo prazo'
    ],
    saylor: [
      'Por que Bitcoin e não outras criptos?',
      'Como começar a acumular Bitcoin com pouco dinheiro?',
      'Quais são os principais riscos do Bitcoin?',
      'Como a inflação afeta o poder de compra e o Bitcoin resolve isso?'
    ],
    default: [
      'Análise minha situação financeira e sugira um caminho',
      'Quero sair do salário mínimo e chegar ao primeiro milhão',
      'Como montar uma carteira diversificada do zero?',
      'Traga um cenário econômico global atual'
    ]
  }

  const msgs = suggestions[agent.id] || suggestions.default

  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4"
        style={{background: `${agent.color}15`, border: `1px solid ${agent.color}40`}}>
        {agent.avatar}
      </div>
      <h3 className="font-display text-2xl font-bold mb-1" style={{color: 'var(--text-primary)'}}>
        {agent.name}
      </h3>
      <p className="text-sm mb-1" style={{color: agent.color}}>{agent.role}</p>
      <p className="text-sm max-w-md mx-auto mb-6" style={{color: 'var(--text-secondary)'}}>{agent.specialty}</p>
      
      <p className="text-xs mb-4" style={{color: 'var(--text-secondary)'}}>Sugestões para começar:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto">
        {msgs.map((s, i) => (
          <button key={i} onClick={() => onSuggestion(s)}
            className="text-left text-sm px-4 py-3 rounded-xl transition-all hover:scale-[1.01] border-gold-glow"
            style={{background: 'rgba(10,10,15,0.6)', color: 'var(--text-secondary)'}}>
            "{s}"
          </button>
        ))}
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--obsidian)'}}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
          style={{background: 'linear-gradient(135deg, #d97706, #92400e)', boxShadow: '0 0 30px rgba(217,119,6,0.3)'}}>
          ₿
        </div>
        <div className="flex gap-1.5 justify-center">
          {[0,1,2].map(i => (
            <div key={i} className="typing-dot w-2 h-2 rounded-full"
              style={{background: '#d97706', animationDelay: `${i * 0.2}s`}} />
          ))}
        </div>
      </div>
    </div>
  )
}
