import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => cleanup())

// jsdom lacks these browser APIs
type IOCallback = (entries: Partial<IntersectionObserverEntry>[]) => void

export class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IOCallback
  targets: Element[] = []
  constructor(callback: IOCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }
  observe(el: Element) {
    this.targets.push(el)
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
vi.stubGlobal('matchMedia', (query: string) => ({
  matches: false,
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
}))
vi.stubGlobal('CSS', { supports: () => true })
Element.prototype.scrollBy = vi.fn()
// jsdom has <dialog> but not its modal API
HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
  this.setAttribute('open', '')
}
HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
  this.removeAttribute('open')
}
window.scrollTo = vi.fn()
