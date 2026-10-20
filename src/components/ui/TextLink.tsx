import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { Icon } from './Icon'

type TextLinkProps = {
  to: string
  children: ReactNode
}

export const TextLink = ({ to, children }: TextLinkProps) => (
  <Link to={to} className="text-link">
    {children} <Icon icon={ChevronRight} size={15} />
  </Link>
)
