import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { agents, Agent } from '../agents/agents'
import AgentCard from '../components/AgentCard'
import ChatBubble, { TypingIndicator } from '../components/ChatBubble'
import Footer from '../components/Footer'
import LoadingScreen from '../components/LoadingScreen'
import { DisclaimerBanner, DisclaimerChatBar } from '../components/DisclaimerBanner'

interface Message {
  role: 'user' | 'assistant'
  content: string
  tokens?: number
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
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
    return (
      <ChatScreen
        agent={selectedAgent}
        user={user}
        onBack={() => setSelectedAgent(null)}
      />
    )
  }

  const profileLabel = profile?.financial_profile || 'conservador'
  const profileColors: Record<string, string> = {
    conservador: '#16a34a',
    moderado: '#d97706',
    arrojado: '#dc2626'
  }

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
                <p className="text-xs" style={{color: '#ffffff'}}>by MaicknucleaR</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs"
                style={{background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)'}}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{background: profileColors[profileLabel]}} />
                <span style={{color: profileColors[profileLabel], textTransform: 'capitalize'}}>
                  {profileLabel}
                </span>
              </div>
              <button onClick={handleLogout}
                className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{color: 'var(--text-secondary)', border: '1px solid rgba(217,119,6,0.2)'}}>
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <DisclaimerBanner mini />

          {/* Welcome */}
          <div className="my-8">
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
              { icon: '📋', label: 'Meu Plano', agentId: 'dalio' },
              { icon: '🎯', label: 'Refazer Perfil', agentId: null },
              { icon: '🌐', label: 'Cenário Global', agentId: 'soros' },
              { icon: '₿', label: 'Análise Cripto', agentId: 'saylor' },
            ].map(item => (
              <button key={item.label}
                onClick={() => {
                  if (item.agentId) {
                    const a = agents.find(a => a.id === item.agentId)
                    if (a) setSelectedAgent(a)
                  } else {
                    router.push('/onboarding')
                  }
                }}
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
                style={{background: 'rgba(217,119,6,0.1)', color: '#d97706', border: '1px solid rgba(217,119,6,0.2)', textTransform: 'capitalize'}}>
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

          {/* Ferramentas Gratuitas */}
          <div className="mb-8">
            <h3 className="font-display text-xl font-bold mb-4 text-gold-gradient">
              🛠️ Ferramentas Gratuitas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* Planilha CLT */}
              <div className="rounded-xl p-5 flex flex-col gap-3 transition-all hover:scale-[1.02]"
                style={{background: 'rgba(10,10,15,0.7)', border: '1px solid rgba(217,119,6,0.2)'}}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)'}}>
                    📊
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm" style={{color: 'var(--text-primary)'}}>
                      Planilha Controle Financeiro CLT
                    </h4>
                    <p className="text-xs" style={{color: '#16a34a'}}>Excel — Dark Luxury</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{color: 'var(--text-secondary)'}}>
                  Dashboard, 12 meses, metas, dívidas e análise anual. Regra 50-30-20 inclusa.
                </p>
                <div className="flex flex-wrap gap-1 mb-1">
                  {['Dashboard','Metas','12 Meses','Dívidas','Análise Anual'].map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                      style={{background:'rgba(22,163,74,0.08)', color:'rgba(22,163,74,0.8)', border:'1px solid rgba(22,163,74,0.2)'}}>
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="/planilha-clt.xlsx"
                  download="Controle-Financeiro-CLT-MaicknucleaR.xlsx"
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-all"
                  style={{background:'rgba(22,163,74,0.15)', color:'#16a34a', border:'1px solid rgba(22,163,74,0.3)'}}>
                  ⬇️ Baixar Grátis
                </a>
              </div>

              {/* Card futuro 1 */}
              <div className="rounded-xl p-5 flex flex-col gap-3 opacity-50"
                style={{background: 'rgba(10,10,15,0.4)', border: '1px dashed rgba(217,119,6,0.15)'}}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.15)'}}>
                    📈
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm" style={{color: 'var(--text-primary)'}}>
                      Calculadora de Juros Compostos
                    </h4>
                    <p className="text-xs" style={{color: '#d97706'}}>Em breve</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{color: 'var(--text-secondary)'}}>
                  Simule o crescimento dos seus investimentos ao longo do tempo.
                </p>
              </div>

              {/* Card futuro 2 */}
              <div className="rounded-xl p-5 flex flex-col gap-3 opacity-50"
                style={{background: 'rgba(10,10,15,0.4)', border: '1px dashed rgba(217,119,6,0.15)'}}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)'}}>
                    🎯
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm" style={{color: 'var(--text-primary)'}}>
                      Planner de Metas Financeiras
                    </h4>
                    <p className="text-xs" style={{color: '#7c3aed'}}>Em breve</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{color: 'var(--text-secondary)'}}>
                  Defina e acompanhe metas com prazo e progresso visual.
                </p>
              </div>

            </div>
          </div>

          {/* Affiliate & Donation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl p-5"
              style={{background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.15)'}}>
              <p className="text-xs mb-3" style={{color: 'var(--text-secondary)'}}>🔗 Links de afiliado</p>
              <a href="https://www.mercadolivre.com.br/livro-a-psicologia-financeira-licoes-atemporais-sobre-fortuna-ganncia-e-felicidade-de-housel-morgan-editora-harpercollins-brasil-capa-mole-em-portugus-2021/p/MLB19320442?matt_event_ts=1772937327156&matt_d2id=dfa58651-a180-428e-94df-fc8220896524&matt_tracing_id=2645612b-68d0-448d-b4bc-afd2c69ca15b#polycard_client=recommendations_home_affiliate-profile&reco_backend=item_decorator&reco_client=home_affiliate-profile&reco_item_pos=0&source=affiliate-profile&reco_backend_type=function&reco_id=d6662921-6799-4116-87e3-70bcf33908c5&tracking_id=7fda547d-806f-4eb5-b606-fcfc0e6d0c51&wid=MLB5270193474&sid=recos&c_id=/home/card-featured/element&c_uid=2068bc96-c9f3-4c7c-9c82-1cce86d69fd4"
                target="_blank" rel="noopener noreferrer"
                className="font-semibold text-sm block mb-1 hover:underline" style={{color: '#d97706'}}>
                📚 A Psicologia Financeira — Morgan Housel
              </a>
              <p className="text-xs mt-1" style={{color: 'var(--text-secondary)', opacity: 0.6}}>
                (Link de afiliado — sem custo adicional para você)
              </p>
            </div>
            <div className="rounded-xl p-5 text-center"
              style={{background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(217,119,6,0.15)'}}>
              <p className="text-sm mb-2" style={{color: 'var(--text-secondary)'}}>☕ Apoie este projeto</p>
              <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden"
                style={{border: '2px solid rgba(217,119,6,0.3)', background: 'white', padding: '4px'}}>
                <img src="/qrcode-donation.jpg" alt="QR Code PIX" className="w-full h-full object-cover rounded-lg" />
              </div>
              <p className="text-xs mt-2" style={{color: '#d97706'}}>PIX / Qualquer valor 🙏</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

// ─── Chat Screen ────────────────────────────────────────────────────────────

function ChatScreen({ agent, user, onBack }: { agent: Agent, user: any, onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [totalTokens, setTotalTokens] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input.trim() }
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

      if (!res.ok) {
        toast.error(data.error || 'Erro ao conectar com a IA.')
        setLoading(false)
        return
      }

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.content,
        tokens: data.tokens,
      }
      setMessages([...newMessages, assistantMsg])
      if (data.tokens) setTotalTokens(t => t + data.tokens)

    } catch (e) {
      toast.error('Erro de conexão. Verifique sua internet.')
    }

    setLoading(false)
  }

  const exportPDF = async () => {
    if (messages.length === 0) return toast.error('Nenhuma mensagem para exportar.')
    try {
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      let y = 20

      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Financial Freedom by MaicknucleaR', 10, y); y += 8
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(`Sessão com: ${agent.name} — ${agent.role}`, 10, y); y += 6
      doc.setFontSize(8)
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')} | Usuário: ${user?.email}`, 10, y); y += 8

      doc.setTextColor(150)
      const disc = doc.splitTextToSize(
        'AVISO: Conteúdo exclusivamente educacional. Não constitui consultoria ou recomendação de investimento.', 190
      )
      doc.text(disc, 10, y); y += disc.length * 5 + 6
      doc.setTextColor(0)

      messages.forEach(msg => {
        if (y > 270) { doc.addPage(); y = 20 }
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text(msg.role === 'user' ? 'Você:' : `${agent.name}:`, 10, y); y += 5
        doc.setFont('helvetica', 'normal')
        const lines = doc.splitTextToSize(msg.content, 185)
        doc.text(lines, 10, y); y += lines.length * 4.5 + 6
      })

      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text('Criado por MaicknucleaR — @dubmariachi', 10, 290)
      doc.save(`ff-${agent.id}-${Date.now()}.pdf`)
      toast.success('PDF exportado!')
    } catch (e) {
      toast.error('Erro ao gerar PDF.')
    }
  }

  return (
    <div className="h-screen flex flex-col" style={{background: 'var(--obsidian)'}}>
      <div className="fixed inset-0 hex-pattern opacity-10 pointer-events-none" />

      {/* Chat header */}
      <header className="relative z-40 glass" style={{borderBottom: '1px solid rgba(217,119,6,0.15)'}}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-sm mr-1 transition-colors"
              style={{color: 'var(--text-secondary)'}}>←</button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{background: `${agent.color}15`, border: `1px solid ${agent.color}40`}}>
              {agent.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{color: 'var(--text-primary)'}}>{agent.name}</h3>
              <p className="text-xs" style={{color: agent.color}}>{agent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {totalTokens > 0 && (
              <span className="text-xs hidden md:block" style={{color: 'rgba(168,159,140,0.5)'}}>
                {totalTokens.toLocaleString()} tokens
              </span>
            )}
            <button onClick={exportPDF}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{color: '#d97706', border: '1px solid rgba(217,119,6,0.3)'}}>
              📄 Exportar PDF
            </button>
          </div>
        </div>
        <div className="px-4 pb-2 max-w-4xl mx-auto">
          <DisclaimerChatBar />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <WelcomeMessage agent={agent} onSuggestion={s => setInput(s)} />
          )}
          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              role={msg.role}
              content={msg.content}
              agentAvatar={agent.avatar}
              agentColor={agent.color}
              tokens={msg.tokens}
            />
          ))}
          {loading && <TypingIndicator agentAvatar={agent.avatar} agentColor={agent.color} />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="relative z-40 glass" style={{borderTop: '1px solid rgba(217,119,6,0.15)'}}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
              }}
              placeholder="Faça uma pergunta ou traga seu plano financeiro..."
              rows={2}
              className="input-gold flex-1 px-4 py-3 rounded-xl text-sm resize-none"
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}
              className="btn-gold px-5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed text-lg">
              →
            </button>
          </div>
          <p className="text-xs mt-1.5 text-center" style={{color: 'rgba(168,159,140,0.4)'}}>
            Enter para enviar • Shift+Enter nova linha • Mensagens apagadas ao fechar
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Welcome Message ─────────────────────────────────────────────────────────

