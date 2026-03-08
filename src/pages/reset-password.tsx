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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleReset = async () => {
    if (password.length < 6) return toast.error("Senha deve ter ao menos 6 caracteres")
    if (password !== confirm) return toast.error("As senhas nao coincidem")
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success("Senha atualizada! Redirecionando...")
    setTimeout(() => router.push("/"), 2000)
  }

  return (
    <>
      <Head><title>Redefinir Senha — Financial Freedom</title></Head>
      <div className="min-h-screen flex items-center justify-center px-4" style={{background:"linear-gradient(135deg,#0a0a0a 0%,#1a1209 50%,#0d0d0d 100%)"}}>
        <div className="w-full max-w-md p-8 rounded-2xl border" style={{background:"rgba(26,18,9,0.95)",borderColor:"rgba(217,119,6,0.3)"}}>
          <h1 className="text-2xl font-bold text-center mb-2" style={{color:"#d97706"}}>🔑 Nova Senha</h1>
          <p className="text-center text-sm mb-6" style={{color:"rgba(168,159,140,0.7)"}}>Digite sua nova senha abaixo</p>
          {!ready ? (
            <p className="text-center text-sm" style={{color:"rgba(168,159,140,0.6)"}}>Aguardando verificacao do link...</p>
          ) : (
            <div className="space-y-4">
              <input type="password" placeholder="Nova senha (min. 6 caracteres)" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{background:"rgba(255,255,255,0.05)",borderColor:"rgba(217,119,6,0.3)",color:"#e8dcc8"}} />
              <input type="password" placeholder="Confirmar nova senha" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{background:"rgba(255,255,255,0.05)",borderColor:"rgba(217,119,6,0.3)",color:"#e8dcc8"}} />
              <button onClick={handleReset} disabled={loading} className="w-full py-3 rounded-xl font-bold text-sm" style={{background:loading?"rgba(217,119,6,0.4)":"linear-gradient(135deg,#d97706,#b45309)",color:"#fff"}}>{loading?"Atualizando...":"Atualizar Senha"}</button>
            </div>
          )}
          <p className="text-center text-xs mt-6"><a href="/" style={{color:"#d97706"}} className="hover:underline">← Voltar ao login</a></p>
        </div>
      </div>
    </>
  )
}
