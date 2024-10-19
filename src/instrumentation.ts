import { getShiki as initShiki } from './shiki'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Aim to init shiki in the nodejs at fisrt, instead of visit the posts/[...id] route
    await initShiki()
  }
}
