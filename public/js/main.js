document.addEventListener("DOMContentLoaded", () => {
  // Biến toàn cục để lưu trữ dữ liệu sinh viên
  let students = []
  let majors = []
  let currentPage = 1
  const itemsPerPage = 10

  // Lấy các phần tử DOM
  const studentForm = document.getElementById("student-form")
  const studentsTable = document.getElementById("students-table")
  const studentsList = document.getElementById("students-list")
  const searchInput = document.getElementById("search-input")
  const searchBtn = document.getElementById("search-btn")
  const pagination = document.getElementById("pagination")
  const majorSelect = document.getElementById("major")

  // Modal elements
  const studentDetailModal = document.getElementById("student-detail-modal")
  const editStudentModal = document.getElementById("edit-student-modal")
  const closeButtons = document.querySelectorAll(".close")

  // Fetch danh sách ngành học
  fetchMajors()

  // Fetch danh sách sinh viên
  fetchStudents()

  // Xử lý sự kiện submit form thêm sinh viên
  studentForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = new FormData(studentForm)
    const studentData = {}

    formData.forEach((value, key) => {
      studentData[key] = value
    })

    // Kiểm tra các trường bắt buộc
    if (!studentData.student_id || !studentData.full_name || !studentData.gender) {
      alert("Vui lòng điền đầy đủ thông tin: Mã sinh viên, Họ tên và Giới tính")
      return
    }

    console.log("Dữ liệu gửi đi:", studentData) // Debug: Kiểm tra dữ liệu gửi đi

    // Gửi dữ liệu lên server
    fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || "Lỗi khi thêm sinh viên")
          })
        }
        return response.json()
      })
      .then((data) => {
        alert("Thêm sinh viên thành công!")
        studentForm.reset()
        fetchStudents() // Cập nhật lại danh sách sinh viên
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Đã xảy ra lỗi: " + error.message)
      })
  })

  // Xử lý sự kiện tìm kiếm
  searchBtn.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim().toLowerCase()
    if (searchTerm) {
      const filteredStudents = students.filter(
        (student) =>
          student.student_id.toLowerCase().includes(searchTerm) ||
          student.full_name.toLowerCase().includes(searchTerm) ||
          student.class_name.toLowerCase().includes(searchTerm),
      )
      renderStudents(filteredStudents)
    } else {
      renderStudents(students)
    }
  })

  // Đóng modal khi click vào nút đóng
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      studentDetailModal.style.display = "none"
      editStudentModal.style.display = "none"
    })
  })

  // Đóng modal khi click bên ngoài modal
  window.addEventListener("click", (event) => {
    if (event.target === studentDetailModal) {
      studentDetailModal.style.display = "none"
    }
    if (event.target === editStudentModal) {
      editStudentModal.style.display = "none"
    }
  })

  // Hàm fetch danh sách ngành học
  function fetchMajors() {
    fetch("/api/majors")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi khi lấy danh sách ngành học")
        }
        return response.json()
      })
      .then((data) => {
        majors = data
        populateMajorsDropdown()
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Đã xảy ra lỗi khi lấy danh sách ngành học: " + error.message)
      })
  }

  // Hàm fetch danh sách sinh viên
  function fetchStudents() {
    fetch("/api/students")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi khi lấy danh sách sinh viên")
        }
        return response.json()
      })
      .then((data) => {
        students = data
        renderStudents(students)
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Đã xảy ra lỗi khi lấy danh sách sinh viên: " + error.message)
      })
  }

  // Hàm điền dữ liệu vào dropdown ngành học
  function populateMajorsDropdown() {
    majorSelect.innerHTML = '<option value="">-- Chọn ngành học --</option>'

    majors.forEach((major) => {
      const option = document.createElement("option")
      option.value = major.name
      option.textContent = `${major.name} (${major.department})`
      majorSelect.appendChild(option)
    })
  }

  // Hàm render danh sách sinh viên
  function renderStudents(studentsData) {
    // Tính toán phân trang
    const totalPages = Math.ceil(studentsData.length / itemsPerPage)
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginatedStudents = studentsData.slice(start, end)

    // Xóa dữ liệu cũ
    studentsList.innerHTML = ""

    // Nếu không có sinh viên
    if (paginatedStudents.length === 0) {
      const emptyRow = document.createElement("tr")
      emptyRow.innerHTML = `<td colspan="7" style="text-align: center;">Không có dữ liệu sinh viên</td>`
      studentsList.appendChild(emptyRow)
      pagination.innerHTML = ""
      return
    }

    // Render dữ liệu sinh viên
    paginatedStudents.forEach((student) => {
      const row = document.createElement("tr")

      row.innerHTML = `
                <td>${student.student_id}</td>
                <td>${student.full_name}</td>
                <td>${student.gender}</td>
                <td>${student.major}</td>
                <td>${student.class_name}</td>
                <td>${student.gpa || "N/A"}</td>
                <td class="action-buttons">
                    <button class="view-btn" data-id="${student.id}">Xem</button>
                    <button class="edit-btn" data-id="${student.id}">Sửa</button>
                    <button class="delete-btn" data-id="${student.id}">Xóa</button>
                </td>
            `

      studentsList.appendChild(row)
    })

    // Thêm event listeners cho các nút
    addActionButtonListeners()

    // Render phân trang
    renderPagination(totalPages)
  }

  // Hàm render phân trang
  function renderPagination(totalPages) {
    pagination.innerHTML = ""

    if (totalPages <= 1) return

    // Nút Previous
    const prevButton = document.createElement("button")
    prevButton.textContent = "Trước"
    prevButton.disabled = currentPage === 1
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        renderStudents(students)
      }
    })
    pagination.appendChild(prevButton)

    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button")
      pageButton.textContent = i
      pageButton.classList.toggle("active", i === currentPage)
      pageButton.addEventListener("click", () => {
        currentPage = i
        renderStudents(students)
      })
      pagination.appendChild(pageButton)
    }

    // Nút Next
    const nextButton = document.createElement("button")
    nextButton.textContent = "Sau"
    nextButton.disabled = currentPage === totalPages
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++
        renderStudents(students)
      }
    })
    pagination.appendChild(nextButton)
  }

  // Hàm thêm event listeners cho các nút hành động
  function addActionButtonListeners() {
    // Nút Xem chi tiết
    document.querySelectorAll(".view-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const studentId = this.getAttribute("data-id")
        viewStudentDetails(studentId)
      })
    })

    // Nút Sửa
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const studentId = this.getAttribute("data-id")
        editStudent(studentId)
      })
    })

    // Nút Xóa
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const studentId = this.getAttribute("data-id")
        deleteStudent(studentId)
      })
    })
  }

  // Hàm xem chi tiết sinh viên
  function viewStudentDetails(studentId) {
    fetch(`/api/students/${studentId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi khi lấy thông tin sinh viên")
        }
        return response.json()
      })
      .then((student) => {
        const detailContent = document.getElementById("student-detail-content")

        detailContent.innerHTML = `
                <div class="student-details">
                    <p><strong>Mã sinh viên:</strong> ${student.student_id}</p>
                    <p><strong>Họ và tên:</strong> ${student.full_name}</p>
                    <p><strong>Giới tính:</strong> ${student.gender}</p>
                    <p><strong>Email:</strong> ${student.email}</p>
                    <p><strong>Số điện thoại:</strong> ${student.phone}</p>
                    <p><strong>Địa chỉ:</strong> ${student.address}</p>
                    <p><strong>Ngành học:</strong> ${student.major}</p>
                    <p><strong>Lớp:</strong> ${student.class_name}</p>
                    <p><strong>Năm nhập học:</strong> ${student.enrollment_year}</p>
                    <p><strong>Điểm trung bình:</strong> ${student.gpa || "Chưa có"}</p>
                </div>
            `

        studentDetailModal.style.display = "block"
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Đã xảy ra lỗi: " + error.message)
      })
  }

  // Hàm chỉnh sửa sinh viên
  function editStudent(studentId) {
    fetch(`/api/students/${studentId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi khi lấy thông tin sinh viên")
        }
        return response.json()
      })
      .then((student) => {
        const editForm = document.getElementById("edit-student-form")

        editForm.innerHTML = `
                <input type="hidden" name="id" value="${student.id}">
                
                <div class="form-group">
                    <label for="edit_student_id">Mã sinh viên:</label>
                    <input type="text" id="edit_student_id" name="student_id" value="${student.student_id}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit_full_name">Họ và tên:</label>
                    <input type="text" id="edit_full_name" name="full_name" value="${student.full_name}" required>
                </div>
                
                <div class="form-group">
                    <label>Giới tính:</label>
                    <div class="radio-group">
                        <input type="radio" id="edit_male" name="gender" value="Nam" ${student.gender === "Nam" ? "checked" : ""} required>
                        <label for="edit_male">Nam</label>
                        
                        <input type="radio" id="edit_female" name="gender" value="Nữ" ${student.gender === "Nữ" ? "checked" : ""}>
                        <label for="edit_female">Nữ</label>
                        
                        <input type="radio" id="edit_other" name="gender" value="Khác" ${student.gender === "Khác" ? "checked" : ""}>
                        <label for="edit_other">Khác</label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="edit_email">Email:</label>
                    <input type="email" id="edit_email" name="email" value="${student.email}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit_phone">Số điện thoại:</label>
                    <input type="tel" id="edit_phone" name="phone" value="${student.phone}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit_address">Địa chỉ:</label>
                    <textarea id="edit_address" name="address" required>${student.address}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="edit_major">Ngành học:</label>
                    <select id="edit_major" name="major" required>
                        <option value="">-- Chọn ngành học --</option>
                        ${majors.map((major) => `<option value="${major.name}" ${student.major === major.name ? "selected" : ""}>${major.name} (${major.department})</option>`).join("")}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit_class_name">Lớp:</label>
                    <input type="text" id="edit_class_name" name="class_name" value="${student.class_name}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit_enrollment_year">Năm nhập học:</label>
                    <input type="number" id="edit_enrollment_year" name="enrollment_year" min="2000" max="2030" value="${student.enrollment_year}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit_gpa">Điểm trung bình:</label>
                    <input type="number" id="edit_gpa" name="gpa" min="0" max="4" step="0.01" value="${student.gpa || ""}">
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Cập nhật</button>
                    <button type="button" class="btn btn-secondary close-modal">Hủy</button>
                </div>
            `

        // Thêm event listener cho form chỉnh sửa
        editForm.addEventListener("submit", function (e) {
          e.preventDefault()
          updateStudent(this)
        })

        // Thêm event listener cho nút hủy
        editForm.querySelector(".close-modal").addEventListener("click", () => {
          editStudentModal.style.display = "none"
        })

        editStudentModal.style.display = "block"
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Đã xảy ra lỗi: " + error.message)
      })
  }

  // Hàm cập nhật thông tin sinh viên
  function updateStudent(form) {
    const formData = new FormData(form)
    const studentData = {}
    const studentId = formData.get("id")

    formData.forEach((value, key) => {
      if (key !== "id") {
        studentData[key] = value
      }
    })

    console.log("Dữ liệu cập nhật:", studentData) // Debug: Kiểm tra dữ liệu cập nhật

    fetch(`/api/students/${studentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || "Lỗi khi cập nhật sinh viên")
          })
        }
        return response.json()
      })
      .then((data) => {
        alert("Cập nhật sinh viên thành công!")
        editStudentModal.style.display = "none"
        fetchStudents() // Cập nhật lại danh sách sinh viên
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Đã xảy ra lỗi: " + error.message)
      })
  }

  // Hàm xóa sinh viên
  function deleteStudent(studentId) {
    if (confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      fetch(`/api/students/${studentId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Lỗi khi xóa sinh viên")
          }
          return response.json()
        })
        .then((data) => {
          alert("Xóa sinh viên thành công!")
          fetchStudents() // Cập nhật lại danh sách sinh viên
        })
        .catch((error) => {
          console.error("Error:", error)
          alert("Đã xảy ra lỗi: " + error.message)
        })
    }
  }
})
