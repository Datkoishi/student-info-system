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
    console.log("Received student data:", studentData) // Debug: Log dữ liệu nhận được

    // Kiểm tra dữ liệu đầu vào cơ bản
    if (!studentData.student_id || !studentData.full_name || !studentData.gender) {
      return res.status(400).json({ message: "Thiếu thông tin cơ bản: mã sinh viên, họ tên hoặc giới tính" })
    }

    // Kiểm tra mã sinh viên đã tồn tại chưa
    const existingStudent = await Student.getStudentByStudentId(studentData.student_id)
    if (existingStudent) {
      return res.status(400).json({ message: "Mã sinh viên đã tồn tại" })
    }

    // Đảm bảo các trường còn thiếu được gán giá trị mặc định
    const completeStudentData = {
      ...studentData,
      email: studentData.email || `${studentData.student_id}@duytan.edu.vn`,
      phone: studentData.phone || "",
      address: studentData.address || "",
      major: studentData.major || "Chưa xác định",
      class_name: studentData.class_name || "Chưa xác định",
      enrollment_year: studentData.enrollment_year || new Date().getFullYear(),
      gpa: studentData.gpa || null,
    }

    const newStudent = await Student.createStudent(completeStudentData)
    res.status(201).json(newStudent)
  } catch (error) {
    console.error("Error in createStudent:", error)
    res.status(500).json({ message: "Lỗi server: " + error.message })
  }
}

// Cập nhật sinh viên
export async function updateStudent(req, res) {
  try {
    const id = req.params.id
    const studentData = req.body
    console.log("Updating student data:", studentData) // Debug: Log dữ liệu cập nhật

    // Kiểm tra sinh viên tồn tại
    const existingStudent = await Student.getStudentById(id)
    if (!existingStudent) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" })
    }

    // Kiểm tra dữ liệu đầu vào cơ bản
    if (!studentData.student_id || !studentData.full_name || !studentData.gender) {
      return res.status(400).json({ message: "Thiếu thông tin cơ bản: mã sinh viên, họ tên hoặc giới tính" })
    }

    // Kiểm tra mã sinh viên đã tồn tại chưa (nếu thay đổi)
    if (studentData.student_id !== existingStudent.student_id) {
      const studentWithSameId = await Student.getStudentByStudentId(studentData.student_id)
      if (studentWithSameId) {
        return res.status(400).json({ message: "Mã sinh viên đã tồn tại" })
      }
    }

    // Kết hợp dữ liệu hiện tại với dữ liệu mới
    const completeStudentData = {
      ...existingStudent,
      ...studentData,
      id: undefined, // Đảm bảo không ghi đè id
    }

    const updatedStudent = await Student.updateStudent(id, completeStudentData)
    res.status(200).json(updatedStudent)
  } catch (error) {
    console.error("Error in updateStudent:", error)
    res.status(500).json({ message: "Lỗi server: " + error.message })
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
