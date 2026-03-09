import { useState, useEffect } from 'react'

interface CoinData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
}

const COINS = ['bitcoin', 'ripple', 'ethereum', 'solana']

export default function CryptoBar() {
  const [coins, setCoins] = useState<CoinData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchPrices = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.join(',')}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`,
        { headers: { 'Accept': 'application/json' } }
      )
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setCoins(data)
      setLastUpdate(new Date())
      setError(false)
    } catch (e) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // atualiza a cada 60s
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    if (price >= 1) return `$${price.toFixed(2)}`
    return `$${price.toFixed(4)}`
  }

  const formatMarketCap = (mc: number) => {
    if (mc >= 1e12) return `$${(mc / 1e12).toFixed(2)}T`
    if (mc >= 1e9)  return `$${(mc / 1e9).toFixed(1)}B`
    return `$${(mc / 1e6).toFixed(0)}M`
  }

  const SYMBOLS: Record<string, string> = {
    bitcoin: '₿',
    ripple: '✕',
    ethereum: 'Ξ',
    solana: '◎',
  }

  if (error) return null // silently fail — não quebra o layout

  return (
    <div className="relative z-30 overflow-hidden"
      style={{
        background: 'rgba(5,5,8,0.95)',
        borderBottom: '1px solid rgba(217,119,6,0.12)',
        backdropFilter: 'blur(10px)',
      }}>
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
        
        {/* Label */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background: '#16a34a'}} />
          <span className="text-xs font-medium" style={{color: 'rgba(168,159,140,0.6)'}}>
            Mercado
          </span>
        </div>

        {/* Coins */}
        <div className="flex items-center gap-6 flex-1 overflow-x-auto">
          {loading ? (
            <div className="flex gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-16 h-3 rounded animate-pulse" style={{background: 'rgba(217,119,6,0.15)'}} />
                </div>
              ))}
            </div>
          ) : (
            coins.map(coin => {
              const isPositive = coin.price_change_percentage_24h >= 0
              const changeColor = isPositive ? '#16a34a' : '#dc2626'
              const changeBg = isPositive ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)'

              return (
                <div key={coin.id} className="flex items-center gap-2 flex-shrink-0">
                  {/* Symbol */}
                  <span className="text-sm font-bold" style={{color: '#d97706'}}>
                    {SYMBOLS[coin.id] || coin.symbol.toUpperCase()}
                  </span>
                  {/* Name */}
                  <span className="text-xs font-medium hidden md:block" style={{color: 'rgba(249,250,251,0.7)'}}>
                    {coin.symbol.toUpperCase()}
                  </span>
                  {/* Price */}
                  <span className="text-xs font-bold" style={{color: '#f9fafb'}}>
                    {formatPrice(coin.current_price)}
                  </span>
                  {/* Change */}
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded"
                    style={{color: changeColor, background: changeBg}}>
                    {isPositive ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </span>
                  {/* Market Cap — só desktop */}
                  <span className="text-xs hidden lg:block" style={{color: 'rgba(168,159,140,0.5)'}}>
                    {formatMarketCap(coin.market_cap)}
                  </span>
                </div>
              )
            })
          )}
        </div>

        {/* Last update + refresh */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {lastUpdate && (
            <span className="text-xs hidden md:block" style={{color: 'rgba(168,159,140,0.4)'}}>
              {lastUpdate.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
            </span>
          )}
          <button onClick={fetchPrices}
            className="text-xs px-2 py-0.5 rounded transition-colors"
            style={{color: 'rgba(217,119,6,0.6)', border: '1px solid rgba(217,119,6,0.15)'}}>
            ↻
          </button>
          <span className="text-xs" style={{color: 'rgba(168,159,140,0.3)'}}>
            CoinGecko
          </span>
        </div>
      </div>
    </div>
  )
}
