import Head from 'next/head'
import Link from 'next/link'

export default function Disclaimer() {
  return (
    <>
      <Head><title>Disclaimer Financeiro — Financial Freedom</title></Head>
      <div className="min-h-screen" style={{background: 'var(--obsidian)'}}>
        <div className="fixed inset-0 hex-pattern opacity-10 pointer-events-none" />
        <header className="relative z-10 px-6 py-4" style={{borderBottom: '1px solid rgba(217,119,6,0.15)'}}>
          <Link href="/" className="text-sm flex items-center gap-2" style={{color: '#d97706'}}>
            ← Financial Freedom
          </Link>
        </header>
        <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
          <h1 className="font-display text-4xl font-bold text-gold-gradient mb-2">Disclaimer Financeiro</h1>
          <p className="text-sm mb-8" style={{color: 'var(--text-secondary)'}}>Última atualização: Janeiro de 2025</p>

          {[
            {
              title: '1. Natureza Informacional e Educacional',
              content: `A plataforma disponibilizada neste aplicativo constitui exclusivamente uma ferramenta digital de organização, análise e apresentação de informações financeiras de caráter informativo, educacional e organizacional.

Nenhum conteúdo disponibilizado nesta plataforma — incluindo dados, relatórios, gráficos, projeções, simulações, análises automatizadas, resultados gerados por algoritmos ou sistemas de inteligência artificial — constitui ou deve ser interpretado como: recomendação de investimento, consultoria financeira, assessoria de investimentos, aconselhamento financeiro profissional, indicação de compra ou venda de ativos, planejamento financeiro personalizado ou orientação para tomada de decisões financeiras.

A plataforma não possui autorização para prestar serviços de consultoria ou recomendação de investimentos, conforme regulamentações aplicáveis, incluindo as da Comissão de Valores Mobiliários (CVM).`
            },
            {
              title: '2. Responsabilidade pelas Decisões',
              content: `O usuário reconhece expressamente que todas as decisões financeiras são tomadas exclusivamente por sua própria iniciativa, que qualquer decisão de investimento envolve risco significativo de perdas financeiras, e que o uso desta plataforma não substitui aconselhamento profissional especializado.

Ao utilizar esta plataforma, o usuário concorda que é o único e exclusivo responsável por qualquer decisão financeira tomada com base nas informações apresentadas.`
            },
            {
              title: '3. Nenhuma Garantia de Resultados',
              content: `A plataforma não oferece qualquer garantia, expressa ou implícita, quanto à lucratividade, retorno financeiro, desempenho de investimentos, previsibilidade de resultados ou precisão de projeções.

Resultados passados, simulações ou estimativas não representam garantia de desempenho futuro.`
            },
            {
              title: '4. Possibilidade de Erros e Dados Desatualizados',
              content: `As informações exibidas podem conter erros técnicos, falhas de processamento, atrasos de atualização, inconsistências de dados, limitações algorítmicas e interpretações incorretas.

O usuário deve sempre verificar informações relevantes por meio de fontes independentes antes de tomar decisões financeiras.`
            },
            {
              title: '5. Aviso de Inteligência Artificial',
              content: `Esta plataforma utiliza sistemas automatizados, algoritmos e modelos de inteligência artificial para processar dados e gerar análises informacionais.

Esses sistemas podem produzir interpretações incorretas, conclusões imprecisas, resultados incompletos ou conter falhas técnicas. As respostas geradas por IA não substituem análise humana especializada nem aconselhamento profissional.`
            },
            {
              title: '6. Aviso de Afiliados',
              content: `Alguns conteúdos, serviços ou links disponibilizados nesta plataforma contêm links de afiliados. Caso o usuário adquira produtos por meio desses links, a plataforma poderá receber uma comissão comercial sem custo adicional ao usuário. A existência de programas de afiliados não implica endosso de qualquer investimento.`
            },
            {
              title: '7. Limitação de Responsabilidade',
              content: `Na máxima extensão permitida pela lei, os criadores, desenvolvedores e mantenedores da plataforma não serão responsáveis por perdas financeiras, prejuízos patrimoniais, decisões de investimento ou danos decorrentes do uso da plataforma.`
            },
          ].map(section => (
            <div key={section.title} className="mb-6">
              <h2 className="font-display text-lg font-bold mb-2" style={{color: '#d97706'}}>{section.title}</h2>
              <div className="disclaimer-box rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line"
                style={{color: 'var(--text-secondary)'}}>
                {section.content}
              </div>
            </div>
          ))}

          <div className="mt-8 p-4 rounded-xl text-center" style={{background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.2)'}}>
            <p className="text-sm font-semibold text-gold-gradient mb-1">Definição Segura do Produto</p>
            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
              "Plataforma digital de organização e visualização de informações financeiras para fins educacionais e informacionais."
            </p>
          </div>

          <div className="flex gap-4 mt-8 text-sm justify-center">
            <Link href="/terms" style={{color: '#d97706'}}>Termos de Uso</Link>
            <Link href="/privacy" style={{color: '#d97706'}}>Política de Privacidade</Link>
            <Link href="/" style={{color: '#d97706'}}>Início</Link>
          </div>
        </main>
        <footer className="relative z-10 py-4 text-center text-xs" style={{color: 'rgba(168,159,140,0.4)', borderTop: '1px solid rgba(217,119,6,0.1)'}}>
          Criado Por MaicknucleaR — @dubmariachi
        </footer>
      </div>
    </>
  )
}
