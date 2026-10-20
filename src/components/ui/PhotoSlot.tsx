import { Image } from 'lucide-react'
import { Icon } from './Icon'

type PhotoSlotProps = {
  label: string
  className?: string
  // Moves the label (or a future <img>) with the parallax effect
  parallax?: boolean
}

// Placeholder photo frame. Put an <img> inside .slot later and it covers the label.
export const PhotoSlot = ({ label, className = '', parallax = false }: PhotoSlotProps) => (
  <div className={`slot ${className}`}>
    <span data-parallax={parallax || undefined}>
      <Icon icon={Image} size={14} />
      {label}
    </span>
  </div>
)
