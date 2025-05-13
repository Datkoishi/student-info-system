import * as Student from "../models/Student.js"

// Lấy tất cả sinh viên
export async function getAllStudents(req, res) {
  try {
    const students = await Student.getAllStudents()
    res.status(200).json(students)
  } catch (error) {
    console.error("Error in getAllStudents:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Lấy sinh viên theo ID
export async function getStudentById(req, res) {
  try {
    const id = req.params.id
    const student = await Student.getStudentById(id)

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" })
    }

    res.status(200).json(student)
  } catch (error) {
    console.error("Error in getStudentById:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Tạo sinh viên mới
export async function createStudent(req, res) {
  try {
    const studentData = req.body

    // Kiểm tra dữ liệu đầu vào
    if (
      !studentData.student_id ||
      !studentData.full_name ||
      !studentData.date_of_birth ||
      !studentData.gender ||
      !studentData.email ||
      !studentData.phone ||
      !studentData.address ||
      !studentData.major ||
      !studentData.class_name ||
      !studentData.enrollment_year
    ) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" })
    }

    // Kiểm tra mã sinh viên đã tồn tại chưa
    const existingStudent = await Student.getStudentByStudentId(studentData.student_id)
    if (existingStudent) {
      return res.status(400).json({ message: "Mã sinh viên đã tồn tại" })
    }

    const newStudent = await Student.createStudent(studentData)
    res.status(201).json(newStudent)
  } catch (error) {
    console.error("Error in createStudent:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Cập nhật sinh viên
export async function updateStudent(req, res) {
  try {
    const id = req.params.id
    const studentData = req.body

    // Kiểm tra sinh viên tồn tại
    const existingStudent = await Student.getStudentById(id)
    if (!existingStudent) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" })
    }

    // Kiểm tra dữ liệu đầu vào
    if (
      !studentData.student_id ||
      !studentData.full_name ||
      !studentData.date_of_birth ||
      !studentData.gender ||
      !studentData.email ||
      !studentData.phone ||
      !studentData.address ||
      !studentData.major ||
      !studentData.class_name ||
      !studentData.enrollment_year
    ) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" })
    }

    // Kiểm tra mã sinh viên đã tồn tại chưa (nếu thay đổi)
    if (studentData.student_id !== existingStudent.student_id) {
      const studentWithSameId = await Student.getStudentByStudentId(studentData.student_id)
      if (studentWithSameId) {
        return res.status(400).json({ message: "Mã sinh viên đã tồn tại" })
      }
    }

    const updatedStudent = await Student.updateStudent(id, studentData)
    res.status(200).json(updatedStudent)
  } catch (error) {
    console.error("Error in updateStudent:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Xóa sinh viên
export async function deleteStudent(req, res) {
  try {
    const id = req.params.id

    // Kiểm tra sinh viên tồn tại
    const existingStudent = await Student.getStudentById(id)
    if (!existingStudent) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" })
    }

    await Student.deleteStudent(id)
    res.status(200).json({ message: "Xóa sinh viên thành công" })
  } catch (error) {
    console.error("Error in deleteStudent:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Tìm kiếm sinh viên
export async function searchStudents(req, res) {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" })
    }

    const students = await Student.searchStudents(q)
    res.status(200).json(students)
  } catch (error) {
    console.error("Error in searchStudents:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}
