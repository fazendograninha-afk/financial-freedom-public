import Head from 'next/head'
import Link from 'next/link'

export default function Terms() {
  return (
    <>
      <Head><title>Termos de Uso — Financial Freedom</title></Head>
      <div className="min-h-screen" style={{background: 'var(--obsidian)'}}>
        <div className="fixed inset-0 hex-pattern opacity-10 pointer-events-none" />
        <header className="relative z-10 px-6 py-4" style={{borderBottom: '1px solid rgba(217,119,6,0.15)'}}>
          <Link href="/" className="text-sm" style={{color: '#d97706'}}>← Financial Freedom</Link>
        </header>
        <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
          <h1 className="font-display text-4xl font-bold text-gold-gradient mb-2">Termos de Uso</h1>
          <p className="text-sm mb-8" style={{color: 'var(--text-secondary)'}}>Última atualização: Janeiro de 2025</p>

          {[
            { title: '1. Definições', content: 'Plataforma: sistema digital Financial Freedom by MaicknucleaR. Usuário: pessoa que acessa e utiliza a plataforma. Serviço: conjunto de ferramentas educacionais e informacionais disponibilizadas. Conteúdo: textos, análises, simulações e dados gerados pela plataforma ou por IA.' },
            { title: '2. Aceitação dos Termos', content: 'Ao criar uma conta e utilizar o serviço, o usuário declara que leu, compreendeu e concorda integralmente com estes Termos de Uso, o Disclaimer Financeiro e a Política de Privacidade. Usuários menores de 18 anos devem ter autorização dos responsáveis.' },
            { title: '3. Natureza do Serviço', content: 'A plataforma é uma ferramenta digital de organização, análise e visualização de informações financeiras para fins educacionais e informacionais. Ela NÃO fornece aconselhamento financeiro, consultoria de investimentos ou recomendação de compra ou venda de ativos.' },
            { title: '4. Cadastro e Responsabilidade do Usuário', content: 'O usuário é responsável por manter suas credenciais seguras, fornecer informações corretas e veídicas, e pelo uso exclusivo de sua própria conta. O compartilhamento de credenciais é vedado.' },
            { title: '5. Uso Permitido e Proibido', content: 'É permitido: usar a plataforma para fins educacionais e informacionais pessoais. É proibido: usar para fraude, manipular dados, explorar falhas técnicas, tentar obter acesso não autorizado, usar para fins comerciais sem autorização, ou criar conteúdo que viole leis.' },
            { title: '6. Propriedade Intelectual', content: 'Todo o software, design, algoritmos, textos e elementos visuais da plataforma pertencem a MaicknucleaR. É vedada a reprodução, cópia ou distribuição sem autorização expressa.' },
            { title: '7. Limitação de Responsabilidade', content: 'Conforme especificado no Disclaimer Financeiro, os responsáveis pela plataforma não se responsabilizam por perdas financeiras, decisões de investimento ou quaisquer danos decorrentes do uso da plataforma.' },
            { title: '8. Encerramento de Conta', content: 'A plataforma pode suspender ou encerrar contas que violem estes Termos, sem aviso prévio. O usuário pode solicitar exclusão de sua conta a qualquer momento.' },
            { title: '9. Modificações', content: 'Estes Termos podem ser alterados a qualquer momento. O uso continuado da plataforma após alterações constitui aceitação dos novos termos.' },
            { title: '10. Lei Aplicável', content: 'Estes Termos são regidos pela legislação da República Federativa do Brasil. Fica eleito o foro da comarca de domicílio do usuário para dirimir quaisquer controvérsias.' },
          ].map(s => (
            <div key={s.title} className="mb-5">
              <h2 className="font-semibold mb-2" style={{color: '#d97706'}}>{s.title}</h2>
              <p className="text-sm leading-relaxed" style={{color: 'var(--text-secondary)'}}>{s.content}</p>
            </div>
          ))}

          <div className="flex gap-4 mt-8 text-sm justify-center">
            <Link href="/disclaimer" style={{color: '#d97706'}}>Disclaimer</Link>
            <Link href="/privacy" style={{color: '#d97706'}}>Privacidade</Link>
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
