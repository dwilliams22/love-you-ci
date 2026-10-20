import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { Icon } from './Icon'

type CtaProps = {
  to: string
  children: ReactNode
  light?: boolean
  className?: string
  style?: CSSProperties
}

export const Cta = ({ to, children, light = false, className = '', style }: CtaProps) => (
  <Link to={to} className={`cta ${light ? 'light' : ''} ${className}`} style={style}>
    {children} <Icon icon={ChevronRight} size={16} />
  </Link>
)