function WelcomeMessage({ agent, onSuggestion }: { agent: Agent, onSuggestion: (s: string) => void }) {
  const suggestions: Record<string, string[]> = {
    buffett: [
      'Como identificar uma empresa com vantagem competitiva?',
      'O que é margem de segurança e como calcular?',
      'Tenho R$500/mês para investir. Por onde começo?',
      'Como o value investing pode me levar ao primeiro milhão?',
    ],
    dalio: [
      'O que é o portfólio All Weather e como montar?',
      'Estamos em qual fase do ciclo econômico atual?',
      'Como proteger meu patrimônio da inflação?',
      'Explique os ciclos de dívida de curto e longo prazo',
    ],
    saylor: [
      'Por que Bitcoin e não outras criptos?',
      'Como começar a acumular Bitcoin com pouco dinheiro?',
      'Quais são os principais riscos do Bitcoin?',
      'Como a inflação corrói o poder de compra?',
    ],
    soros: [
      'O que é a teoria da reflexividade nos mercados?',
      'Como identificar uma bolha antes que estoure?',
      'Quais cenários geopolíticos impactam o Brasil agora?',
      'Como os grandes traders se protegem em crises?',
    ],
    default: [
      'Analise minha situação e sugira um caminho',
      'Quero sair do salário mínimo e chegar ao primeiro milhão',
      'Como montar uma carteira diversificada do zero?',
      'Qual o cenário econômico global atual?',
    ],
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
      <p className="text-sm max-w-md mx-auto mb-6" style={{color: 'var(--text-secondary)'}}>
        {agent.specialty}
      </p>
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
