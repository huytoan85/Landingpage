# Business Meeting 2026 · ASTRONIXA & Cộng Đồng Ohana

Hệ thống website sự kiện **Business Meeting & Workshop AI 2026** được xây dựng với đầy đủ tính năng: Landing Page giới thiệu sự kiện, Công cụ tạo thiệp mời VIP cá nhân hóa, và Hệ thống CRM quản lý khách đăng ký.

---

## 🌟 Các phân hệ của hệ thống

### 1. Landing Page Sự Kiện (`/` hoặc `index.html`)
- **Hiệu ứng không gian vũ trụ động (Space Canvas Engine)**: Sao băng, bụi sao vũ trụ, hiệu ứng gradient chuyển màu và chuyển động mượt mà.
- **Đếm ngược thời gian thực**: Đồng hồ đếm ngược đến ngày tổ chức **10/10/2026 08:30**.
- **Khu vực hội trường & Bản đồ**: Giới thiệu khách sạn **Athena Hotel** (280 Tô Hiến Thành, Q.10, TP.HCM), tích hợp hiệu ứng Ken Burns và Google Maps dẫn đường.
- **Nội dung chương trình**:
  - Buổi sáng: Business Meeting Astronixa - Bức tranh thị trường AI & Cơ hội cổ đông toàn cầu.
  - Buổi chiều: Workshop AI thực chiến Ohana Career & Affiliate AI.
- **Bảng giá hạng vé**: Standard (339K), VIP (699K), SuperVIP (1.299K) với nút chọn vé tự động điền form.
- **Hồ sơ diễn giả**:
  - Chuyên gia **Lê Huy Toàn** (Chuyên gia AI Thực Chiến | Giảng viên đào tạo ứng dụng AI trong công việc và kinh doanh)
- **Form đăng ký thông minh**: Kiểm tra tính hợp lệ số điện thoại, chống spam honeypot, lưu trữ trực tiếp vào CRM.
- **Thanh toán VietQR**: Tích hợp mã QR VietinBank, nút sao chép số tài khoản tức thì, hướng dẫn cú pháp chuyển khoản.
- **Tối ưu in ấn**: Hỗ trợ định dạng in A4 Brochure 2 trang sẵn sàng.

---

### 2. Công cụ tạo thiệp mời VIP (`/thiep-moi` hoặc `thiep-moi.html`)
- Thiết kế chuẩn tỷ lệ **1080px (Ultra-HD 2x)**.
- **Tải ảnh đại diện**: Hỗ trợ kéo thả ảnh đại diện, thanh trượt phóng to/thu nhỏ và căn chỉnh vị trí X/Y.
- **Tùy biến thông tin**: Nhập họ tên, chức danh/doanh nghiệp, hạng vé (VIP Guest, SuperVIP, Pioneer Partner...).
- **Tạo mã QR Check-in**: Tự động sinh mã vé và mã QR code định danh cho từng khách mời.
- **3 giao diện phong cách**:
  - Cosmic Neon (Màu tím neon huyền ảo)
  - Royal Gold (Màu vàng kim quý phái)
  - Cyber Emerald (Màu ngọc lục bảo công nghệ)
- **Xuất ảnh đa năng**:
  - Tải file PNG siêu nét (Ultra HD)
  - Tải file JPG tối ưu đăng Story/Zalo/Facebook
  - Nút sao chép ảnh vào Clipboard (Ctrl + V dán trực tiếp vào Zalo/Messenger)

---

### 3. Hệ thống Quản trị CRM (`/admin` hoặc `admin.html`)
- **Bảo mật**: Đăng nhập bằng mật khẩu quản trị (`Duyanh1401`).
- **Bảng thống kê**: Tổng lượt đăng ký, số lượng theo từng hạng vé Standard, VIP, SuperVIP.
- **Bộ lọc Pipeline**: Lọc theo trạng thái *Tất cả*, *Mới*, *Đã gọi*, *Quan tâm*, *Đã chốt*, *Hủy*.
- **Tìm kiếm đa năng**: Tìm theo tên, số điện thoại, email, doanh nghiệp, ghi chú.
- **Chăm sóc khách hàng**: Cập nhật trạng thái và nhập ghi chú chăm sóc trực tiếp trên từng dòng, tự động lưu.
- **Đồng bộ thời gian thực**: Sử dụng `BroadcastChannel` và `Storage Event` tự động hiển thị thông báo khi có khách đăng ký mới.
- **Xuất dữ liệu Excel**: Xuất file CSV hỗ trợ định dạng tiếng Việt UTF-8 BOM hiển thị chuẩn xác trong Microsoft Excel.

---

## 🚀 Hướng dẫn khởi chạy

### Chạy qua Node.js (Khuyên dùng)
```bash
# Cài đặt thư viện (chỉ cần chạy lần đầu)
npm install

# Khởi chạy server
npm start
```
Truy cập:
- Trang chủ: [http://localhost:3000](http://localhost:3000)
- Tạo thiệp mời: [http://localhost:3000/thiep-moi](http://localhost:3000/thiep-moi)
- Quản trị CRM: [http://localhost:3000/admin](http://localhost:3000/admin) (Mật khẩu: `Duyanh1401`)

### Mở trực tiếp file HTML
Bạn cũng có thể mở trực tiếp các file `index.html`, `thiep-moi.html`, `admin.html` bằng trình duyệt bất kỳ (Chrome, Edge, Firefox). Hệ thống được trang bị cơ chế Offline-First và LocalStorage để hoạt động ngay cả khi không có máy chủ backend.

---

## ☁️ Triển khai lên Vercel
Dự án đã được cấu hình sẵn tệp `vercel.json` và thư mục `api/`:
1. Đưa mã nguồn lên GitHub/GitLab.
2. Kết nối kho lưu trữ với [Vercel](https://vercel.com).
3. Đặt biến môi trường `ADMIN_PASSWORD` (tùy chọn, mặc định là `Duyanh1401`).
4. Nhấn **Deploy**.
