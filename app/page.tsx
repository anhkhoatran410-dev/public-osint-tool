'use client'

import { FormEvent, useMemo, useState } from 'react'

type Result = { title: string; url: string; description: string; source: string; score: number }

function buildQueries(input: string) {
  const q = input.trim()
  return [
    `site:facebook.com "${q}"`,
    `site:facebook.com/${q}`,
    `"${q}" profile`,
    `"${q}" Facebook`
  ]
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const externalLinks = useMemo(() => {
    const q = encodeURIComponent(query.trim())
    if (!q) return []
    return [
      ['Google', `https://www.google.com/search?q=${q}+site%3Afacebook.com`],
      ['Bing', `https://www.bing.com/search?q=${q}+site%3Afacebook.com`],
      ['DuckDuckGo', `https://duckduckgo.com/?q=${q}+site%3Afacebook.com`]
    ]
  }, [query])

  async function search(e: FormEvent) {
    e.preventDefault()
    setMessage('')
    setResults([])
    if (!query.trim()) return setMessage('Nhập tên, username hoặc cụm từ cần tìm.')
    setLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Search failed')
      setResults(data.results || [])
      setMessage(data.message || '')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Có lỗi khi tìm kiếm.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <div className="eyebrow">PUBLIC SEARCH DESK</div>
        <h1>Tìm thông tin công khai trên web</h1>
        <p>Tập trung kết quả từ các nguồn công khai, ưu tiên trang Facebook công khai và tạo danh sách bằng chứng để bạn tự kiểm tra.</p>
        <form onSubmit={search} className="searchbar">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Tên người, username hoặc từ khóa..." autoComplete="off" />
          <button disabled={loading}>{loading ? 'Đang tìm...' : 'Tìm kiếm'}</button>
        </form>
        <div className="quick">{buildQueries(query).slice(0, 3).map(q => <span key={q}>{q}</span>)}</div>
      </section>

      {message && <div className="notice">{message}</div>}

      {externalLinks.length > 0 && (
        <section className="card">
          <div className="sectionTitle"><h2>Mở tìm kiếm trực tiếp</h2><span>Không cần API key</span></div>
          <div className="linkGrid">{externalLinks.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name} ↗</a>)}</div>
        </section>
      )}

      <section className="card">
        <div className="sectionTitle"><h2>Kết quả</h2><span>{results.length} mục</span></div>
        {results.length === 0 && !loading ? <div className="empty">Chưa có kết quả. Nếu chưa cấu hình BRAVE_SEARCH_API_KEY, bạn vẫn có thể dùng các nút tìm kiếm trực tiếp phía trên.</div> : <div className="results">{results.map((r, i) => <article className="result" key={`${r.url}-${i}`}><div className="resultTop"><strong>{r.score}% match</strong><span>{r.source}</span></div><h3><a href={r.url} target="_blank" rel="noreferrer">{r.title || r.url}</a></h3><p>{r.description}</p><small>{r.url}</small></article>)}</div>}
      </section>

      <footer>Chỉ xử lý dữ liệu công khai. Không đăng nhập Facebook, không vượt CAPTCHA/rate-limit và không suy luận dữ liệu nhạy cảm.</footer>
    </main>
  )
}
