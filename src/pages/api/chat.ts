import type { NextApiRequest, NextApiResponse } from 'next'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

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

  const { messages, agentId, systemPrompt } = req.body

  if (!messages || !systemPrompt) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API key not configured. Configure GROQ_API_KEY no seu .env' })
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt + GLOBAL_SYSTEM_SUFFIX
          },
          ...messages.map((m: any) => ({
            role: m.role,
            content: m.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: false,
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Groq API error:', error)
      return res.status(response.status).json({ error: 'Groq API error', details: error })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || 'Erro ao processar resposta.'

    return res.status(200).json({ content })

  } catch (error: any) {
    console.error('Chat API error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}
