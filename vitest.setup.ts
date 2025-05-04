import { cleanup } from '@testing-library/react'
import { vi, afterEach } from 'vitest'

vi.mock('next/font/google', () => ({
  Roboto: () => ({
    className: 'mocked-roboto',
  }),
  JetBrains_Mono: () => ({
    className: 'mocked-jetbrain-mono',
  }),
}))

afterEach(cleanup)
