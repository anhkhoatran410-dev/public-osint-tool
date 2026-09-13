# Public Search Desk

Công cụ web để tìm và sắp xếp thông tin **công khai** trên Internet, ưu tiên kết quả Facebook public.

## Đã có

- Giao diện tìm kiếm responsive.
- Tự tạo truy vấn `site:facebook.com`.
- Nút mở Google, Bing và DuckDuckGo trực tiếp.
- API tìm kiếm tùy chọn qua Brave Search.
- Chấm điểm kết quả theo mức khớp từ khóa và domain Facebook.
- Không đăng nhập Facebook và không xử lý dữ liệu riêng tư.
- Không commit API key vào repository.

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Tìm kiếm API

Nếu muốn kết quả tự động trong app, đặt biến môi trường `BRAVE_SEARCH_API_KEY` trong `.env.local`.

Nếu chưa có key, các nút Google/Bing/DuckDuckGo vẫn hoạt động bình thường.

## Nguyên tắc

Tool chỉ dùng nguồn công khai. Không vượt đăng nhập, CAPTCHA, rate limit hoặc quyền truy cập; không suy luận dữ liệu nhạy cảm về một người.
