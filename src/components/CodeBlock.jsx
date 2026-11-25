import { useState } from 'react'
import { Highlight } from 'prism-react-renderer'

const theme = {
  plain: { color: '#e6e8ee', backgroundColor: 'transparent' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#5d6377', fontStyle: 'italic' } },
    { types: ['keyword', 'module', 'control-flow'], style: { color: '#61dafb' } },
    { types: ['string', 'attr-value', 'template-string', 'char', 'regex'], style: { color: '#7ee2a8' } },
    { types: ['function', 'method'], style: { color: '#f5d67b' } },
    { types: ['tag', 'class-name', 'maybe-class-name'], style: { color: '#c4a7ff' } },
    { types: ['attr-name', 'property'], style: { color: '#9cc7ff' } },
    { types: ['number', 'boolean', 'constant'], style: { color: '#ffa07a' } },
    { types: ['operator', 'punctuation'], style: { color: '#8b91a5' } },
    { types: ['builtin'], style: { color: '#61dafb' } },
  ],
}

export function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code.src)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* буфер обмена недоступен */
    }
  }

  return (
    <div className="code">
      <div className="code-bar">
        <span className="dots"><i /><i /><i /></span>
        <span className="code-file">{code.file}</span>
        <button className="copy" onClick={copy} aria-label="Скопировать код">
          {copied ? '✓ Скопировано' : 'Копировать'}
        </button>
      </div>
      {code.lang === 'bash' ? (
        <ShellCode src={code.src} />
      ) : (
        <Highlight code={code.src} language={code.lang} theme={theme}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre>
              <code>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, k) => (
                      <span key={k} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      )}
    </div>
  )
}

// Простая подсветка для shell: команды + комментарии после #
function ShellCode({ src }) {
  return (
    <pre>
      <code>
        {src.split('\n').map((line, i) => {
          const at = line.search(/(^|\s)#/)
          const body = at === -1 ? line : line.slice(0, at)
          const comment = at === -1 ? '' : line.slice(at)
          const isCmd = /^(npm|npx|cd|vercel|git)\b/.test(body)
          return (
            <div key={i}>
              <span style={{ color: isCmd ? '#61dafb' : '#e6e8ee' }}>{body}</span>
              {comment && <span style={{ color: '#5d6377', fontStyle: 'italic' }}>{comment}</span>}
              {!line && ' '}
            </div>
          )
        })}
      </code>
    </pre>
  )
}
