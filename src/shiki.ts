import { getSingletonHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import getWasm from 'shiki/wasm'

export const shikiOptions = {
  themes: [
    import('shiki/themes/vitesse-dark.mjs'),
    import('shiki/themes/vitesse-light.mjs'),
  ],
  engine: createOnigurumaEngine(getWasm),
  langs: [
    import('shiki/langs/js.mjs'),
    import('shiki/langs/jsx.mjs'),
    import('shiki/langs/tsx.mjs'),
    import('shiki/langs/ts.mjs'),
    import('shiki/langs/css.mjs'),
    import('shiki/langs/rust.mjs'),
    import('shiki/langs/vue.mjs'),
    import('shiki/langs/json.mjs'),
    import('shiki/langs/json5.mjs'),
    import('shiki/langs/yaml.mjs'),
    import('shiki/langs/go.mjs'),
    import('shiki/langs/html.mjs'),
    import('shiki/langs/html-derivative.mjs'),
    import('shiki/langs/vue-html.mjs'),
    import('shiki/langs/markdown.mjs'),
    import('shiki/langs/xml.mjs'),
    import('shiki/langs/regex.mjs'),
    import('shiki/langs/less.mjs'),
    import('shiki/langs/shell.mjs'),
    import('shiki/langs/bash.mjs'),
    import('shiki/langs/git-commit.mjs'),
    import('shiki/langs/git-rebase.mjs'),
    import('shiki/langs/regexp.mjs'),
  ],
}

export function getShiki() {
  return getSingletonHighlighterCore(shikiOptions)
}
