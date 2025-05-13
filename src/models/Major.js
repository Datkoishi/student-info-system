import { query } from "../config/db.js"

// Lấy tất cả ngành học
async function getAllMajors() {
  try {
    return await query("SELECT * FROM majors ORDER BY name ASC")
  } catch (error) {
    throw error
  }
}

// Lấy ngành học theo ID
async function getMajorById(id) {
  try {
    const majors = await query("SELECT * FROM majors WHERE id = ?", [id])
    return majors[0]
  } catch (error) {
    throw error
  }
}

// Lấy ngành học theo tên
async function getMajorByName(name) {
  try {
    const majors = await query("SELECT * FROM majors WHERE name = ?", [name])
    return majors[0]
  } catch (error) {
    throw error
  }
}

// Tạo ngành học mới
async function createMajor(majorData) {
  try {
    const result = await query("INSERT INTO majors (name, department) VALUES (?, ?)", [
      majorData.name,
      majorData.department,
    ])

    return { id: result.insertId, ...majorData }
  } catch (error) {
    throw error
  }
}

// Cập nhật ngành học
async function updateMajor(id, majorData) {
  try {
    await query("UPDATE majors SET name = ?, department = ? WHERE id = ?", [majorData.name, majorData.department, id])

    return { id, ...majorData }
  } catch (error) {
    throw error
  }
}

// Xóa ngành học
async function deleteMajor(id) {
  try {
    await query("DELETE FROM majors WHERE id = ?", [id])
    return { id }
  } catch (error) {
    throw error
  }
}

export { getAllMajors, getMajorById, getMajorByName, createMajor, updateMajor, deleteMajor }
