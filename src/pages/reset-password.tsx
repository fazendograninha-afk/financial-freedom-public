import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/router"
import toast from "react-hot-toast"
import Head from "next/head"

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Pega o token da URL (hash ou query)
    const hash = window.location.hash
    const params = new URLSearchParams(hash.replace("#", "?"))
    const accessToken = params.get("access_token")
    const type = params.get("type")

    if (accessToken && type === "recovery") {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: params.get("refresh_token") || ""
      }).then(({ error }) => {
        if (error) {
          toast.error("Link invalido ou expirado")
          router.push("/")
        } else {
          setReady(true)
        }
        setChecking(false)
      })
    } else {
      // Tenta via onAuthStateChange tambem
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setReady(true)
          setChecking(false)
        }
      })
      setTimeout(() => {
        setChecking(false)
      }, 3000)
      return () => subscription.unsubscribe()
    }
  }, [])

  const handleReset = async () => {
    if (password.length < 6) return toast.error("Minimo 6 caracteres")
    if (password !== confirm) return toast.error("Senhas nao coincidem")
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success("Senha atualizada com sucesso!")
    setTimeout(() => router.push("/"), 2000)
  }

  return (
    <>
      <Head><title>Nova Senha — Financial Freedom</title></Head>
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{background:"linear-gradient(135deg,#0a0a0a 0%,#1a1209 50%,#0d0d0d 100%)"}}>
        <div className="w-full max-w-md p-8 rounded-2xl border"
          style={{background:"rgba(26,18,9,0.95)",borderColor:"rgba(217,119,6,0.3)"}}>

          <h1 className="text-2xl font-bold text-center mb-2" style={{color:"#d97706"}}>
            Redefinir Senha
          </h1>

          {checking && (
            <p className="text-center text-sm mt-4" style={{color:"rgba(168,159,140,0.7)"}}>
              Verificando link...
            </p>
          )}

          {!checking && !ready && (
            <div className="text-center mt-4">
              <p className="text-sm mb-4" style={{color:"rgba(168,159,140,0.7)"}}>
                Link invalido ou expirado. Solicite um novo.
              </p>
              <button onClick={() => router.push("/")}
                className="px-6 py-2 rounded-xl text-sm font-bold"
                style={{background:"linear-gradient(135deg,#d97706,#b45309)",color:"#fff"}}>
                Voltar ao login
              </button>
            </div>
          )}

          {!checking && ready && (
            <div className="space-y-4 mt-6">
              <input
                type="password"
                placeholder="Nova senha (min. 6 caracteres)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{background:"rgba(255,255,255,0.05)",borderColor:"rgba(217,119,6,0.3)",color:"#e8dcc8"}}
              />
              <input
                type="password"
                placeholder="Confirmar nova senha"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{background:"rgba(255,255,255,0.05)",borderColor:"rgba(217,119,6,0.3)",color:"#e8dcc8"}}
              />
              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm"
                style={{background:loading?"rgba(217,119,6,0.4)":"linear-gradient(135deg,#d97706,#b45309)",color:"#fff"}}>
                {loading ? "Atualizando..." : "Salvar nova senha"}
              </button>
            </div>
          )}

          <p className="text-center text-xs mt-6">
            <a href="/" style={{color:"#d97706"}} className="hover:underline">
              Voltar ao login
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
