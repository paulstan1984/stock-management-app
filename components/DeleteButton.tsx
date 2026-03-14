'use client'

interface Props {
  label?: string
}

export function DeleteButton({ label = 'Șterge' }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!confirm('Ești sigur? Această acțiune nu poate fi anulată.')) {
      e.preventDefault()
    }
  }

  return (
    <button
      type="submit"
      onClick={handleClick}
      className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
    >
      {label}
    </button>
  )
}
