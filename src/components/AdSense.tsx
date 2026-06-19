import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

interface AdSenseProps {
  slot?: string
  format?: string
  className?: string
}

export function AdSense({ slot = 'xxxxxxxxxx', format = 'auto', className = '' }: AdSenseProps) {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch {}
  }, [])

  return (
    <div className={`ads-container my-2 text-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {/* Placeholder visible en dev */}
      <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-lg p-4 text-xs text-gray-400 text-center">
        📊 Google AdSense — Remplacer par votre code pub
      </div>
    </div>
  )
}
