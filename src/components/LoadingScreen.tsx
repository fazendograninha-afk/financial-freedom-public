export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--obsidian)'}}>
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
          style={{
            background: 'linear-gradient(135deg, #d97706, #92400e)',
            boxShadow: '0 0 30px rgba(217,119,6,0.3)'
          }}
        >
          ₿
        </div>
        <div className="flex gap-1.5 justify-center">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="typing-dot w-2 h-2 rounded-full"
              style={{background: '#d97706', animationDelay: `${i * 0.2}s`}}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
