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
import CryptoBar from '../components/CryptoBar'

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

        <CryptoBar />

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

          {/* Livros Recomendados */}
          <div className="mb-8">
            <h3 className="font-display text-xl font-bold mb-1 text-gold-gradient">📚 Leituras Recomendadas</h3>
            <p className="text-xs mb-4" style={{color: 'var(--text-secondary)'}}>
              Links de afiliado — sem custo adicional para você
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  emoji: '🧠', cor: '#d97706',
                  titulo: 'A Psicologia Financeira',
                  autor: 'Morgan Housel',
                  desc: 'Lições atemporais sobre fortuna, ganância e felicidade',
                  url: 'https://www.mercadolivre.com.br/livro-a-psicologia-financeira-licoes-atemporais-sobre-fortuna-ganncia-e-felicidade-de-housel-morgan-editora-harpercollins-brasil-capa-mole-em-portugus-2021/p/MLB19320442?matt_event_ts=1772937327156&matt_d2id=dfa58651-a180-428e-94df-fc8220896524&matt_tracing_id=2645612b-68d0-448d-b4bc-afd2c69ca15b#polycard_client=recommendations_home_affiliate-profile&reco_backend=item_decorator&reco_client=home_affiliate-profile&reco_item_pos=0&source=affiliate-profile&reco_backend_type=function&reco_id=d6662921-6799-4116-87e3-70bcf33908c5&tracking_id=7fda547d-806f-4eb5-b606-fcfc0e6d0c51&wid=MLB5270193474&sid=recos&c_id=/home/card-featured/element&c_uid=2068bc96-c9f3-4c7c-9c82-1cce86d69fd4'
                },
                {
                  emoji: '👑', cor: '#7c3aed',
                  titulo: 'As 48 Leis do Poder',
                  autor: 'Robert Greene',
                  desc: 'O clássico sobre poder, estratégia e influência',
                  url: 'https://www.mercadolivre.com.br/as-48-leis-do-poder-robert-greene-editora-rocco-ltda/p/MLB19202572?matt_event_ts=1773024958142&matt_d2id=dfa58651-a180-428e-94df-fc8220896524&matt_tracing_id=c5a4c58f-fbe4-4b9c-b05e-24c0c38ab752#polycard_client=recommendations_home_affiliate-profile&reco_backend=item_decorator&reco_client=home_affiliate-profile&reco_item_pos=0&source=affiliate-profile&reco_backend_type=function&reco_id=7d389016-7228-4991-9705-9f701624a779&tracking_id=0080cd0f-1d00-4a92-8c45-9d8e9a925dc8&wid=MLB3853877213&sid=recos&c_id=/home/card-featured/element&c_uid=8664141c-f5fd-4380-8ff1-1ab0571339a7'
                },
                {
                  emoji: '💰', cor: '#16a34a',
                  titulo: 'Pai Rico, Pai Pobre',
                  autor: 'Robert Kiyosaki',
                  desc: 'O que os ricos ensinam a seus filhos sobre dinheiro',
                  url: 'https://www.mercadolivre.com.br/pai-rico-pai-pobre-edico-de-20-anos-atualizada-e-ampliada-o-que-os-ricos-ensinam-a-seus-filhos-sobre-dinheiro-editora-alta-books/p/MLB19443719?pdp_filters=item_id%3AMLB3959727810&matt_event_ts=1773025011220&matt_d2id=dfa58651-a180-428e-94df-fc8220896524&matt_tracing_id=429e8d69-78c4-4c10-8a17-fa856ee70f11#polycard_client=recommendations_home_affiliate-profile&reco_backend=item_decorator&wid=MLB3959727810&reco_client=home_affiliate-profile&reco_item_pos=0&source=affiliate-profile&reco_backend_type=function&reco_id=a9072325-f061-4734-bcfb-c6095e6e88f1&tracking_id=a8c0b589-db6f-4f6e-b924-d948ec85f61c&sid=recos&c_id=/home/card-featured/element&c_uid=2a634273-2fd5-4374-bdb1-91c933b334a1'
                },
                {
                  emoji: '⚡', cor: '#2563eb',
                  titulo: 'O Poder do Hábito',
                  autor: 'Charles Duhigg',
                  desc: 'Por que fazemos o que fazemos na vida e nos negócios',
                  url: 'https://www.mercadolivre.com.br/o-poder-do-habito-de-charles-duhigg-editora-objetiva-capa-mole/p/MLB19458761?matt_event_ts=1773025106029&matt_d2id=dfa58651-a180-428e-94df-fc8220896524&matt_tracing_id=ab7c1efc-766d-48f6-94d7-2aa1cb6956bf#polycard_client=recommendations_home_affiliate-profile&reco_backend=item_decorator&reco_client=home_affiliate-profile&reco_item_pos=0&source=affiliate-profile&reco_backend_type=function&reco_id=8a286ed9-03bc-43a3-bd70-fbb4454c1044&tracking_id=f18d1984-4ac7-46c6-a2b6-e35c0201bb68&wid=MLB3902925595&sid=recos&c_id=/home/card-featured/element&c_uid=6704cf6c-4886-4429-98c3-f99089e0710c'
                },
                {
                  emoji: '🎯', cor: '#dc2626',
                  titulo: 'A Arte de Gastar Dinheiro',
                  autor: 'Morgan Housel',
                  desc: 'Escolhas simples para uma vida financeira equilibrada',
                  url: 'https://www.mercadolivre.com.br/a-arte-de-gastar-dinheiro-escolhas-simples-para-uma-vida-equilibrada-do-mesmo-autor-de-a-psicologia-financeira/p/MLB53908652?matt_event_ts=1773025141050&matt_d2id=dfa58651-a180-428e-94df-fc8220896524&matt_tracing_id=b80ab0fc-6338-40af-a6a2-ea4a3a510d6d#polycard_client=recommendations_home_affiliate-profile&reco_backend=item_decorator&reco_client=home_affiliate-profile&reco_item_pos=0&source=affiliate-profile&reco_backend_type=function&reco_id=9b66bdbf-936d-4a7a-b941-4e27f4d04eb2&tracking_id=cc64ec83-f0fb-42f6-8def-35de49db5644&wid=MLB4224850923&sid=recos&c_id=/home/card-featured/element&c_uid=5066b0ca-dcdb-48ce-b94f-454793d54388'
                },
                {
                  emoji: '☕', cor: '#d97706',
                  titulo: 'Apoie este projeto',
                  autor: 'PIX — qualquer valor',
                  desc: 'Sua contribuição mantém o projeto gratuito e vivo 🙏',
                  url: null,
                  qr: true
                },
              ].map((item: any) => (
                <div key={item.titulo}
                  className="rounded-xl p-4 flex flex-col gap-2 transition-all hover:scale-[1.01]"
                  style={{background: 'rgba(10,10,15,0.7)', border: `1px solid ${item.cor}25`}}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <p className="text-xs font-semibold leading-tight" style={{color: 'var(--text-primary)'}}>{item.titulo}</p>
                      <p className="text-xs" style={{color: item.cor}}>{item.autor}</p>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{color: 'var(--text-secondary)'}}>{item.desc}</p>
                  {item.qr ? (
                    <div className="flex justify-center mt-1">
                      <div className="w-16 h-16 rounded-lg overflow-hidden"
                        style={{border: `2px solid ${item.cor}40`, background: 'white', padding: '3px'}}>
                        <img src="/qrcode-donation.jpg" alt="QR Code PIX" className="w-full h-full object-cover rounded" />
                      </div>
                    </div>
                  ) : (
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="text-center text-xs py-1.5 rounded-lg mt-auto transition-colors hover:opacity-90"
                      style={{background: `${item.cor}15`, color: item.cor, border: `1px solid ${item.cor}30`}}>
                      Ver no Mercado Livre →
                    </a>
                  )}
                </div>
              ))}
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
