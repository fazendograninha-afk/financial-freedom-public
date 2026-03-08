# ============================================================
# Financial Freedom by MaicknucleaR — Setup Completo v3
# Execute como: .\setup-financialfreedom.ps1
# ============================================================

$base = "G:\IA\financialfreedom-saas"
Set-Location $base

Write-Host "🚀 Atualizando Financial Freedom..." -ForegroundColor Yellow

# Cria pastas necessárias
New-Item -ItemType Directory -Path "src\components" -Force | Out-Null
New-Item -ItemType Directory -Path "src\pages\api" -Force | Out-Null
New-Item -ItemType Directory -Path "src\pages\admin" -Force | Out-Null
New-Item -ItemType Directory -Path "public" -Force | Out-Null

# ── package.json ─────────────────────────────────────────────
Set-Content "package.json" -Encoding UTF8 '{
  "name": "financialfreedom-saas",
  "version": "1.0.0",
  "private": true,
  "engines": { "node": ">=20.0.0", "npm": ">=9.0.0" },
  "scripts": {
    "dev": "next dev -p 3003",
    "build": "next build",
    "start": "next start -p 3003",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.35",
    "react": "^18",
    "react-dom": "^18",
    "@supabase/supabase-js": "^2.45.0",
    "groq-sdk": "^0.5.0",
    "jspdf": "^2.5.1",
    "jspdf-autotable": "^3.8.2",
    "lucide-react": "^0.400.0",
    "framer-motion": "^11.3.2",
    "qrcode.react": "^3.1.0",
    "react-hot-toast": "^2.4.1",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10",
    "postcss": "^8",
    "tailwindcss": "^3",
    "eslint": "^8",
    "eslint-config-next": "^14.2.35"
  }
}'
Write-Host "✅ package.json" -ForegroundColor Green

# ── .nvmrc ────────────────────────────────────────────────────
Set-Content ".nvmrc" -Encoding UTF8 "20"
Write-Host "✅ .nvmrc" -ForegroundColor Green

# ── railway.toml ──────────────────────────────────────────────
Set-Content "railway.toml" -Encoding UTF8 '[build]
builder = "NIXPACKS"
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "npm start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10'
Write-Host "✅ railway.toml" -ForegroundColor Green

# ── API chat.ts ───────────────────────────────────────────────
$chatApi = @'
import type { NextApiRequest, NextApiResponse } from 'next'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it']

const SUFFIX = `
REGRAS ABSOLUTAS:
1. NUNCA diga "compre", "venda", "recomendo"
2. SEMPRE em português do Brasil
3. Linguagem: "historicamente", "dados mostram", "para fins educacionais"
4. SEMPRE termine com aviso de buscar profissional habilitado
5. Máximo 600 palavras
Esta plataforma é ferramenta EDUCACIONAL. Não constitui consultoria financeira.`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { messages, systemPrompt } = req.body
  if (!messages || !systemPrompt) return res.status(400).json({ error: 'Missing fields' })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY não configurada no Railway.' })

  for (const model of MODELS) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt + SUFFIX },
            ...messages.map((m: any) => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.7,
          max_tokens: 1024,
          stream: false,
        })
      })

      if (response.status === 401) return res.status(401).json({ error: 'Chave Groq inválida. Regenere em console.groq.com e atualize no Railway.' })
      if (!response.ok) { continue }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content
      if (!content) continue

      return res.status(200).json({ content, tokens: data.usage?.total_tokens || 0, model })
    } catch (e) { continue }
  }

  return res.status(500).json({ error: 'Todos os modelos falharam. Verifique GROQ_API_KEY no Railway.' })
}
'@
Set-Content "src\pages\api\chat.ts" -Encoding UTF8 $chatApi
Write-Host "✅ src/pages/api/chat.ts (modelos atualizados)" -ForegroundColor Green

# ── Footer component ──────────────────────────────────────────
$footer = @'
export default function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="relative z-10 py-6 px-6 text-center" style={{borderTop: "1px solid rgba(217,119,6,0.1)"}}>
      {!compact && (
        <div className="max-w-4xl mx-auto mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <a href="/disclaimer" className="hover:underline" style={{color: "#d97706"}}>Disclaimer Financeiro</a>
          <a href="/terms" className="hover:underline" style={{color: "#d97706"}}>Termos de Uso</a>
          <a href="/privacy" className="hover:underline" style={{color: "#d97706"}}>Politica de Privacidade</a>
          <a href="/about" className="hover:underline" style={{color: "#d97706"}}>Sobre</a>
        </div>
      )}
      <p className="text-xs" style={{color: "var(--text-secondary)"}}>
        Plataforma educacional. Nao constitui consultoria financeira.
      </p>
      <p className="text-xs mt-1" style={{color: "#ffffff"}}>
        Criado Por MaicknucleaR —{" "}
        <a href="https://instagram.com/dubmariachi" target="_blank" rel="noopener noreferrer"
          className="hover:underline" style={{color: "#d97706"}}>@dubmariachi</a>
      </p>
    </footer>
  )
}
'@
Set-Content "src\components\Footer.tsx" -Encoding UTF8 $footer
Write-Host "✅ src/components/Footer.tsx" -ForegroundColor Green

