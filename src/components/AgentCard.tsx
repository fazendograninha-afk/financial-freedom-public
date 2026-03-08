import { Agent } from '../agents/agents'

interface AgentCardProps {
  agent: Agent
  onClick: () => void
  recommended?: boolean
}

export default function AgentCard({ agent, onClick, recommended }: AgentCardProps) {
  return (
    <button
      onClick={onClick}
      className="border-gold-glow rounded-xl p-5 text-left transition-all hover:scale-[1.02] group w-full"
      style={{background: 'rgba(10,10,15,0.7)', position: 'relative', overflow: 'hidden'}}
    >
      {recommended && (
        <div className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full"
          style={{background: 'rgba(217,119,6,0.2)', color: '#d97706', border: '1px solid rgba(217,119,6,0.3)'}}>
          ★ Ideal
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{background: `${agent.color}15`, border: `1px solid ${agent.color}40`}}>
          {agent.avatar}
        </div>
        <div>
          <h4 className="font-semibold text-sm" style={{color: 'var(--text-primary)'}}>{agent.name}</h4>
          <p className="text-xs" style={{color: agent.color}}>{agent.role}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed" style={{color: 'var(--text-secondary)'}}>{agent.specialty}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {agent.bestFor.slice(0, 3).map((tag: string) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(217,119,6,0.08)',
              color: 'rgba(217,119,6,0.7)',
              border: '1px solid rgba(217,119,6,0.15)'
            }}>
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}
