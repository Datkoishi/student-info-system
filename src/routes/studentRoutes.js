import express from "express"
import * as studentController from "../controllers/studentController.js"

const router = express.Router()

// Lấy tất cả sinh viên
router.get("/", studentController.getAllStudents)

// Tìm kiếm sinh viên
router.get("/search", studentController.searchStudents)

// Lấy sinh viên theo ID
router.get("/:id", studentController.getStudentById)

// Tạo sinh viên mới
router.post("/", studentController.createStudent)

// Cập nhật sinh viên
router.put("/:id", studentController.updateStudent)

// Xóa sinh viên
router.delete("/:id", studentController.deleteStudent)

export default router
