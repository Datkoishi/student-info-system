import express from "express"
import * as majorController from "../controllers/majorController.js"

const router = express.Router()

// Lấy tất cả ngành học
router.get("/", majorController.getAllMajors)

// Lấy ngành học theo ID
router.get("/:id", majorController.getMajorById)

// Tạo ngành học mới
router.post("/", majorController.createMajor)

// Cập nhật ngành học
router.put("/:id", majorController.updateMajor)

// Xóa ngành học
router.delete("/:id", majorController.deleteMajor)

export default router
