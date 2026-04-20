'use client'
import { useState } from 'react'

export default function PhotoGallery({ photos, titre }: { photos: string[], titre: string }) {
  const [active, setActive] = useState(0)

  return (
    <div>
      <img
        src={photos[active]}
        alt={titre}
        className="w-full object-cover"
        style={{ maxHeight: '400px', borderBottom: '1px solid var(--chr-border)' }}
      />
      {photos.length > 1 && (
        <div
          className="flex gap-2 p-3"
          style={{ borderBottom: '1px solid var(--chr-border)', background: 'var(--chr-bg)' }}
        >
          {photos.map((url: string, i: number) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className="rounded-lg overflow-hidden"
              style={{
                border: i === active ? '2px solid var(--chr-btn)' : '1px solid var(--chr-border)',
                padding: 0,
                background: 'none',
                cursor: 'pointer',
              }}
            >
              <img src={url} alt={`Photo ${i + 1}`} className="w-20 h-20 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}