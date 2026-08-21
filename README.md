# Tầm Nhìn Thương Hiệu 2026

Landing page cho cuộc thi **Tầm Nhìn Thương Hiệu 2026 – Round To Unbound**, xây bằng Vue 3, TypeScript, Vite và Bootstrap 5.

Website có hai route:

- `/` – landing page public.
- `/editor` – page builder trực quan: sửa text, ảnh, slider, bố cục, padding, màu, CSS và xuất JSON.

## Công nghệ

- Vue 3 + TypeScript + Vite
- Vue Router
- Bootstrap 5
- Lucide icons

## Chạy ở máy local

Yêu cầu: Node.js 20 trở lên và npm.

```bash
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal, thường là `http://localhost:5173`.

## Chỉnh sửa nội dung website

Truy cập `/editor` để chỉnh trực quan theo từng section.

- **Nội dung & ảnh**: text, link, countdown, carousel, slider giám khảo, FAQ, giải thưởng, footer.
- **Bố cục & CSS**: bật/tắt section, padding, margin, số cột, nền, overlay, màu, độ rộng container và CSS riêng.
- **Tải ảnh**: ảnh được nhúng dạng Data URL để preview và xuất JSON ngay. Với ảnh lớn, nên dùng đường dẫn ảnh đã upload lên hosting/CDN để tránh giới hạn localStorage.
- **JSON nâng cao**: nhập/xuất `site-content.json` để lưu cấu hình hoặc deploy.

Nội dung mặc định nằm trong [public/site-content.json](public/site-content.json). Asset Canva đã tải nằm trong `public/assets/tnth-canva/`.

## Build production

```bash
npm run build
```

Lệnh tạo thư mục `dist/`. Đây là toàn bộ file tĩnh để deploy.

## Deploy

### Netlify

1. Đẩy source lên GitHub.
2. Vào Netlify → **Add new site** → **Import an existing project**.
3. Chọn repository này.
4. Điền:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Bấm **Deploy site**.

Mỗi lần push lên nhánh `main`, Netlify sẽ tự build và deploy lại.

### Vercel

1. Vào Vercel → **Add New Project** → import repository.
2. Framework preset chọn **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Bấm **Deploy**.

### Hosting cPanel / VPS / shared hosting

```bash
npm ci
npm run build
```

Upload **toàn bộ nội dung bên trong** thư mục `dist/` vào `public_html/` hoặc thư mục domain/subdomain của bạn. Không upload nguyên thư mục `dist` lồng bên trong thư mục web root.

Nếu hosting dùng Apache và bạn muốn Vue Router xử lý route trực tiếp như `/editor`, tạo file `.htaccess` trong web root:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^ index.html [L]
```

## Kiểm tra trước khi deploy

```bash
npm run build
npm run preview
```

Mở URL preview và kiểm tra trang `/` cùng `/editor`.

## Canva assets

Asset public từ Canva đã được tải sẵn. Nếu cần tải lại từ file `canva-view.html`:

```bash
npm run assets:canva
```

Lưu ý: chỉ dùng asset khi bạn có quyền sử dụng chúng.
