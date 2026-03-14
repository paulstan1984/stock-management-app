'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  onScan: (code: string) => void
}

export function BarcodeScanner({ onScan }: Props) {
  const [active, setActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null)

  // Must be called from a user gesture so mobile browsers show the
  // permission prompt instead of silently denying it.
  async function startCamera() {
    setError(null)
    const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode')

    const formatsToSupport = [
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.CODE_93,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
      Html5QrcodeSupportedFormats.ITF,
      Html5QrcodeSupportedFormats.CODABAR,
    ]

    const scanner = new Html5Qrcode('barcode-reader', { formatsToSupport, verbose: false })
    scannerRef.current = scanner

    try {
      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 15,
          // Wide and short box — ideal for horizontal barcodes
          qrbox: { width: 300, height: 100 },
        },
        (decoded: string) => {
          scanner.stop().catch(() => {})
          setActive(false)
          onScan(decoded)
        },
        () => {
          // ignore NotFoundException noise
        },
      )
      setActive(true)
    } catch {
      setError('Nu s-a putut accesa camera. Verificați că ați acordat permisiunea.')
    }
  }

  function stopCamera() {
    scannerRef.current?.stop().catch(() => {})
    setActive(false)
  }

  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => {})
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-3">
      <div id="barcode-reader" className="w-full max-w-sm" />

      {!active ? (
        <button
          onClick={startCamera}
          className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl"
        >
          Scanează cod de bare
        </button>
      ) : (
        <button
          onClick={stopCamera}
          className="w-full max-w-sm bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl"
        >
          Oprește camera
        </button>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  )
}
