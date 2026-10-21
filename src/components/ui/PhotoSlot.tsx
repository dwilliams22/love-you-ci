import { Image } from 'lucide-react'
import { Icon } from './Icon'

type Photo = {
  src: string
  alt: string
  width: number
  height: number
  // The hero photo is the LCP image, so it loads eagerly at high priority
  priority?: boolean
}

type PhotoSlotProps = {
  label: string
  className?: string
  // Moves the placeholder label with the parallax effect. A photo always shows whole, so it stays still.
  parallax?: boolean
  photo?: Photo
}

// Photo frame. Shows the placeholder label until a photo is given; the photo covers the frame.
export const PhotoSlot = ({ label, className = '', parallax = false, photo }: PhotoSlotProps) => (
  <div className={`slot ${className}`}>
    {photo ? (
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={photo.priority ? 'eager' : 'lazy'}
        fetchPriority={photo.priority ? 'high' : undefined}
        decoding="async"
      />
    ) : (
      <span data-parallax={parallax || undefined}>
        <Icon icon={Image} size={14} />
        {label}
      </span>
    )}
  </div>
)
