export type NavItem = {
  label: string
  to: string
}

export const navItems: NavItem[] = [
  { label: 'About Ci', to: '/about' },
  { label: 'Book Appointment', to: '/book' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Contact Ci', to: '/contact' },
  { label: 'Shop Our Products', to: '/shop' },
]

export const socialLinks = {
  instagram: 'https://www.instagram.com/loveyouci',
  youtube: 'https://www.youtube.com/c/CiaraLatrice/featured',
}
