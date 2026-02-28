import { useState, useCallback, useEffect } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [outputMode, setOutputMode] = useState('json') // 'json' | 'csv'

  // 实时 JSON 校验
  useEffect(() => {
    if (!input.trim()) {
      setValidationError('')
      return
    }
    try {
      JSON.parse(input)
      setValidationError('')
    } catch (e) {
      setValidationError(e.message || 'JSON 语法错误')
    }
  }, [input])

  const formatJSON = useCallback((minify = false) => {
    setError('')
    setOutputMode('json')
    if (!input.trim()) {
      setOutput('')
      return
    }
    try {
      const parsed = JSON.parse(input)
      const space = indent === 0 ? '\t' : indent
      const formatted = minify
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, space)
      setOutput(formatted)
    } catch (e) {
      setError(e.message || 'JSON 解析失败')
      setOutput('')
    }
  }, [input, indent])

  const jsonToCsv = useCallback(() => {
    setError('')
    setOutputMode('csv')
    if (!input.trim()) {
      setOutput('')
      return
    }
    try {
      const parsed = JSON.parse(input)
      const rows = Array.isArray(parsed) ? parsed : [parsed]
      if (rows.length === 0) {
        setOutput('')
        return
      }
      const headers = [...new Set(rows.flatMap((r) => Object.keys(r)))]
      const escapeCsv = (val) => {
        const str = val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : String(val))
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }
      const lines = [
        headers.join(','),
        ...rows.map((row) =>
          headers.map((h) => escapeCsv(row[h] ?? '')).join(',')
        )
      ]
      setOutput(lines.join('\n'))
    } catch (e) {
      setError(e.message || '转换失败')
      setOutput('')
    }
  }, [input])

  const copyToClipboard = useCallback(async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('复制失败')
    }
  }, [output])

  const downloadFile = useCallback(() => {
    if (!output) return
    const ext = outputMode === 'csv' ? 'csv' : 'json'
    const mime = outputMode === 'csv' ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8'
    const content = outputMode === 'csv' ? '\ufeff' + output : output
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }, [output, outputMode])

  const clearAll = useCallback(() => {
    setInput('')
    setOutput('')
    setError('')
    setValidationError('')
  }, [])

  const highlightJSON = (str) => {
    if (!str) return null
    return str.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'json-string'
        if (/^"/.test(match)) {
          cls = match.endsWith(':') ? 'json-key' : 'json-string'
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean'
        } else if (/null/.test(match)) {
          cls = 'json-null'
        } else if (/^-?\d/.test(match)) {
          cls = 'json-number'
        }
        return `<span class="${cls}">${escapeHtml(match)}</span>`
      }
    )
  }

  const escapeHtml = (text) => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  return (
    <div className="app">
      <header className="header">
        <h1>JSON 格式化</h1>
        <p className="subtitle">粘贴、格式化、复制 — 简洁高效</p>
      </header>

      <div className="toolbar">
        <div className="toolbar-left">
          <button onClick={() => formatJSON(false)} className="btn btn-primary">
            格式化
          </button>
          <button onClick={() => formatJSON(true)} className="btn btn-secondary">
            压缩
          </button>
          <button onClick={jsonToCsv} className="btn btn-secondary">
            转 CSV
          </button>
          <label className="indent-control">
            <span>缩进</span>
            <select value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
              <option value={2}>2 空格</option>
              <option value={4}>4 空格</option>
              <option value={0}>Tab</option>
            </select>
          </label>
        </div>
        <div className="toolbar-right">
          <button onClick={downloadFile} className="btn btn-secondary" disabled={!output}>
            下载
          </button>
          <button onClick={copyToClipboard} className="btn btn-ghost" disabled={!output}>
            {copied ? '已复制' : '复制'}
          </button>
          <button onClick={clearAll} className="btn btn-ghost">
            清空
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">!</span>
          {error}
        </div>
      )}

      <div className="editor-container">
        <div className="panel">
          <div className="panel-header">
            <span>输入</span>
            {input.trim() && (
              <span
                className={`validation-badge ${validationError ? 'invalid' : 'valid'}`}
                title={validationError || 'JSON 语法正确'}
              >
                {validationError ? validationError : '✓ 语法正确'}
              </span>
            )}
          </div>
          <textarea
            className="panel-input"
            placeholder='{"name": "示例", "items": [1, 2, 3]}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="panel">
          <div className="panel-header">
            <span>输出</span>
            {output && <span className="output-mode-badge">{outputMode === 'csv' ? 'CSV' : 'JSON'}</span>}
          </div>
          <pre className="panel-output">
            {output ? (
              outputMode === 'csv' ? (
                <code>{output}</code>
              ) : (
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightJSON(output)
                      .replace(/\n/g, '<br>')
                      .replace(/ /g, '&nbsp;')
                  }}
                />
              )
            ) : (
              <span className="placeholder">格式化或转 CSV 后结果将显示在这里</span>
            )}
          </pre>
        </div>
      </div>

      <footer className="footer">
        <span>支持 JSON 格式化、压缩、实时校验、转 CSV</span>
        <p className="footer-sponsor">
          若对你有帮助，欢迎
          <a
            href="https://afdian.com/a/sundd1898"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-sponsor-link"
          >
            支持作者（爱发电）
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
