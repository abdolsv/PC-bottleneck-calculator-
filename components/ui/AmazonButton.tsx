import { ShoppingCart, ExternalLink } from 'lucide-react'

interface Props {
  query: string
  className?: string
  label?: string
}

export function AmazonButton({ query, className = '', label = 'Check Price on Amazon' }: Props) {
  const tag = process.env.NEXT_PUBLIC_AMAZON_TAG

  if (!tag) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[AmazonButton] NEXT_PUBLIC_AMAZON_TAG is not set. ' +
        'Add it to your .env.local to enable affiliate links.'
      )
    }
    
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#f90] text-black font-bold rounded-[--radius-sm] hover:bg-[#e38800] transition-colors ${className}`}
      >
        <ExternalLink size={16} className="text-black" />
        {label}
      </a>
    )
  }

  const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${encodeURIComponent(tag)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#f90] text-black font-bold rounded-[--radius-sm] hover:bg-[#e38800] transition-colors shadow-[0_0_15px_rgba(255,153,0,0.3)] hover:shadow-[0_0_20px_rgba(255,153,0,0.5)] ${className}`}
    >
      <ShoppingCart size={18} className="text-black" />
      {label}
    </a>
  )
}
