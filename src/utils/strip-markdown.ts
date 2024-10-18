const HeaderRegx = /\n={2,}/g
const BlockRegx = /~{3}.*\n|`{3}.*\n/g
const StrikethroughRegx = /~~/g
const abbreviationsRegx = /\*\[.*\]:.*\n/
const HTMLRegx = /<[^>]*>/g
const StyleHeaders = /^[=\-]{2,}\s*$/g
const FootNotes = /\[\^.+?\](\: .*?$)?/g
const ImageRegx = /\!\[(.*?)\][\[\(].*?[\]\)]/g
const InlineLinkRegx = /\[([^\]]*?)\][\[\(].*?[\]\)]/g
const BlockQuotes = /^(\n)?\s{0,3}>\s?/gm
const ReferenceStyleRegx = /^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g
const AtxStyleRegx =
  /^(\n)?\s{0,}#{1,6}\s*( (.+))? +#+$|^(\n)?\s{0,}#{1,6}\s*( (.+))?$/gm
const InlineCodeRegx = /`(.+?)`/g
const LinkRegx = /\s{0,2}\[.*?\]: .*?$/g
export default function stripMarkdown(md: string) {
  // Remove horizontal rules (stripListHeaders conflict with this rule, which is why it has been moved to the top)
  return (
    md
      .replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, '$1')
      // Header
      .replace(HeaderRegx, '\n')
      // Fenced codeblocks
      .replace(BlockRegx, '')
      // Strikethrough
      .replace(StrikethroughRegx, '')
      // Remove abbreviations
      .replace(abbreviationsRegx, '')
      // Remove HTML tags
      .replace(HTMLRegx, '')
      // Remove setext-style headers
      .replace(StyleHeaders, '')
      // Remove footnotes?
      .replace(FootNotes, '')
      .replace(LinkRegx, '')
      // Remove images
      .replace(ImageRegx, '')
      // Remove inline links
      .replace(InlineLinkRegx, '$1')
      // Remove blockquotes
      .replace(BlockQuotes, '$1')
      // .replace(/(^|\n)\s{0,3}>\s?/g, '\n\n')
      // Remove reference-style links?
      .replace(ReferenceStyleRegx, '')
      // Remove atx-style headers
      .replace(AtxStyleRegx, '$1$3$4$6')
      // Remove * emphasis
      .replace(/([\*]+)(\S)(.*?\S)??\1/g, '$2$3')
      // Remove _ emphasis. Unlike *, _ emphasis gets rendered only if
      //   1. Either there is a whitespace character before opening _ and after closing _.
      //   2. Or _ is at the start/end of the string.
      .replace(/(^|\W)([_]+)(\S)(.*?\S)??\2($|\W)/g, '$1$3$4$5')
      // Remove inline code
      .replace(InlineCodeRegx, '$1')
  )
}
