import { describe, it, expect, beforeEach } from 'vitest'
import { urlParameters } from './URLParametersHandler'

describe('urlParameters', () => {
  const baseUrl = 'http://localhost/'

  beforeEach(() => {
    // Reset URL before each test
    const newUrl = new URL(baseUrl)
    window.history.pushState({}, '', newUrl)
  })

  it('should update a URL parameter', () => {
    urlParameters.update('theme', 'dark')
    expect(window.location.search).toContain('theme=dark')
  })

  it('should get a URL parameter', () => {
    window.history.pushState({}, '', `${baseUrl}?theme=dark`)
    expect(urlParameters.get('theme')).toBe('dark')
  })

  it('should return null for missing URL parameter', () => {
    window.history.pushState({}, '', baseUrl)
    expect(urlParameters.get('missing')).toBeNull()
  })

  it('should delete a URL parameter', () => {
    window.history.pushState({}, '', `${baseUrl}?theme=dark&lang=en`)
    urlParameters.delete('theme')
    expect(window.location.search).toBe('?lang=en')
  })
})
