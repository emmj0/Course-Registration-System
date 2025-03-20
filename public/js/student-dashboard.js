document.addEventListener("DOMContentLoaded", () => {
    const registerCourseForm = document.getElementById("registerCourseForm");
    const courseSelect = document.getElementById("courseSelect");
    const courseList = document.getElementById("courseList");

    function fetchCourses() {
        fetch("http://localhost:5000/students/courses")
            .then(response => response.json())
            .then(courses => {
                courseSelect.innerHTML = '<option value="">Select a course</option>'; // Reset dropdown
                courseList.innerHTML = ""; // Clear existing course list

                courses.forEach(course => {
                    // Add courses to the dropdown
                    const option = document.createElement("option");
                    option.value = course._id; // Store ObjectId
                    option.textContent = course.name;
                    courseSelect.appendChild(option);

                    // Add courses to the displayed list
                    const li = document.createElement("li");
                    li.textContent = `${course.name} - ${course.department} (${course.level})`;
                    courseList.appendChild(li);
                });
            })
            .catch(error => console.error("Error fetching courses:", error));
    }

    // Call fetchCourses on page load
    fetchCourses();

    // Register Course Form Submission
    registerCourseForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const rollNumber = document.getElementById("rollNumber").value;
        const selectedCourseId = courseSelect.value;

        if (!selectedCourseId) {
            alert("Please select a course.");
            return;
        }

        fetch("http://localhost:5000/students/addCourse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                courseId: selectedCourseId,
                rollNumber: rollNumber,
            }),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.msg);
                fetchCourses(); // Refresh course list after registering
            })
            .catch(error => console.error("Error registering course:", error));
    });



});
// Function to fetch available courses and populate the dropdown
