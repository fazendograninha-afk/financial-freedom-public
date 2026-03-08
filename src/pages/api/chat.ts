import type { NextApiRequest, NextApiResponse } from 'next'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Modelos Groq ativos em 2025 — fallback automático se um falhar
const MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
]

const GLOBAL_SYSTEM_SUFFIX = `

REGRAS ABSOLUTAS DE COMPLIANCE - NUNCA VIOLE:
1. NUNCA diga "compre", "venda", "recomendo comprar/vender"
2. NUNCA indique ativo específico como recomendação
3. SEMPRE use linguagem: "historicamente", "dados mostram", "para fins educacionais", "uma análise informacional indica"
4. SEMPRE termine com aviso sobre buscar profissional habilitado
5. Você é uma FERRAMENTA EDUCACIONAL, não um consultor financeiro
6. Responda SEMPRE em português do Brasil
7. Seja profundo, educativo e inspire o usuário a aprender mais
8. Use analogias e exemplos práticos para explicar conceitos complexos
9. Adapte a linguagem ao perfil do usuário (iniciante vs experiente)
10. Máximo de 600 palavras por resposta para manter clareza

POSICIONAMENTO OBRIGATÓRIO: Esta plataforma é uma ferramenta de organização e visualização de informações financeiras para fins educacionais e informacionais. Não constitui consultoria financeira nem recomendação de investimento.`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, systemPrompt } = req.body

  if (!messages || !systemPrompt) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'GROQ_API_KEY não configurada. Adicione a variável de ambiente no Railway.' 
    })
  }

  const body = JSON.stringify({
    model: MODELS[0],
    messages: [
      { role: 'system', content: systemPrompt + GLOBAL_SYSTEM_SUFFIX },
      ...messages.map((m: any) => ({ role: m.role, content: m.content }))
    ],
    temperature: 0.7,
    max_tokens: 1024,
    stream: false,
  })

  // Tenta cada modelo em sequência até um funcionar
  for (const model of MODELS) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt + GLOBAL_SYSTEM_SUFFIX },
            ...messages.map((m: any) => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.7,
          max_tokens: 1024,
          stream: false,
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Modelo ${model} falhou:`, errorText)
        // Se for erro de modelo não encontrado, tenta o próximo
        if (response.status === 404 || response.status === 400) continue
        // Se for erro de autenticação, para imediatamente
        if (response.status === 401) {
          return res.status(401).json({ 
            error: 'Chave Groq inválida ou expirada. Regenere em console.groq.com e atualize no Railway.' 
          })
        }
        continue
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content
      const tokens = data.usage?.total_tokens || 0

      if (!content) {
        return res.status(500).json({ error: 'Resposta vazia da IA.' })
      }

      return res.status(200).json({ content, tokens, model })

    } catch (err: any) {
      console.error(`Erro no modelo ${model}:`, err.message)
      continue
    }
  }

  return res.status(500).json({ 
    error: 'Todos os modelos falharam. Verifique sua chave Groq no Railway.' 
  })
}
