const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const inline = (s: string) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, (_m, t, u) => `<a href="${u}"${u.startsWith('http') ? ' target="_blank" rel="noopener nofollow"' : ''}>${t}</a>`)

/** Tiny, XSS-safe formatter for admin-written articles: ## / ### headings, "- " lists, **bold**, [text](url), paragraphs. */
export function richText(src: string): string {
  const out: string[] = []
  let list: string[] = []
  const flush = () => { if (list.length) { out.push(`<ul>${list.map((l) => `<li>${inline(l)}</li>`).join('')}</ul>`); list = [] } }
  for (const block of src.replace(/\r/g, '').split(/\n{2,}/)) {
    for (const line of block.split('\n')) {
      const t = line.trim()
      if (!t) continue
      if (/^- /.test(t)) { list.push(t.slice(2)); continue }
      flush()
      if (t.startsWith('### ')) out.push(`<h3>${inline(t.slice(4))}</h3>`)
      else if (t.startsWith('## ')) out.push(`<h2>${inline(t.slice(3))}</h2>`)
      else out.push(`<p>${inline(t)}</p>`)
    }
    flush()
  }
  return out.join('\n')
}
export const readMinutes = (s: string) => Math.max(1, Math.round(s.split(/\s+/).length / 190))
