'use client'

import { useEffect, useRef } from 'react'

interface Props {
  onScan: (code: string) => void
}

export function BarcodeScanner({ onScan }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<{ clear: () => Promise<void> } | null>(null)

  useEffect(() => {
    let mounted = true

    import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
      if (!mounted || !containerRef.current) return

      const scanner = new Html5QrcodeScanner(
        'barcode-reader',
        { fps: 10, qrbox: { width: 260, height: 140 } },
        /* verbose= */ false,
      )

      scanner.render(
        (decoded: string) => {
          // pause after first successful scan
          scanner.pause(true)
          onScan(decoded)
        },
        () => {
          // ignore NotFoundException noise
        },
      )

      scannerRef.current = scanner
    })

    return () => {
      mounted = false
      scannerRef.current?.clear().catch(() => {})
    }
  }, [onScan])

  return (
    <div>
      <div id="barcode-reader" ref={containerRef} />
    </div>
  )
}
