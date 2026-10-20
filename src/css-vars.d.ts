import 'react'

// Allow CSS custom properties (e.g. style={{ '--i': 1 }}) in inline styles
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}
