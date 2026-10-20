import type { ComponentType } from 'react'

export type IconComponent = ComponentType<{
  size?: number
  strokeWidth?: number
  'aria-hidden'?: boolean
  className?: string
}>

// Lucide stroke tuned to match the template's Phosphor Light weight
export const ICON_STROKE = 1.25

type IconProps = {
  icon: IconComponent
  size: number
  className?: string
}

export const Icon = ({ icon: Glyph, size, className }: IconProps) => (
  <Glyph size={size} strokeWidth={ICON_STROKE} aria-hidden className={className} />
)
