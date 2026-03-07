import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0a0a0f',
            color: '#f5f0e8',
            border: '1px solid rgba(217, 119, 6, 0.3)',
            fontFamily: 'DM Sans, system-ui, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#d97706',
              secondary: '#0a0a0f',
            },
          },
        }}
      />
    </>
  )
}
