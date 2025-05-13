import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import studentRoutes from "./src/routes/studentRoutes.js"
import majorRoutes from "./src/routes/majorRoutes.js"

// Cấu hình dotenv
dotenv.config()

// Khởi tạo Express app
const app = express()
const PORT = process.env.PORT || 3000

// Lấy __dirname trong ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use("/api/students", studentRoutes)
app.use("/api/majors", majorRoutes)

// Route mặc định
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).send("Không tìm thấy trang")
})

// Xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Đã xảy ra lỗi!")
})

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`)
})
