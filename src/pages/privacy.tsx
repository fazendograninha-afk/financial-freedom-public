import Head from 'next/head'
import Link from 'next/link'

export default function Privacy() {
  return (
    <>
      <Head><title>Política de Privacidade — Financial Freedom</title></Head>
      <div className="min-h-screen" style={{background: 'var(--obsidian)'}}>
        <div className="fixed inset-0 hex-pattern opacity-10 pointer-events-none" />
        <header className="relative z-10 px-6 py-4" style={{borderBottom: '1px solid rgba(217,119,6,0.15)'}}>
          <Link href="/" className="text-sm" style={{color: '#d97706'}}>← Financial Freedom</Link>
        </header>
        <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
          <h1 className="font-display text-4xl font-bold text-gold-gradient mb-2">Política de Privacidade</h1>
          <p className="text-sm mb-2" style={{color: 'var(--text-secondary)'}}>Conforme a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018)</p>
          <p className="text-sm mb-8" style={{color: 'var(--text-secondary)'}}>Última atualização: Janeiro de 2025</p>

          {[
            { title: '1. Dados Coletados', content: 'Coletamos: endereço de e-mail (para criação de conta), senha criptografada (nunca armazenamos em texto plano), perfil financeiro informado (conservador, moderado, arrojado), objetivo declarado, e logs de acesso para segurança. NÃO coletamos: dados bancários, CPF, documentos pessoais ou informações de cartão.' },
            { title: '2. Finalidade do Tratamento', content: 'Seus dados são usados exclusivamente para: funcionamento da plataforma e autenticação, personalização da experiência educacional, melhoria contínua do serviço, e segurança da aplicação. Nunca vendemos ou compartilhamos seus dados com terceiros para fins comerciais.' },
            { title: '3. Base Legal (LGPD)', content: 'O tratamento de dados é fundamentado em: execução de contrato (prestação do serviço solicitado), legítimo interesse (segurança e melhoria do serviço), e consentimento explícito fornecido no momento do cadastro.' },
            { title: '4. Compartilhamento de Dados', content: 'Podemos compartilhar dados com: Supabase (provedor de banco de dados seguro), Groq (processamento de IA — apenas o conteúdo da conversa, sem dados pessoais identificáveis). Jamais compartilhamos com anunciantes ou para fins de marketing de terceiros.' },
            { title: '5. Retenção de Dados', content: 'Mantemos seus dados enquanto sua conta estiver ativa. As conversas com a IA NÃO são armazenadas — são processadas em tempo real e descartadas. Após exclusão da conta, dados são removidos em até 30 dias.' },
            { title: '6. Seus Direitos (LGPD)', content: 'Você tem direito a: acessar seus dados pessoais, corrigir dados incorretos, solicitar exclusão da conta e dados, portabilidade dos dados, revogar consentimento, e peticionar à Autoridade Nacional de Proteção de Dados (ANPD). Para exercer seus direitos, entre em contato via perfil @dubmariachi.' },
            { title: '7. Segurança', content: 'Adotamos medidas de segurança como: criptografia de senhas, conexões HTTPS, controle de acesso por autenticação JWT, e monitoramento de tentativas de acesso indevido. Nenhum sistema é 100% seguro, mas nos comprometemos com as melhores práticas.' },
            { title: '8. Cookies e Rastreamento', content: 'Utilizamos apenas cookies essenciais para manter sua sessão autenticada. Não utilizamos cookies de rastreamento publicitário ou análise comportamental de terceiros.' },
            { title: '9. Contato do Controlador', content: 'Responsável pelo tratamento de dados: MaicknucleaR. Contato: @dubmariachi (Instagram). Para solicitações relacionadas à LGPD, envie mensagem direta.' },
          ].map(s => (
            <div key={s.title} className="mb-5">
              <h2 className="font-semibold mb-2" style={{color: '#d97706'}}>{s.title}</h2>
              <p className="text-sm leading-relaxed" style={{color: 'var(--text-secondary)'}}>{s.content}</p>
            </div>
          ))}

          <div className="flex gap-4 mt-8 text-sm justify-center">
            <Link href="/disclaimer" style={{color: '#d97706'}}>Disclaimer</Link>
            <Link href="/terms" style={{color: '#d97706'}}>Termos de Uso</Link>
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
