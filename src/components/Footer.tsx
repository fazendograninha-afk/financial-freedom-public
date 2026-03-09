export default function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="relative z-10 py-6 px-6 text-center" style={{borderTop: '1px solid rgba(217,119,6,0.1)'}}>
      {!compact && (
        <div className="max-w-4xl mx-auto mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <a href="/disclaimer" className="hover:underline" style={{color: '#d97706'}}>Disclaimer Financeiro</a>
          <a href="/terms" className="hover:underline" style={{color: '#d97706'}}>Termos de Uso</a>
          <a href="/privacy" className="hover:underline" style={{color: '#d97706'}}>Política de Privacidade</a>
          <a href="/about" className="hover:underline" style={{color: '#d97706'}}>Sobre</a>
        </div>
      )}
      <p className="text-xs" style={{color: 'var(--text-secondary)'}}>
        ⚠️ Plataforma educacional. Não constitui consultoria financeira.
      </p>
      <p className="text-xs mt-1" style={{color: '#ffffff'}}>
        Criado Por{' '}
        <a href="https://maicknuclear.wixsite.com/online" target="_blank" rel="noopener noreferrer"
          className="hover:underline font-semibold" style={{color: '#ffffff'}}>MaicknucleaR</a>
        {' '}—{' '}
        <a href="https://instagram.com/dubmariachi" target="_blank" rel="noopener noreferrer"
          className="hover:underline" style={{color: '#d97706'}}>@dubmariachi</a>
      </p>
    </footer>
  )
}
