import { NextResponse } from 'next/server'

type SearchItem = { title?: string; url?: string; description?: string }

function score(item: SearchItem, query: string) {
  const haystack = `${item.title || ''} ${item.url || ''} ${item.description || ''}`.toLowerCase()
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const hits = terms.filter(t => haystack.includes(t)).length
  let value = terms.length ? Math.round((hits / terms.length) * 75) : 0
  if ((item.url || '').includes('facebook.com')) value += 25
  return Math.min(100, value)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const query = typeof body.query === 'string' ? body.query.trim() : ''
    if (!query) return NextResponse.json({ error: 'Query is required.' }, { status: 400 })

    const key = process.env.BRAVE_SEARCH_API_KEY
    if (!key) {
      return NextResponse.json({ results: [], message: 'Chưa cấu hình BRAVE_SEARCH_API_KEY. Hãy dùng các nút Google/Bing/DuckDuckGo để tìm trực tiếp.' })
    }

    const searchQuery = `site:facebook.com "${query.replaceAll('"', '')}" OR "${query.replaceAll('"', '')}" Facebook`
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchQuery)}&count=20&safesearch=strict`
    const response = await fetch(url, { headers: { Accept: 'application/json', 'X-Subscription-Token': key }, next: { revalidate: 300 } })
    if (!response.ok) return NextResponse.json({ error: `Search provider returned ${response.status}.` }, { status: 502 })

    const data = await response.json()
    const items: SearchItem[] = data.web?.results || []
    const results = items.map(item => ({
      title: item.title || '',
      url: item.url || '',
      description: item.description || '',
      source: (item.url || '').includes('facebook.com') ? 'Facebook public' : 'Web',
      score: score(item, query)
    })).sort((a, b) => b.score - a.score)

    return NextResponse.json({ results, message: `${results.length} kết quả từ nguồn tìm kiếm công khai.` })
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}
