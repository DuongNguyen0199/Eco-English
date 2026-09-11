# 📚 Eco English - Trợ lý Học Tiếng Anh B1-C2 (Chrome Extension)

Extension Chrome hỗ trợ học tiếng Anh thông minh với phương pháp **Lật thẻ SRS (Spaced Repetition System)**, tự động tạo phát âm bồi Tiếng Việt, phân loại trình độ CEFR, lưu trữ đồng bộ dữ liệu **Supabase Cloud**, đua **Bảng Xếp Hạng bạn bè** và **Marquee rivalry ticker** sinh động!

---

## 🌟 Tính Năng Nổi Bật

- 🗂️ **Lật thẻ SRS 5 Cấp Độ**: Tích lũy đủ 5 lần nhớ để đánh dấu thuộc bài. Phân loại Cụm từ chưa nhớ / Đã nhớ kỹ / Ôn lại toàn bộ.
- 🪄 **Tự Động Gen Phiên Âm Bồi Tiếng Việt**: Tự động chuyển đổi tiếng Anh sang phát âm tiếng Việt dễ đọc (VD: *I'm having second thoughts* ➔ *Ai-m ha-ving Se-kần-thót-s*).
- ✨ **Tự Động Phân Loại Trình Độ CEFR**: Tính toán trình độ phù hợp (B1/B2/C1/C2) dựa trên độ phức tạp của từ vựng.
- 🎯 **Bối Cảnh Sử Dụng (Usage Context)**: Hiển thị ngữ cảnh giao tiếp thực tế ngay mặt trước thẻ lật SRS và thư viện từ vựng.
- 🏆 **Đồng Bộ Supabase Cloud & Bảng Xếp Hạng Bạn Bè**: Lưu trữ điểm XP, chuỗi Streak tích lũy, tạo Tên hiển thị duy nhất và đua Top vinh danh Quán Quân.
- 🔥 **Thanh Tin Tức Cạnh Tranh (Marquee Rivalry Ticker)**: Dòng tin tức thách thức chạy liên tục cập nhật thứ hạng các học viên theo thời gian thực.

---

## 🛠️ Hướng Dẫn Cài Đặt Extension Trên Chrome

### 1. Dành cho người cài đặt từ Mã Nguồn GitHub

1. **Tải mã nguồn về máy**:
   ```bash
   git clone https://github.com/DuongNguyen0199/Eco-English.git
   cd Eco-English
   ```

2. **Cài đặt thư viện & Cài đóng gói sản phẩm**:
   ```bash
   npm install
   npm run build
   ```
   *Lưu ý: Lệnh `npm run build` sẽ tạo ra thư mục `dist/` chứa mã nguồn đã đóng gói chuẩn cho Chrome Extension.*

3. **Cài đặt vào trình duyệt Chrome**:
   - Truy cập địa chỉ: `chrome://extensions`
   - Bật công tắc **Chế độ dành cho nhà phát triển (Developer mode)** ở góc trên bên phải.
   - Bấm nút **Tải tiện ích đã giải nén (Load unpacked)**.
   - Chọn đường dẫn trỏ đến thư mục **`dist`** bên trong dự án vừa build.
   - Hoàn tất! Extension **Eco English** với biểu tượng cuốn sách sẽ xuất hiện sẵn sàng sử dụng.

---

### 2. Dành cho Người Dùng Bình Thường (Không dùng Terminal / Node.js)

Nếu bạn muốn chia sẻ cho bạn bè cài đặt nhanh mà họ không biết dùng Node.js / Git:
1. Bạn nén thư mục **`dist`** (sau khi build xong) thành file `Eco-English-Extension.zip`.
2. Gửi file `Eco-English-Extension.zip` cho bạn bè qua Zalo / Google Drive / Email.
3. Bạn bè giải nén file `.zip` đó ra một thư mục trên máy tính.
4. Mở `chrome://extensions` trên Chrome, bật **Developer mode**, chọn **Load unpacked (Tải tiện ích đã giải nén)** và trỏ trực tiếp đến thư mục vừa giải nén là cài thành công 100%!
