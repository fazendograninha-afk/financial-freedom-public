# 🚀 Financial Freedom by MaicknucleaR

> Plataforma educacional de organização e visualização de informações financeiras.  
> As mentalidades dos maiores investidores do mundo, acessíveis a todos.

**@dubmariachi** | Versão Beta

---

## ✨ Features

- 🧠 **15+ Agentes de IA** baseados nas filosofias de Warren Buffett, Ray Dalio, Michael Saylor, George Soros, Jim Simons e mais
- 🎯 **Sistema de Níveis** — Do salário mínimo ao primeiro milhão
- 📊 **Análise de Perfil** — Conservador, Moderado, Arrojado
- 💬 **Chat com Especialistas** — IA treinada nas filosofias dos maiores investidores
- 📄 **Exportar PDF** — Salve suas conversas e insights
- 🔐 **Autenticação Segura** via Supabase
- ⚖️ **100% Compliance** — Disclaimer robusto, LGPD, sem recomendações de investimento
- 🌙 **Dark Luxury Atomic** — Visual exclusivo

---

## 🛠️ Stack Técnica

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Banco de Dados / Auth**: Supabase (gratuito)
- **IA**: Groq API com Llama 3.1 70B (gratuito)
- **Deploy**: Vercel (gratuito)
- **PDF Export**: jsPDF

---

## 🚀 Deploy Gratuito — Passo a Passo

### 1. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Crie um novo projeto
3. Vá em **SQL Editor** e execute:

```sql
-- Tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  financial_profile TEXT DEFAULT 'conservador',
  level TEXT DEFAULT 'iniciante',
  objective TEXT,
  PRIMARY KEY (id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

4. Pegue as chaves em **Settings > API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Obter Chave Groq (Gratuita)

1. Acesse [console.groq.com](https://console.groq.com)
2. Crie uma conta gratuita
3. Gere uma API Key
4. Salve como `GROQ_API_KEY`

### 3. Subir para GitHub

```bash
cd financialfreedom-saas
git init
git add .
git commit -m "Initial commit — Financial Freedom by MaicknucleaR"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/financialfreedom-saas.git
git push -u origin main
```

### 4. Deploy no Railway (Gratuito)

1. Acesse [railway.app](https://railway.app) e crie uma conta gratuita (login com GitHub)
2. Clique em **"New Project" → "Deploy from GitHub repo"**
3. Selecione o repositório `financial-freedom`
4. Clique em **"Add Variables"** e adicione:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
GROQ_API_KEY=sua_chave_groq_aqui
PORT=3003
```

5. Vá em **Settings → Networking → Generate Domain**
6. Aguarde ~3 minutos — seu site estará em: `https://financial-freedom-XXXX.up.railway.app`

> 💡 **Dica Railway**: O plano gratuito oferece $5/mês de crédito, suficiente para um projeto leve como este. Monitore em **Settings → Usage**.

### 5. Rodar Localmente (porta 3003)

```bash
# Copie o .env de exemplo
cp .env.local.example .env.local

# Edite .env.local com suas chaves reais

# Instale dependências
npm install

# Rode
npm run dev
# Acesse: http://localhost:3003
```

---

## 📁 Estrutura do Projeto

```
financial-freedom/
├── src/
│   ├── agents/
│   │   └── agents.ts          # 15 agentes com system prompts
│   ├── lib/
│   │   └── supabase.ts        # Cliente Supabase
│   ├── pages/
│   │   ├── index.tsx          # Landing + Login + Registro
│   │   ├── onboarding.tsx     # Quiz de perfil
│   │   ├── dashboard.tsx      # Dashboard + Chat
│   │   ├── disclaimer.tsx     # Disclaimer financeiro completo
│   │   ├── terms.tsx          # Termos de uso
│   │   ├── privacy.tsx        # Política de privacidade (LGPD)
│   │   ├── api/
│   │   │   └── chat.ts        # API route Groq
│   │   ├── _app.tsx
│   │   └── _document.tsx
│   └── styles/
│       └── globals.css        # Dark luxury atomic theme
├── .env.local.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## ⚠️ Aviso Legal

Esta plataforma é uma ferramenta de organização e visualização de informações financeiras para fins **exclusivamente educacionais e informacionais**.

Não constitui consultoria financeira, recomendação de investimento ou assessoria de qualquer natureza.

---

## 🔗 Links Importantes

- 🏆 [ORYON Mesas Proprietárias](https://hotmart.com/pt-br/marketplace/produtos/oryon-mesas-proprietarias/G102265023L?ref=F104360614F) *(link de afiliado)*
- 📸 Instagram: [@dubmariachi](https://instagram.com/dubmariachi)

---

*Criado Por MaicknucleaR — @dubmariachi*
