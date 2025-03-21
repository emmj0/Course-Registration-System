document.addEventListener("DOMContentLoaded", () => {
    const registerCourseForm = document.getElementById("registerCourseForm");
    const courseSelectRegister = document.getElementById("courseSelectRegister");
    const courseList = document.getElementById("courseList");
    const potentialScheduleList = document.getElementById("potentialScheduleList");
    const filterForm = document.getElementById("filterForm");

    function fetchCourses() {
        fetch("http://localhost:5000/students/courses")
            .then(response => response.json())
            .then(courses => {
                populateCourseSelect(courses);
                displayCourses(courses);
            })
            .catch(error => console.error("Error fetching courses:", error));
    }

    function populateCourseSelect(courses) {
        const courseSelectRegister = document.getElementById("courseSelectRegister");
        const courseSelectPrereq = document.getElementById("courseSelectPrereq");

        // Reset dropdowns
        courseSelectRegister.innerHTML = '<option value="">Select a course</option>';
        courseSelectPrereq.innerHTML = '<option value="">Select a course</option>';

        courses.forEach(course => {
            const option1 = document.createElement("option");
            option1.value = course._id; 
            option1.textContent = course.name;
            courseSelectRegister.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = course._id; 
            option2.textContent = course.name;
            courseSelectPrereq.appendChild(option2);
        });
    }

    function displayCourses(courses) {
        courseList.innerHTML = "";
        courses.forEach(course => {
            const li = document.createElement("li");
            li.textContent = `${course.name} - ${course.department} (${course.level})`;
            courseList.appendChild(li);
        });
    }

    function fetchPotentialSchedule() {
        const rollNumberFetch = document.getElementById("rollNumberFetch").value.trim();
        if (!rollNumberFetch) {
            alert("Please enter your roll number.");
            return;
        }

        fetch("http://localhost:5000/students/getPotentialSchedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rollNumber: rollNumberFetch,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Potential Schedule Data:", data);
            potentialScheduleList.innerHTML = ""; 
            data.forEach(course => {
                const li = document.createElement("li");
                li.textContent = `Course ID: ${course.courseId}, Days: ${course.days}, Time: ${course.time}`;
                potentialScheduleList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Error fetching potential schedule:", error);
            alert("Error fetching potential schedule. Please try again later.");
        });
    }

    function fetchFilteredCourses() {
        const department = document.getElementById("department").value;
        const level = document.getElementById("level").value;
        const time = document.getElementById("time").value;
        const days = document.getElementById("days").value;
        const openSeats = document.getElementById("openSeats").checked;

        fetch(`http://localhost:5000/students/filterCourses?department=${department}&level=${level}&time=${time}&days=${days}&openSeats=${openSeats}`)
            .then(response => response.json())
            .then(courses => {
                populateCourseSelect(courses);
                displayCourses(courses);
            })
            .catch(error => console.error("Error fetching filtered courses:", error));
    }

    function fetchCoursePrerequisites(courseId) {
        fetch(`http://localhost:5000/students/getCoursePrerequisites/${courseId}`)
            .then(response => response.json())
            .then(prerequisites => {
                const prerequisitesList = document.getElementById("prerequisitesList");
                prerequisitesList.innerHTML = ""; 

                if (prerequisites.length === 0) {
                    const li = document.createElement("li");
                    li.textContent = "No prerequisites";
                    prerequisitesList.appendChild(li);
                } else {
                    prerequisites.forEach(prerequisite => {
                        const li = document.createElement("li");
                        li.textContent = prerequisite.name;
                        prerequisitesList.appendChild(li);
                    });
                }
            })
            .catch(error => console.error("Error fetching course prerequisites:", error));
    }

    fetchCourses();

    if (registerCourseForm) {
        registerCourseForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const rollNumberInput = document.getElementById("rollNumber");
            if (!rollNumberInput) {
                console.error("Roll number input not found.");
                return;
            }

            const rollNumber = rollNumberInput.value;
            const selectedCourseId = courseSelectRegister.value;

            console.log("Roll Number:", rollNumber);
            console.log("Selected Course ID:", selectedCourseId);

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
                console.log("Server Response:", data);
                alert(data.msg);
                fetchCourses(); 
            })
            .catch(error => {
                console.error("Error registering course:", error);
                alert("Error registering course. Please try again later.");
            });
        });
    } else {
        console.error("registerCourseForm not found in the DOM.");
    }

    
    filterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        fetchFilteredCourses();
    });

    
    document.getElementById("fetchPrerequisitesButton").addEventListener("click", () => {
        const selectedCourseId = document.getElementById("courseSelectPrereq").value;
        if (!selectedCourseId) {
            alert("Please select a course.");
            return;
        }
        fetchCoursePrerequisites(selectedCourseId);
    });

    document.getElementById("fetchPotentialScheduleButton").addEventListener("click", () => {
        fetchPotentialSchedule();
    });
});