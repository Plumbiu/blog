// based on https://github.com/zuchka/remove-markdown/blob/main/index.js
// LICENSE: https://github.com/zuchka/remove-markdown/blob/main/LICENSE

const HorizontalRule =
  /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/gm
const UnicodeChar = /^([\s\t]*)([*\-+]|\d+\.)\s+/gm
const Header = /\n={2,}/g
const FenceCodeBlock = /~{3}.*\n/g
const Strikethrough = /~~/g
const CodeBlockWithBackticks = /```(?:.*)\n([\s\S]*?)```/g
const Abbr = /\*\[.*\]:.*\n/
const SetextHeader = /^[=-]{2,}\s*$/g
const Footnote1 = /\[\^.+?\](: .*?$)?/g
const Footnote2 = /\s{0,2}\[.*?\]: .*?$/g
const Images = /!\[(.*?)\][[(].*?[\])]/g
const InlineLinks = /\[([\s\S]*?)\]\s*[([].*?[)\]]/g
const Blockquotes = /^(\n)?\s{0,3}>\s?/gm
const ReferenceStyleLink = /^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g
const AtxStyleHeader =
  /^(\n)?\s{0,}#{1,6}\s*( (.+))? +#+$|^(\n)?\s{0,}#{1,6}\s*( (.+))?$/gm
const Emphasis = /([*]+)(\S)(.*?\S)??\1/g
const __StyleEmphasis = /(^|\W)([_]+)(\S)(.*?\S)??\2($|\W)/g
const SingleLineCode = /(`{3,})(.*?)\1/gm
const InlineCode = /`(.+?)`/g
const StrikeThrough = /~(.*?)~/g

export default function stripMarkdown(md: string) {
  let output = md || ''
  const listUnicodeChar = false
  const stripListLeaders = true
  const gfm = true
  const useImgAltText = false
  const abbr = false
  const replaceLinksWithURL = true
  const htmlTagsToSkip: string[] = []

  // Remove horizontal rules (stripListHeaders conflict with this rule, which is why it has been moved to the top)
  output = output.replace(HorizontalRule, '')

  if (stripListLeaders) {
    if (listUnicodeChar) {
      output = output.replace(UnicodeChar, listUnicodeChar + ' $1')
    } else {
      output = output.replace(UnicodeChar, '$1')
    }
  }
  if (gfm) {
    output = output
      // Header
      .replace(Header, '\n')
      // Fenced codeblocks
      .replace(FenceCodeBlock, '')
      // Strikethrough
      .replace(Strikethrough, '')
      // Fenced codeblocks with backticks
      .replace(CodeBlockWithBackticks, (_, code) => code.trim())
  }
  if (abbr) {
    // Remove abbreviations
    output = output.replace(Abbr, '')
  }

  // let htmlReplaceRegex = /<[^>]*>/g
  // if (htmlTagsToSkip && htmlTagsToSkip.length > 0) {
  //   // Create a regex that matches tags not in htmlTagsToSkip
  //   const joinedHtmlTagsToSkip = htmlTagsToSkip.join('|')
  //   htmlReplaceRegex = new RegExp(
  //     `<(?!\/?(${joinedHtmlTagsToSkip})(?=>|\s[^>]*>))[^>]*>`,
  //     'g',
  //   )
  // }

  output = output
    // Remove HTML tags
    // .replace(htmlReplaceRegex, '')
    // Remove setext-style headers
    .replace(SetextHeader, '')
    // Remove footnotes?
    .replace(Footnote1, '')
    .replace(Footnote2, '')
    // Remove images
    .replace(Images, useImgAltText ? '$1' : '')
    // Remove inline links
    .replace(InlineLinks, replaceLinksWithURL ? '$2' : '$1')
    // Remove blockquotes
    .replace(Blockquotes, '$1')
    // .replace(/(^|\n)\s{0,3}>\s?/g, '\n\n')
    // Remove reference-style links?
    .replace(ReferenceStyleLink, '')
    // Remove atx-style headers
    .replace(AtxStyleHeader, '$1$3$4$6')
    // Remove * emphasis
    .replace(Emphasis, '$2$3')
    // Remove _ emphasis. Unlike *, _ emphasis gets rendered only if
    //   1. Either there is a whitespace character before opening _ and after closing _.
    //   2. Or _ is at the start/end of the string.
    .replace(__StyleEmphasis, '$1$3$4$5')
    // Remove single-line code blocks (already handled multiline above in gfm section)
    .replace(SingleLineCode, '$2')
    // Remove inline code
    .replace(InlineCode, '$1')
    // // Replace two or more newlines with exactly two? Not entirely sure this belongs here...
    // .replace(/\n{2,}/g, '\n\n')
    // // Remove newlines in a paragraph
    // .replace(/(\S+)\n\s*(\S+)/g, '$1 $2')
    // Replace strike through
    .replace(StrikeThrough, '$1')
  return output
}
