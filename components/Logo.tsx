import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-lg' },
    md: { container: 'w-12 h-12', text: 'text-xl' },
    lg: { container: 'w-16 h-16', text: 'text-2xl' },
  }

  const { container, text } = sizes[size]

  return (
    <Link href="/" className="flex items-center gap-2">
      <div className={`${container} bg-primary rounded-full flex items-center justify-center relative`}>
        {/* Logo placeholder - Replace with actual logo image */}
        <span className="font-bold text-text text-lg">FD</span>
        {/* 
          When you have the logo file, uncomment and use this:
          <Image 
            src="/logo.png" 
            alt="FD Delivery Logo" 
            fill 
            className="object-contain p-2"
          />
        */}
      </div>
      {showText && (
        <span className={`${text} font-bold text-text`}>Delivery</span>
      )}
    </Link>
  )
}
