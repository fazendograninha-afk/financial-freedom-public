import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import Head from 'next/head'

const STEPS = [
  {
    id: 'level',
    question: 'Qual é sua situação financeira atual?',
    emoji: '🌱',
    options: [
      { value: 'salario-minimo', label: 'Recebo salário mínimo ou próximo disso', icon: '💰', desc: 'Quero começar do zero e chegar ao primeiro milhão' },
      { value: 'empregado', label: 'Tenho renda estável mas não invisto', icon: '📊', desc: 'Ganho bem mas o dinheiro some todo mês' },
      { value: 'empreendedor', label: 'Sou empreendedor / autônomo', icon: '🚀', desc: 'Tenho negócio próprio e quero fazer crescer mais' },
      { value: 'investidor', label: 'Já invisto e quero evoluir', icon: '💎', desc: 'Tenho patrimônio e quero proteger e multiplicar' },
    ]
  },
  {
    id: 'objective',
    question: 'Qual é seu principal objetivo agora?',
    emoji: '🎯',
    options: [
      { value: 'reserva-emergencia', label: 'Criar minha reserva de emergência', icon: '🛡️', desc: 'Segurança antes de qualquer coisa' },
      { value: 'primeiro-investimento', label: 'Fazer meu primeiro investimento', icon: '📈', desc: 'Nunca investi e quero começar' },
      { value: 'diversificar', label: 'Diversificar minha carteira', icon: '⚖️', desc: 'Já invisto e quero mais opções' },
      { value: 'cripto', label: 'Entender e investir em cripto', icon: '₿', desc: 'Bitcoin, Ethereum, DeFi' },
      { value: 'renda-passiva', label: 'Gerar renda passiva', icon: '💸', desc: 'Dinheiro trabalhando por mim' },
      { value: 'primeiro-milhao', label: 'Chegar ao meu primeiro milhão', icon: '🏆', desc: 'Meta ambiciosa e clara' },
    ]
  },
  {
    id: 'profile',
    question: 'Como você lida com risco financeiro?',
    emoji: '⚡',
    options: [
      { value: 'conservador', label: 'Conservador', icon: '🛡️', desc: 'Prefiro segurança. Aceito retornos menores para não ter sustos' },
      { value: 'moderado', label: 'Moderado', icon: '⚖️', desc: 'Quero equilibrar segurança e crescimento. Aceito alguma volatilidade' },
      { value: 'arrojado', label: 'Arrojado', icon: '🚀', desc: 'Topo risco por retornos maiores. Aguento ver patrimônio oscilar forte' },
    ]
  },
  {
    id: 'horizon',
    question: 'Qual é seu horizonte de investimento?',
    emoji: '⏳',
    options: [
      { value: 'curto', label: 'Curto prazo (até 2 anos)', icon: '⚡', desc: 'Preciso do dinheiro em breve' },
      { value: 'medio', label: 'Médio prazo (2-5 anos)', icon: '📅', desc: 'Posso esperar alguns anos' },
      { value: 'longo', label: 'Longo prazo (5-15 anos)', icon: '🌳', desc: 'Estou construindo para o futuro' },
      { value: 'decadas', label: 'Décadas (15+ anos)', icon: '🏔️', desc: 'Modo Warren Buffett ativado' },
    ]
  }
]

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/')
    })
  }, [])

  const currentStep = STEPS[step]

  const handleSelect = async (value: string) => {
    const newAnswers = { ...answers, [currentStep.id]: value }
    setAnswers(newAnswers)

    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      // Save and go to dashboard
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          financial_profile: newAnswers.profile || 'conservador',
          level: newAnswers.level || 'iniciante',
          objective: newAnswers.objective || 'primeiro-investimento',
        })
      }
      toast.success('Perfil criado! Bem-vindo ao Financial Freedom.')
      router.push('/dashboard')
      setSaving(false)
    }
  }

  const progress = ((step) / STEPS.length) * 100

  return (
    <>
      <Head><title>Configurando seu Perfil — Financial Freedom</title></Head>
      <div className="min-h-screen flex flex-col" style={{background: 'var(--obsidian)'}}>
        <div className="fixed inset-0 hex-pattern opacity-20 pointer-events-none" />

        {/* Progress */}
        <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{background: 'rgba(217,119,6,0.1)'}}>
          <div className="h-full transition-all duration-500" style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #d97706, #f59e0b)'
          }} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
          <div className="w-full max-w-2xl">
            {/* Step counter */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                Passo {step + 1} de {STEPS.length}
              </p>
              <div className="flex gap-2">
                {STEPS.map((_, i) => (
                  <div key={i} className="w-8 h-1 rounded-full transition-all"
                    style={{background: i <= step ? '#d97706' : 'rgba(217,119,6,0.2)'}} />
                ))}
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">{currentStep.emoji}</div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>
                {currentStep.question}
              </h2>
              <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                Isso vai definir qual estratégia e especialistas são ideais para você
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentStep.options.map(option => (
                <button key={option.value} onClick={() => handleSelect(option.value)}
                  className="border-gold-glow rounded-xl p-5 text-left transition-all group hover:scale-[1.02]"
                  style={{background: 'rgba(10,10,15,0.8)'}}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <p className="font-semibold text-sm mb-1" style={{color: 'var(--text-primary)'}}>
                        {option.label}
                      </p>
                      <p className="text-xs leading-relaxed" style={{color: 'var(--text-secondary)'}}>
                        {option.desc}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {step > 0 && (
              <button onClick={() => setStep(step - 1)}
                className="mt-6 w-full text-center text-sm py-2 transition-colors"
                style={{color: 'var(--text-secondary)'}}>
                ← Voltar
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
