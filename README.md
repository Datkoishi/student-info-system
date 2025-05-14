# Hệ thống Quản lý Thông tin Sinh viên - Đại học 
![Banner](https://placeholder.svg?height=250&width=800&query=Hệ%20thống%20Quản%20lý%20Thông%20tin%20Sinh%20viên%20-%20Đại%20học%20Duy%20Tân)

Hệ thống quản lý thông tin sinh viên cho Trường , được xây dựng với frontend HTML/CSS/JavaScript và backend Node.js/Express/MySQL.

## 📋 Tính năng

- ✅ Quản lý thông tin sinh viên (thêm, xem, sửa, xóa)
- ✅ Quản lý ngành học
- ✅ Tìm kiếm và lọc dữ liệu
- ✅ Giao diện người dùng thân thiện, responsive
- ✅ Phân trang dữ liệu
- ✅ Xác thực và kiểm tra dữ liệu đầu vào

## 🛠️ Công nghệ sử dụng

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend
- Node.js
- Express.js
- MySQL

## 🗂️ Cấu trúc dự án

```
student-info-system/
│
├── public/                  # Thư mục chứa các file frontend
│   ├── css/                 # CSS styles
│   │   └── style.css        # File CSS chính
│   ├── js/                  # JavaScript
│   │   └── main.js          # File JS chính
│   └── index.html           # Trang chủ HTML
│
├── src/                     # Thư mục chứa mã nguồn backend
│   ├── config/              # Cấu hình
│   │   └── db.js            # Cấu hình kết nối database
│   ├── controllers/         # Controllers
│   │   ├── studentController.js  # Xử lý logic sinh viên
│   │   └── majorController.js    # Xử lý logic ngành học
│   ├── models/              # Models
│   │   ├── Student.js       # Model sinh viên
│   │   └── Major.js         # Model ngành học
│   └── routes/              # Routes
│       ├── studentRoutes.js # Routes sinh viên
│       └── majorRoutes.js   # Routes ngành học
│
├── .env                     # Biến môi trường
├── server.js                # File khởi động server
└── README.md                # Tài liệu dự án
```

## 🚀 Hướng dẫn cài đặt và chạy

### Yêu cầu hệ thống
- Node.js (v14.0.0 trở lên)
- MySQL (v5.7 trở lên)

### Các bước cài đặt

1. Clone repository
```bash
git clone https://github.com/Datkoishi/student-info-system.git
cd student-info-system
