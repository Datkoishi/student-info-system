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
    const result = await query(
      `INSERT INTO students 
       (student_id, full_name, date_of_birth, gender, email, phone, address, major, class_name, enrollment_year, gpa) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentData.student_id,
        studentData.full_name,
        studentData.date_of_birth,
        studentData.gender,
        studentData.email,
        studentData.phone,
        studentData.address,
        studentData.major,
        studentData.class_name,
        studentData.enrollment_year,
        studentData.gpa || null,
      ],
    )

    return { id: result.insertId, ...studentData }
  } catch (error) {
    throw error
  }
}

// Cập nhật sinh viên
async function updateStudent(id, studentData) {
  try {
    await query(
      `UPDATE students 
       SET student_id = ?, full_name = ?, date_of_birth = ?, gender = ?, 
           email = ?, phone = ?, address = ?, major = ?, class_name = ?, 
           enrollment_year = ?, gpa = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        studentData.student_id,
        studentData.full_name,
        studentData.date_of_birth,
        studentData.gender,
        studentData.email,
        studentData.phone,
        studentData.address,
        studentData.major,
        studentData.class_name,
        studentData.enrollment_year,
        studentData.gpa || null,
        id,
      ],
    )

    return { id, ...studentData }
  } catch (error) {
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
