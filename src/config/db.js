import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

// Tạo pool connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "truongdat",
  password: process.env.DB_PASSWORD || "18042005",
  database: process.env.DB_NAME || "duytan_student_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Kiểm tra kết nối
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("Kết nối cơ sở dữ liệu thành công!")
    connection.release()
    return true
  } catch (error) {
    console.error("Lỗi kết nối cơ sở dữ liệu:", error)
    return false
  }
}

// Thực thi truy vấn
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Lỗi truy vấn:", error)
    throw error
  }
}

export { pool, testConnection, query }