# ── DisclaimerBanner ──────────────────────────────────────────
$disclaimer = @'
export const DISCLAIMER_SHORT = "Esta plataforma e uma ferramenta digital de organizacao e visualizacao de informacoes financeiras para fins exclusivamente educacionais e informacionais. Nao constitui consultoria financeira, recomendacao de investimento ou assessoria de qualquer natureza. Toda decisao financeira e de exclusiva responsabilidade do usuario."
export const DISCLAIMER_MINI = "Ferramenta educacional e informacional. Nao constitui consultoria ou recomendacao de investimento. Decisoes financeiras sao de sua exclusiva responsabilidade."

export function DisclaimerBanner({ mini = false }: { mini?: boolean }) {
  return (
    <div className="disclaimer-box rounded-lg p-3 text-xs leading-relaxed" style={{color: "var(--text-secondary)"}}>
      {mini ? `⚠️ ${DISCLAIMER_MINI}` : `⚠️ ${DISCLAIMER_SHORT}`}
    </div>
  )
}

export function DisclaimerChatBar() {
  return (
    <div className="disclaimer-box rounded px-3 py-1.5 text-xs" style={{color: "rgba(168,159,140,0.7)"}}>
      ⚠️ Conteudo educacional. Nao constitui recomendacao de investimento. Mensagens apagadas ao fechar.
    </div>
  )
}
'@
Set-Content "src\components\DisclaimerBanner.tsx" -Encoding UTF8 $disclaimer
Write-Host "✅ src/components/DisclaimerBanner.tsx" -ForegroundColor Green

# ── AgentCard ─────────────────────────────────────────────────
$agentCard = @'
import { Agent } from "../agents/agents"

interface AgentCardProps { agent: Agent; onClick: () => void; recommended?: boolean }

export default function AgentCard({ agent, onClick, recommended }: AgentCardProps) {
  return (
    <button onClick={onClick}
      className="border-gold-glow rounded-xl p-5 text-left transition-all hover:scale-[1.02] w-full"
      style={{background: "rgba(10,10,15,0.7)", position: "relative", overflow: "hidden"}}>
      {recommended && (
        <div className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full"
          style={{background: "rgba(217,119,6,0.2)", color: "#d97706", border: "1px solid rgba(217,119,6,0.3)"}}>
          ★ Ideal
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{background: `${agent.color}15`, border: `1px solid ${agent.color}40`}}>
          {agent.avatar}
        </div>
        <div>
          <h4 className="font-semibold text-sm" style={{color: "var(--text-primary)"}}>{agent.name}</h4>
          <p className="text-xs" style={{color: agent.color}}>{agent.role}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed" style={{color: "var(--text-secondary)"}}>{agent.specialty}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {agent.bestFor.slice(0, 3).map((tag: string) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
            style={{background: "rgba(217,119,6,0.08)", color: "rgba(217,119,6,0.7)", border: "1px solid rgba(217,119,6,0.15)"}}>
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}
'@
Set-Content "src\components\AgentCard.tsx" -Encoding UTF8 $agentCard
Write-Host "✅ src/components/AgentCard.tsx" -ForegroundColor Green

# ── ChatBubble ────────────────────────────────────────────────
$chatBubble = @'
interface ChatBubbleProps { role: "user"|"assistant"; content: string; agentAvatar?: string; agentColor?: string; tokens?: number }

export default function ChatBubble({ role, content, agentAvatar, agentColor, tokens }: ChatBubbleProps) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      {role === "assistant" && agentAvatar && (
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg mr-2 flex-shrink-0 mt-1"
          style={{background: `${agentColor}20`, border: `1px solid ${agentColor}30`}}>
          {agentAvatar}
        </div>
      )}
      <div className="max-w-[80%]">
        <div className={`px-4 py-3 text-sm leading-relaxed ${role === "user" ? "chat-user" : "chat-ai"}`}
          style={{color: "var(--text-primary)", whiteSpace: "pre-wrap"}}>
          {content}
        </div>
        {tokens !== undefined && tokens > 0 && (
          <p className="text-right text-xs mt-1 pr-1" style={{color: "rgba(168,159,140,0.4)"}}>~{tokens} tokens</p>
        )}
      </div>
    </div>
  )
}

