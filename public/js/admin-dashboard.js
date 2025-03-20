document.addEventListener("DOMContentLoaded", () => {

    const addCourseForm = document.getElementById("addCourseForm");
    const courseList = document.getElementById("courseList");
    const prerequisitesSelect = document.getElementById("prerequisites");
    const AddCourses = document.getElementById("AddCourses");
    const generateReportButton = document.getElementById("generateReport");

    generateReportButton.addEventListener("click", fetchReports);

    // Register Student as Admin
    document.getElementById("registerStudentForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Clicked");
        const rollNumber = document.getElementById("rollNumber").value;

        console.log(rollNumber);

        const selectedOptions = Array.from(AddCourses.selectedOptions);
        const Courses = selectedOptions.map(option => option.value);

        console.log(Courses);

        if (Courses.length === 0) {
            alert("Please select at least one course.");
            return;
        }

        try {
            const courseData = Courses.length === 1 ? Courses[0] : Courses;
            const response = await fetch("http://localhost:5000/admin/registerStudent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rollNumber, courseData }),
            });
            console.log({ rollNumber, courseData })

            const data = await response.json();
            alert(data.msg);
            fetchStudents();
        } catch (error) {
            console.error("Error registering student:", error);
        }
    });

    // To fetch courses for dropdowns
    function fetchCourses() {
        fetch("http://localhost:5000/admin/getCourse")
            .then(response => response.json())
            .then(courses => {
                courseList.innerHTML = "";
                prerequisitesSelect.innerHTML = '<option value="">Select prerequisite courses</option>';
                AddCourses.innerHTML = '<option value="">Select courses</option>';

                courses.forEach(course => {
                    const li = document.createElement("li");
                    li.textContent = `${course.name} - ${course.department} (${course.level})`;

                    const buttonContainer = document.createElement("div");
                    buttonContainer.className = "button-container";

                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.onclick = () => deleteCourse(course._id);
                    buttonContainer.appendChild(deleteButton);

                    const updateButton = document.createElement("button");
                    updateButton.textContent = "Update";
                    updateButton.onclick = () => showUpdateForm(course);
                    buttonContainer.appendChild(updateButton);

                    const adjustSeatsButton = document.createElement("button");
                    adjustSeatsButton.textContent = "Adjust Seats";
                    adjustSeatsButton.onclick = () => showAdjustSeatsForm(course);
                    buttonContainer.appendChild(adjustSeatsButton);

                    li.appendChild(buttonContainer);
                    courseList.appendChild(li);

                    const prerequisiteOption = document.createElement("option");
                    prerequisiteOption.value = course._id;
                    prerequisiteOption.textContent = course.name;
                    prerequisitesSelect.appendChild(prerequisiteOption);

                    const addCoursesOption = document.createElement("option");
                    addCoursesOption.value = course._id;
                    addCoursesOption.textContent = course.name;
                    AddCourses.appendChild(addCoursesOption);
                });
            })
            .catch(error => console.error("Error fetching courses:", error));
    }

    fetchCourses();

    // Dynamic Course Form
    addCourseForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const department = document.getElementById("department").value;
        const level = document.getElementById("level").value;
        const time = document.getElementById("time").value;
        const days = document.getElementById("days").value;
        const seats = document.getElementById("seats").value;

        const selectedOptions = Array.from(prerequisitesSelect.selectedOptions);
        const prerequisites = selectedOptions.map(option => option.value);

        fetch("http://localhost:5000/admin/addCourse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                department,
                level,
                time,
                days,
                seats: Number(seats),
                prerequisites,
            }),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.msg);
                fetchCourses();
            })
            .catch(error => console.error("Error adding course:", error));
    });

    // Delete Course
    function deleteCourse(courseId) {
        if (confirm("Are you sure you want to delete this course?")) {
            fetch(`http://localhost:5000/admin/deleteCourse/${courseId}`, {
                method: "DELETE",
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.msg);
                    fetchCourses();
                })
                .catch(error => console.error("Error deleting course:", error));
        }
    }

    // Show Update Form
    function showUpdateForm(course) {
        const updateForm = document.createElement("form");
        updateForm.id = "updateCourseForm";
        updateForm.innerHTML = `
          <label for="update-name">Course Name:</label>
          <input type="text" id="update-name" name="name" value="${course.name}" required>
          <label for="update-department">Department:</label>
          <input type="text" id="update-department" name="department" value="${course.department}" required>
          <label for="update-level">Level:</label>
          <input type="text" id="update-level" name="level" value="${course.level}" required>
          <label for="update-time">Time:</label>
          <input type="text" id="update-time" name="time" value="${course.time}" required>
          <label for="update-days">Days:</label>
          <input type="text" id="update-days" name="days" value="${course.days}" required>
          <label for="update-seats">Seats:</label>
          <input type="number" id="update-seats" name="seats" value="${course.seats}" required>
          <button type="submit">Update Course</button>
        `;

        document.body.appendChild(updateForm);

        updateForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = document.getElementById("update-name").value;
            const department = document.getElementById("update-department").value;
            const level = document.getElementById("update-level").value;
            const time = document.getElementById("update-time").value;
            const days = document.getElementById("update-days").value;
            const seats = document.getElementById("update-seats").value;

            fetch(`http://localhost:5000/admin/updateCourse/${course._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    department,
                    level,
                    time,
                    days,
                    seats: Number(seats),
                }),
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.msg);
                    document.body.removeChild(updateForm);
                    fetchCourses();
                })
                .catch(error => console.error("Error updating course:", error));
        });
    }

    // To Fetch Students Data
    function fetchStudents() {
        fetch("http://localhost:5000/admin/getStudents")
            .then(response => response.json())
            .then(students => {
                studentList.innerHTML = "";
                students.forEach(student => {
                    const li = document.createElement("li");

                    li.textContent = `Roll Number: ${student.rollNumber}`;
                    studentList.appendChild(li);
                });
            })
            .catch(error => console.error("Error fetching students:", error));
    }
    fetchStudents();

    // Adjust Seats Form
    function showAdjustSeatsForm(course) {
        const adjustSeatsForm = document.createElement("form");
        adjustSeatsForm.id = "adjustSeatsForm";
        adjustSeatsForm.innerHTML = `
        <label for="seats">New Number of Seats:</label>
        <input type="number" id="seats" name="seats" value="${course.seats}" required>
        <button type="submit">Adjust Seats</button>
      `;

        document.body.appendChild(adjustSeatsForm);

        adjustSeatsForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const seats = document.getElementById("seats").value;

            fetch(`http://localhost:5000/admin/adjustSeats/${course._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ seats: Number(seats) }),
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.msg);
                    document.body.removeChild(adjustSeatsForm);
                    fetchCourses();
                })
                .catch(error => console.error("Error adjusting seats:", error));
        });
    }

    async function fetchReports() {
        console.log("Fetching reports...");

        try {
            const [reportsResponse, coursesResponse] = await Promise.all([
                fetch("http://localhost:5000/admin/getReports"),
                fetch("http://localhost:5000/admin/getCourse")
            ]);

            const reports = await reportsResponse.json();
            const courses = await coursesResponse.json();

            console.log("Full API Response:", reports);

            const reportDiv = document.getElementById("report");
            reportDiv.innerHTML = "";

            if (Array.isArray(reports.registeredStudents)) {
                const registeredStudentsList = document.createElement("ul");
                registeredStudentsList.innerHTML = "<h4>Registered Students</h4>";

                reports.registeredStudents.forEach(student => {
                    const li = document.createElement("li");
                    li.textContent = `Roll Number: ${student.rollNumber}`;
                    registeredStudentsList.appendChild(li);
                });

                reportDiv.appendChild(registeredStudentsList);
            } else {
                console.error("Invalid registeredStudents data:", reports.registeredStudents);
            }

            if (Array.isArray(reports.availableCourses)) {
                const availableCoursesList = document.createElement("ul");
                availableCoursesList.innerHTML = "<h4>Available Courses</h4>";

                reports.availableCourses.forEach(course => {
                    const li = document.createElement("li");
                    li.textContent = `${course.name} - ${course.department} (${course.level})`;
                    availableCoursesList.appendChild(li);
                });

                reportDiv.appendChild(availableCoursesList);
            } else {
                console.error("Invalid availableCourses data:", reports.availableCourses);
            }

            const studentsKey = reports.studentsWithoutPrerequisites
                ? "studentsWithoutPrerequisites"
                : "UnregisteredStudents";

            if (Array.isArray(reports[studentsKey])) {
                const studentsWithoutPrerequisitesList = document.createElement("ul");
                studentsWithoutPrerequisitesList.innerHTML = "<h4>Students Without Prerequisites</h4>";

                reports[studentsKey].forEach(student => {
                    const li = document.createElement("li");
                    li.textContent = `Roll Number: ${student.rollNumber}`;
                    studentsWithoutPrerequisitesList.appendChild(li);
                });

                reportDiv.appendChild(studentsWithoutPrerequisitesList);
            } else {
                console.error("Invalid studentsWithoutPrerequisites data:", reports[studentsKey]);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    }
});