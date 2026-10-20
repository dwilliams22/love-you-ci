import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router'
import { CircleUser, Menu, X } from 'lucide-react'
import { navItems } from '../../config/nav'
import { Icon } from '../ui/Icon'
import { Wordmark } from '../ui/Wordmark'

// TODO: wire Log In to Wix Members hosted login
const handleLogin = () => {}

export const SiteHeader = () => {
  const [open, setOpen] = useState(false)
  const menuBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuBtn.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="sticky top-0 z-30 border-b border-(--hair) bg-[rgba(251,250,250,0.9)] backdrop-blur-[12px]">
      <div className="wrap flex h-(--bar) items-center gap-8">
        <Wordmark />
        <nav
          id="site-nav"
          aria-label="Main"
          className={`nav ${open ? 'open' : ''}`}
          onClick={(e) => (e.target as HTMLElement).closest('a, button') && setOpen(false)}
        >
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav-link">
              {item.label}
            </NavLink>
          ))}
          <button type="button" className="nav-link login-m" onClick={handleLogin}>
            <Icon icon={CircleUser} size={20} />
            Log In
          </button>
        </nav>
        <button type="button" className="login" onClick={handleLogin}>
          <Icon icon={CircleUser} size={18} />
          Log In
        </button>
        <button
          ref={menuBtn}
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          <Icon icon={open ? X : Menu} size={24} />
        </button>
      </div>
    </header>
  )
}