export function TypingIndicator({ agentAvatar, agentColor }: { agentAvatar: string; agentColor: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
        style={{background: `${agentColor}20`, border: `1px solid ${agentColor}30`}}>
        {agentAvatar}
      </div>
      <div className="chat-ai px-4 py-3 flex gap-1.5">
        {[0,1,2].map(i => (
          <div key={i} className="typing-dot w-2 h-2 rounded-full"
            style={{background: "#d97706", animationDelay: `${i * 0.2}s`}} />
        ))}
      </div>
    </div>
  )
}
'@
Set-Content "src\components\ChatBubble.tsx" -Encoding UTF8 $chatBubble
Write-Host "✅ src/components/ChatBubble.tsx" -ForegroundColor Green

# ── LoadingScreen ─────────────────────────────────────────────
$loading = @'
export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: "var(--obsidian)"}}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
          style={{background: "linear-gradient(135deg, #d97706, #92400e)", boxShadow: "0 0 30px rgba(217,119,6,0.3)"}}>
          ₿
        </div>
        <div className="flex gap-1.5 justify-center">
          {[0,1,2].map(i => (
            <div key={i} className="typing-dot w-2 h-2 rounded-full"
              style={{background: "#d97706", animationDelay: `${i * 0.2}s`}} />
          ))}
        </div>
      </div>
    </div>
  )
}
'@
Set-Content "src\components\LoadingScreen.tsx" -Encoding UTF8 $loading
Write-Host "✅ src/components/LoadingScreen.tsx" -ForegroundColor Green

# ── reset-password.tsx ────────────────────────────────────────
$resetPwd = @'
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"
import Head from "next/head"
import Footer from "../components/Footer"

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true)
    })
  }, [])

  const handleReset = async () => {
    if (!password || !confirm) return toast.error("Preencha todos os campos")
    if (password.length < 6) return toast.error("Minimo 6 caracteres")
    if (password !== confirm) return toast.error("As senhas nao coincidem")
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { toast.error(error.message) }
    else { toast.success("Senha atualizada!"); router.push("/dashboard") }
    setLoading(false)
  }

  return (
    <>
      <Head><title>Nova Senha — Financial Freedom</title></Head>
      <div className="min-h-screen flex flex-col" style={{background: "var(--obsidian)"}}>
        <div className="fixed inset-0 hex-pattern opacity-20 pointer-events-none" />
        <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🔐</div>
              <h1 className="font-display text-2xl font-bold text-gold-gradient">Nova Senha</h1>
              <p className="text-sm mt-1" style={{color: "var(--text-secondary)"}}>
                {ready ? "Digite sua nova senha abaixo" : "Aguardando verificacao do link..."}
              </p>
            </div>
            {ready ? (
              <div className="rounded-2xl p-6 border-gold-glow" style={{background: "rgba(10,10,15,0.9)"}}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{color: "var(--text-secondary)"}}>Nova senha</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Minimo 6 caracteres" className="input-gold w-full px-4 py-3 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{color: "var(--text-secondary)"}}>Confirmar senha</label>
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                      placeholder="Repita a nova senha" className="input-gold w-full px-4 py-3 rounded-lg text-sm"
                      onKeyDown={e => e.key === "Enter" && handleReset()} />
                  </div>
                  <button onClick={handleReset} disabled={loading}
                    className="w-full btn-gold py-3 rounded-lg font-semibold text-sm disabled:opacity-40">
                    {loading ? "Atualizando..." : "Definir Nova Senha"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 rounded-2xl border-gold-glow" style={{background: "rgba(10,10,15,0.9)"}}>
                <div className="flex gap-1.5 justify-center mb-3">
                  {[0,1,2].map(i => (
                    <div key={i} className="typing-dot w-2 h-2 rounded-full"
                      style={{background: "#d97706", animationDelay: `${i * 0.2}s`}} />
                  ))}
                </div>
                <p className="text-sm" style={{color: "var(--text-secondary)"}}>Verificando link...</p>
              </div>
            )}
          </div>
        </div>
        <Footer compact />
      </div>
    </>
  )
}
'@
Set-Content "src\pages\reset-password.tsx" -Encoding UTF8 $resetPwd
Write-Host "✅ src/pages/reset-password.tsx" -ForegroundColor Green

Write-Host ""
Write-Host "🎯 Reinstalando dependencias..." -ForegroundColor Yellow
Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
npm install

Write-Host ""
Write-Host "📤 Fazendo push para GitHub..." -ForegroundColor Yellow
git add .
git commit -m "fix: chat funcionando + recuperacao senha + afiliado livro + branding branco"
git push

Write-Host ""
Write-Host "✅ TUDO PRONTO! Railway vai fazer redeploy automatico." -ForegroundColor Green
Write-Host "🔑 Lembre de regenerar a chave Groq em console.groq.com" -ForegroundColor Red
