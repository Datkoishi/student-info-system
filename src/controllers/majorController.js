import * as Major from "../models/Major.js"

// Lấy tất cả ngành học
export async function getAllMajors(req, res) {
  try {
    const majors = await Major.getAllMajors()
    res.status(200).json(majors)
  } catch (error) {
    console.error("Error in getAllMajors:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Lấy ngành học theo ID
export async function getMajorById(req, res) {
  try {
    const id = req.params.id
    const major = await Major.getMajorById(id)

    if (!major) {
      return res.status(404).json({ message: "Không tìm thấy ngành học" })
    }

    res.status(200).json(major)
  } catch (error) {
    console.error("Error in getMajorById:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Tạo ngành học mới
export async function createMajor(req, res) {
  try {
    const majorData = req.body

    // Kiểm tra dữ liệu đầu vào
    if (!majorData.name || !majorData.department) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" })
    }

    // Kiểm tra tên ngành học đã tồn tại chưa
    const existingMajor = await Major.getMajorByName(majorData.name)
    if (existingMajor) {
      return res.status(400).json({ message: "Tên ngành học đã tồn tại" })
    }

    const newMajor = await Major.createMajor(majorData)
    res.status(201).json(newMajor)
  } catch (error) {
    console.error("Error in createMajor:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Cập nhật ngành học
export async function updateMajor(req, res) {
  try {
    const id = req.params.id
    const majorData = req.body

    // Kiểm tra ngành học tồn tại
    const existingMajor = await Major.getMajorById(id)
    if (!existingMajor) {
      return res.status(404).json({ message: "Không tìm thấy ngành học" })
    }

    // Kiểm tra dữ liệu đầu vào
    if (!majorData.name || !majorData.department) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" })
    }

    // Kiểm tra tên ngành học đã tồn tại chưa (nếu thay đổi)
    if (majorData.name !== existingMajor.name) {
      const majorWithSameName = await Major.getMajorByName(majorData.name)
      if (majorWithSameName) {
        return res.status(400).json({ message: "Tên ngành học đã tồn tại" })
      }
    }

    const updatedMajor = await Major.updateMajor(id, majorData)
    res.status(200).json(updatedMajor)
  } catch (error) {
    console.error("Error in updateMajor:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Xóa ngành học
export async function deleteMajor(req, res) {
  try {
    const id = req.params.id

    // Kiểm tra ngành học tồn tại
    const existingMajor = await Major.getMajorById(id)
    if (!existingMajor) {
      return res.status(404).json({ message: "Không tìm thấy ngành học" })
    }

    await Major.deleteMajor(id)
    res.status(200).json({ message: "Xóa ngành học thành công" })
  } catch (error) {
    console.error("Error in deleteMajor:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}
