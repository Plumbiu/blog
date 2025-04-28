import { cleanup } from '@testing-library/react'
import { vi, afterEach } from 'vitest'

vi.mock('next/font/google', () => ({
  Roboto: () => ({
    style: {
      fontFamily: 'mocked-roboto',
      className: 'mocked-roboto',
    },
  }),
  JetBrains_Mono: () => ({
    style: {
      fontFamily: 'mocked-jetbrain-mono',
      className: 'mocked-jetbrain-mono',
    },
  }),
}))

afterEach(cleanup)
