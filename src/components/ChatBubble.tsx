interface ChatBubbleProps {
  role: 'user' | 'assistant'
  content: string
  agentAvatar?: string
  agentColor?: string
  tokens?: number
}

export default function ChatBubble({ role, content, agentAvatar, agentColor, tokens }: ChatBubbleProps) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'assistant' && agentAvatar && (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg mr-2 flex-shrink-0 mt-1"
          style={{
            background: `${agentColor}20`,
            border: `1px solid ${agentColor}30`
          }}
        >
          {agentAvatar}
        </div>
      )}
      <div className="max-w-[80%]">
        <div
          className={`px-4 py-3 text-sm leading-relaxed ${role === 'user' ? 'chat-user' : 'chat-ai'}`}
          style={{color: 'var(--text-primary)', whiteSpace: 'pre-wrap'}}
        >
          {content}
        </div>
        {tokens !== undefined && tokens > 0 && (
          <p className="text-right text-xs mt-1 pr-1" style={{color: 'rgba(168,159,140,0.4)'}}>
            ~{tokens} tokens
          </p>
        )}
      </div>
    </div>
  )
}

export function TypingIndicator({ agentAvatar, agentColor }: { agentAvatar: string, agentColor: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
        style={{background: `${agentColor}20`, border: `1px solid ${agentColor}30`}}
      >
        {agentAvatar}
      </div>
      <div className="chat-ai px-4 py-3 flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="typing-dot w-2 h-2 rounded-full"
            style={{background: '#d97706', animationDelay: `${i * 0.2}s`}}
          />
        ))}
      </div>
    </div>
  )
}
