import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Financial Freedom by MaicknucleaR — Plataforma educacional de organização e visualização de informações financeiras. Do salário mínimo ao primeiro milhão." />
        <meta name="keywords" content="educação financeira, investimentos, bitcoin, ações, planejamento financeiro" />
        <meta property="og:title" content="Financial Freedom by MaicknucleaR" />
        <meta property="og:description" content="Plataforma educacional de organização e visualização de informações financeiras." />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#050508" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>₿</text></svg>" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
