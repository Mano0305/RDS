var INSERT_API = "https://n7487fcgg4.execute-api.ap-northeast-1.amazonaws.com/Live/insert";
var GET_API = "https://n7487fcgg4.execute-api.ap-northeast-1.amazonaws.com/Live/get";

// Helper function to show messages
function showMessage(message, type) {
    const messageEl = document.getElementById("message");
    messageEl.textContent = message;
    messageEl.className = "message " + type;
    messageEl.style.display = "block";

    setTimeout(() => {
        messageEl.style.display = "none";
    }, 5000);
}

// Validate form
function validateForm() {
    const studentid = $('#studentid').val().trim();
    const name = $('#name').val().trim();
    const studentClass = $('#class').val().trim();
    const age = $('#age').val();

    if (!studentid) {
        showMessage("Please enter Student ID", "error");
        return false;
    }

    if (!name) {
        showMessage("Please enter Name", "error");
        return false;
    }

    if (!studentClass) {
        showMessage("Please enter Class", "error");
        return false;
    }

    if (!age || age < 5 || age > 100) {
        showMessage("Please enter a valid Age", "error");
        return false;
    }

    return true;
}

// Clear form
function clearForm() {
    $('#studentid').val('');
    $('#name').val('');
    $('#class').val('');
    $('#age').val('');
}

// Update student count
function updateStudentCount(count) {
    const countEl = document.getElementById("studentCount");
    countEl.textContent = count + (count === 1 ? " Student" : " Students");
}

// Loading state
function showLoading() {
    const tbody = document.getElementById("studentTableBody");

    tbody.innerHTML = `
        <tr>
            <td colspan="4" class="loading">
                Loading...
            </td>
        </tr>
    `;
}

// Empty state
function showEmptyState() {
    const tbody = document.getElementById("studentTableBody");

    tbody.innerHTML = `
        <tr>
            <td colspan="4">
                No Students Found
            </td>
        </tr>
    `;

    updateStudentCount(0);
}

/////////////////////////////////////////////////////
// SAVE STUDENT
/////////////////////////////////////////////////////

document.getElementById("savestudent").onclick = function () {

    if (!validateForm()) return;

    const saveBtn = document.getElementById("savestudent");

    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    var inputData = {
        "student_id": parseInt($('#studentid').val()),
        "name": $('#name').val().trim(),
        "class": $('#class').val().trim(),
        "age": parseInt($('#age').val())
    };

    $.ajax({

        url: INSERT_API,
        type: "POST",
        data: JSON.stringify(inputData),
        contentType: "application/json",

        success: function (response) {

            try {

                let res = typeof response === "string"
                    ? JSON.parse(response)
                    : response;

                let body = res.body
                    ? JSON.parse(res.body)
                    : res;

                showMessage(body.message || "Student Saved Successfully", "success");

                clearForm();

                setTimeout(function () {
                    document.getElementById("getstudents").click();
                }, 500);

            } catch (e) {

                console.log(e);

                showMessage("Student Saved Successfully", "success");

                clearForm();

            }

        },

        error: function (xhr, status, error) {

            console.log(xhr.responseText);

            showMessage("Error Saving Student", "error");

        },

        complete: function () {

            saveBtn.disabled = false;

            saveBtn.textContent = "💾 Save Student";

        }

    });

};

/////////////////////////////////////////////////////
// GET STUDENTS
/////////////////////////////////////////////////////

document.getElementById("getstudents").onclick = function () {

    const getBtn = document.getElementById("getstudents");

    getBtn.disabled = true;

    getBtn.textContent = "Loading...";

    showLoading();

    $.ajax({

        url: GET_API,

        type: "GET",

        success: function (response) {

            try {

                let res = typeof response === "string"
                    ? JSON.parse(response)
                    : response;

                let students = res.body
                    ? JSON.parse(res.body)
                    : res;

                if (!Array.isArray(students)) {

                    showMessage("Invalid Response", "error");

                    showEmptyState();

                    return;

                }

                const tbody = document.getElementById("studentTableBody");

                tbody.innerHTML = "";

                if (students.length == 0) {

                    showEmptyState();

                    return;

                }

                students.forEach(function (student) {

                    tbody.innerHTML += `
                        <tr>
                            <td>${student.student_id}</td>
                            <td>${student.name}</td>
                            <td>${student.class}</td>
                            <td>${student.age}</td>
                        </tr>
                    `;

                });

                updateStudentCount(students.length);

                showMessage("Students Loaded Successfully", "success");

            }

            catch (e) {

                console.log(e);

                showMessage("Parsing Error", "error");

                showEmptyState();

            }

        },

        error: function (xhr, status, error) {

            console.log(xhr.responseText);

            showMessage("Error Loading Students", "error");

            showEmptyState();

        },

        complete: function () {

            getBtn.disabled = false;

            getBtn.textContent = "📋 Load Students";

        }

    });

};

/////////////////////////////////////////////////////
// ENTER KEY SUPPORT
/////////////////////////////////////////////////////

$(document).keypress(function (e) {

    if (e.which == 13) {

        $("#savestudent").click();

    }

});