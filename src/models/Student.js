import { query } from "../config/db.js"

// Lấy tất cả sinh viên
async function getAllStudents() {
  try {
    return await query("SELECT * FROM students ORDER BY created_at DESC")
  } catch (error) {
    throw error
  }
}

// Lấy sinh viên theo ID
async function getStudentById(id) {
  try {
    const students = await query("SELECT * FROM students WHERE id = ?", [id])
    return students[0]
  } catch (error) {
    throw error
  }
}

// Lấy sinh viên theo mã sinh viên
async function getStudentByStudentId(studentId) {
  try {
    const students = await query("SELECT * FROM students WHERE student_id = ?", [studentId])
    return students[0]
  } catch (error) {
    throw error
  }
}

// Tạo sinh viên mới
async function createStudent(studentData) {
  try {
    // Kiểm tra xem bảng có cột date_of_birth không
    const tableInfo = await query("SHOW COLUMNS FROM students LIKE 'date_of_birth'")

    let sql = ""
    let params = []

    if (tableInfo.length > 0) {
      // Nếu cột date_of_birth tồn tại, thêm NULL vào
      sql = `INSERT INTO students 
             (student_id, full_name, date_of_birth, gender, email, phone, address, major, class_name, enrollment_year, gpa) 
             VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)`

      params = [
        studentData.student_id,
        studentData.full_name,
        studentData.gender,
        studentData.email || `${studentData.student_id}@duytan.edu.vn`,
        studentData.phone || "",
        studentData.address || "",
        studentData.major || "Chưa xác định",
        studentData.class_name || "Chưa xác định",
        studentData.enrollment_year || new Date().getFullYear(),
        studentData.gpa || null,
      ]
    } else {
      // Nếu cột date_of_birth không tồn tại
      sql = `INSERT INTO students 
             (student_id, full_name, gender, email, phone, address, major, class_name, enrollment_year, gpa) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

      params = [
        studentData.student_id,
        studentData.full_name,
        studentData.gender,
        studentData.email || `${studentData.student_id}@duytan.edu.vn`,
        studentData.phone || "",
        studentData.address || "",
        studentData.major || "Chưa xác định",
        studentData.class_name || "Chưa xác định",
        studentData.enrollment_year || new Date().getFullYear(),
        studentData.gpa || null,
      ]
    }

    console.log("SQL:", sql)
    console.log("Params:", params)

    const result = await query(sql, params)
    return { id: result.insertId, ...studentData }
  } catch (error) {
    console.error("Error in createStudent:", error)
    throw error
  }
}

// Cập nhật sinh viên
async function updateStudent(id, studentData) {
  try {
    // Kiểm tra xem bảng có cột date_of_birth không
    const tableInfo = await query("SHOW COLUMNS FROM students LIKE 'date_of_birth'")

    let sql = ""
    let params = []

    if (tableInfo.length > 0) {
      // Nếu cột date_of_birth tồn tại
      sql = `UPDATE students 
             SET student_id = ?, full_name = ?, date_of_birth = NULL, gender = ?, 
                 email = ?, phone = ?, address = ?, major = ?, class_name = ?, 
                 enrollment_year = ?, gpa = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`

      params = [
        studentData.student_id,
        studentData.full_name,
        studentData.gender,
        studentData.email || `${studentData.student_id}@duytan.edu.vn`,
        studentData.phone || "",
        studentData.address || "",
        studentData.major || "Chưa xác định",
        studentData.class_name || "Chưa xác định",
        studentData.enrollment_year || new Date().getFullYear(),
        studentData.gpa || null,
        id,
      ]
    } else {
      // Nếu cột date_of_birth không tồn tại
      sql = `UPDATE students 
             SET student_id = ?, full_name = ?, gender = ?, 
                 email = ?, phone = ?, address = ?, major = ?, class_name = ?, 
                 enrollment_year = ?, gpa = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`

      params = [
        studentData.student_id,
        studentData.full_name,
        studentData.gender,
        studentData.email || `${studentData.student_id}@duytan.edu.vn`,
        studentData.phone || "",
        studentData.address || "",
        studentData.major || "Chưa xác định",
        studentData.class_name || "Chưa xác định",
        studentData.enrollment_year || new Date().getFullYear(),
        studentData.gpa || null,
        id,
      ]
    }

    console.log("Update SQL:", sql)
    console.log("Update Params:", params)

    await query(sql, params)
    return { id, ...studentData }
  } catch (error) {
    console.error("Error in updateStudent:", error)
    throw error
  }
}

// Xóa sinh viên
async function deleteStudent(id) {
  try {
    await query("DELETE FROM students WHERE id = ?", [id])
    return { id }
  } catch (error) {
    throw error
  }
}

// Tìm kiếm sinh viên
async function searchStudents(searchTerm) {
  try {
    return await query(
      `SELECT * FROM students 
       WHERE student_id LIKE ? OR full_name LIKE ? OR class_name LIKE ? OR major LIKE ?
       ORDER BY created_at DESC`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
    )
  } catch (error) {
    throw error
  }
}

export {
  getAllStudents,
  getStudentById,
  getStudentByStudentId,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
}
