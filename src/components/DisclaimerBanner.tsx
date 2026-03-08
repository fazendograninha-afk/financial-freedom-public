export const DISCLAIMER_SHORT = `Esta plataforma é uma ferramenta digital de organização e visualização de informações financeiras para fins exclusivamente educacionais e informacionais. Não constitui consultoria financeira, recomendação de investimento ou assessoria de qualquer natureza. Toda decisão financeira é de exclusiva responsabilidade do usuário.`

export const DISCLAIMER_MINI = `⚠️ Ferramenta educacional e informacional. Não constitui consultoria ou recomendação de investimento. Decisões financeiras são de sua exclusiva responsabilidade.`

export function DisclaimerBanner({ mini = false }: { mini?: boolean }) {
  return (
    <div className="disclaimer-box rounded-lg p-3 text-xs leading-relaxed" style={{color: 'var(--text-secondary)'}}>
      {mini ? DISCLAIMER_MINI : `⚠️ ${DISCLAIMER_SHORT}`}
    </div>
  )
}

export function DisclaimerChatBar() {
  return (
    <div className="disclaimer-box rounded px-3 py-1.5 text-xs" style={{color: 'rgba(168,159,140,0.7)'}}>
      ⚠️ Conteúdo educacional e informacional. Não constitui recomendação de investimento. Mensagens apagadas ao fechar.
    </div>
  )
}
