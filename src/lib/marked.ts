import hljs from 'highlight.js'
import { Marked, Renderer } from 'marked'
import { markedHighlight } from 'marked-highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)

const render = new Renderer()
render.heading = (text, level) => {
  return `<h${level} class="toc-title" id=${text.replace(
    /\s/g,
    '',
  )}>${text}</h${level}>`
}

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

marked.setOptions({
  renderer: render,
})

export default marked
