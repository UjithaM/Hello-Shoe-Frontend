$(document).ready(function() {
    employeeButtonsHandle(true);
    $("#addEmployeeButton").click(function (e) {
        $("#employeeSaveButton").show();
        $("#employeeUpdateButton").hide();
        $("#employeeDeleteButton").hide();
        $("#employeeCodeField").hide();
        clearSupplierFields();
    });

    let base64StringImage = '';

    $('#employeeProfilePicture').on('change', function() {
        const file = this.files[0];
        if (file) {
            toBase64(file).then(result => {
                base64StringImage = result
                $("#employeeProfilePicturePreview").attr("src", result).show();
            }).catch(error => {
                console.error('Error converting to Base64:', error);
            });
        }
    });
    
    $("#employeeSaveButton").click(function (e) {
        const employeeName = $("#employeeName").val();
        const employeeProfilePicture = base64StringImage;
        const employeeGender = $("#employeeGender").val();
        const employeeCivilStatus = $("#employeeCivilStatus").val();
        const employeeDesignation = $("#employeeDesignation").val();
        const employeeRole = $("#employeeRole").val();
        const employeeDob = $("#employeeDob").val();
        const employeeJoinedDate = $("#employeeJoinedDate").val();
        const employeeAttachedBranch = $("#employeeAttachedBranch").val();
        const employeeAddressNo = $("#employeeAddressNo").val();
        const employeeLane = $("#employeeLane").val();
        const employeeMainCity = $("#employeeMainCity").val();
        const employeeMainState = $("#employeeMainState").val();
        const employeePostalCode = $("#employeePostalCode").val();
        const employeeContactNumber = $("#employeeContactNumber").val();
        const employeeEmail = $("#employeeEmail").val();
        const employeeGuardianName = $("#employeeGuardianName").val();
        const employeeGuardianContact = $("#employeeGuardianContact").val();
        
        const employee = new EmployeeDTO(
            0,
            employeeName, 
            employeeProfilePicture, 
            employeeGender, 
            employeeCivilStatus, 
            employeeDesignation, 
            employeeRole, 
            employeeDob, 
            employeeJoinedDate, 
            employeeAttachedBranch, 
            employeeAddressNo, 
            employeeLane, 
            employeeMainCity, 
            employeeMainState, 
            employeePostalCode, 
            employeeContactNumber, 
            employeeEmail, 
            employeeGuardianName, 
            employeeGuardianContact);
        console.log(employee)
        saveEmployee(employee);
    });
    $('#employeeLink').click(async function () {
        loadEmployee();
    })
    $("#employeeUpdateButton").click(function (e) {
        const employeeCode = $("#employeeCode").val();
        const employeeName = $("#employeeName").val();
        const srcBase64 = $('#employeeProfilePicturePreview').attr('src');
        console.log(srcBase64)
        var employeeProfilePicture;
        if (srcBase64)
        employeeProfilePicture = srcBase64;
        else if (base64StringImage === undefined) {
            employeeProfilePicture = "";
        }else employeeProfilePicture = base64StringImage;
        const employeeGender = $("#employeeGender").val();
        const employeeCivilStatus = $("#employeeCivilStatus").val();
        const employeeDesignation = $("#employeeDesignation").val();
        const employeeRole = $("#employeeRole").val();
        const employeeDob = $("#employeeDob").val();
        const employeeJoinedDate = $("#employeeJoinedDate").val();
        const employeeAttachedBranch = $("#employeeAttachedBranch").val();
        const employeeAddressNo = $("#employeeAddressNo").val();
        const employeeLane = $("#employeeLane").val();
        const employeeMainCity = $("#employeeMainCity").val();
        const employeeMainState = $("#employeeMainState").val();
        const employeePostalCode = $("#employeePostalCode").val();
        const employeeContactNumber = $("#employeeContactNumber").val();
        const employeeEmail = $("#employeeEmail").val();
        const employeeGuardianName = $("#employeeGuardianName").val();
        const employeeGuardianContact = $("#employeeGuardianContact").val();

        const employee = new EmployeeDTO(
            employeeCode,
            employeeName,
            employeeProfilePicture,
            employeeGender,
            employeeCivilStatus,
            employeeDesignation,
            employeeRole,
            employeeDob,
            employeeJoinedDate,
            employeeAttachedBranch,
            employeeAddressNo,
            employeeLane,
            employeeMainCity,
            employeeMainState,
            employeePostalCode,
            employeeContactNumber,
            employeeEmail,
            employeeGuardianName,
            employeeGuardianContact);
        console.log(employee)
        updateEmployee(employee, employeeCode);
        $("#employeeCloseButton").click();
        loadEmployee();
        
    });
    
    $('#employeeTable tbody').on('click', 'tr', function() {
        var rowData = [];
        $("#employeeSaveButton").hide();
        $("#employeeUpdateButton").show();
        $("#employeeDeleteButton").show();
        $("#employeeCodeField").show();
        $(this).find('td').each(function() {
            rowData.push($(this).text());
        });

        searchEmployee(rowData[0]);
        $('#employeeModal').modal('show');
    });
    
    $("#employeeDeleteButton").click(function (e) {
        Swal.fire({
            title: "Do you want to delete " + $("#customerName").val() + "?",
            showDenyButton: true,
            showCancelButton: true,
            denyButtonText: `Delete`,
            confirmButtonText: "Don't  Delete",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Employee is not deleted", "", "info");
            } else if (result.isDenied) {
                try {
                    const employeeCode = $("#employeeCode").val();
                    const refreshToken = localStorage.getItem('refreshToken');
                    $.ajax({
                        type: "DELETE",
                        url: "http://localhost:8080/helloShoes/api/v1/employee/" + employeeCode,
                        headers: {
                            "Authorization": "Bearer " + refreshToken
                        },
                        contentType: "application/json",
                        success: function (response) {
                            Swal.fire({
                                title: "Success!",
                                text: "Employee has been deleted successfully!",
                                icon: "success"
                            });
                            $("#employeeCloseButton").click();
                            loadEmployee();
                        },
                        error: function (xhr, status, error) {
                            console.error('Something Error');
                        }
                    });
                }catch (error) {
                    console.error("Error creating Customer object:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error.responseText,
                    });
                }
            }
        });
    });
    $("#employeeCloseButton").on('click', function(e) {
        employeeClearFields();
    });

    // Attach event listeners for validation
    $('#employeeName').on('input', function() {
        employeeValidateField($(this), namePattern);
    });
    $('#employeeCivilStatus').on('input', function() {
        employeeValidateField($(this), namePattern);
    });
    $('#employeeDesignation').on('input', function() {
        employeeValidateField($(this), namePattern);
    });
    $('#employeeAttachedBranch').on('input', function() {
        employeeValidateField($(this), namePattern);
    });
    $('#employeeAddressNo').on('input', function() {
        employeeValidateField($(this), addressPattern); // Adjust pattern as necessary
    });
    $('#employeeLane').on('input', function() {
        employeeValidateField($(this), namePattern); // Adjust pattern as necessary
    });
    $('#employeeMainCity').on('input', function() {
        employeeValidateField($(this), cityPattern);
    });
    $('#employeeMainState').on('input', function() {
        employeeValidateField($(this), namePattern);
    });
    $('#employeePostalCode').on('input', function() {
        employeeValidateField($(this), postalCodePattern);
    });
    $('#employeeContactNumber').on('input', function() {
        employeeValidateField($(this), phonePattern);
    });
    $('#employeeEmail').on('input', function() {
        employeeValidateField($(this), emailPattern);
    });
    $('#employeeGuardianName').on('input', function() {
        employeeValidateField($(this), namePattern);
    });
    $('#employeeGuardianContact').on('input', function() {
        employeeValidateField($(this), phonePattern);
    });
    $('#employeeFoam').on('input', function() {
        if ($('#employeeName').hasClass('is-valid') &&
            $('#employeeCivilStatus').hasClass('is-valid') &&
            $('#employeeDesignation').hasClass('is-valid') &&
            $('#employeeAttachedBranch').hasClass('is-valid') &&
            $('#employeeAddressNo').hasClass('is-valid') &&
            $('#employeeLane').hasClass('is-valid') &&
            $('#employeeMainCity').hasClass('is-valid') &&
            $('#employeeMainState').hasClass('is-valid') &&
            $('#employeePostalCode').hasClass('is-valid') &&
            $('#employeeContactNumber').hasClass('is-valid') &&
            $('#employeeEmail').hasClass('is-valid') &&
            $('#employeeGuardianName').hasClass('is-valid') &&
            $('#employeeGuardianContact').hasClass('is-valid') &&
            $('#employeeProfilePicture').val() !== '' && 
            $('#employeeDob').val() !== '' && 
            $('#employeeJoinedDate').val() !== '' &&
            $('#employeeRole').val() !== '' &&
            $('#employeeGender').val() !== '' ){
            employeeButtonsHandle(true);
        }else {
            employeeButtonsHandle(false);
            
        }
    });
});
function employeeButtonsHandle(status) {
    if (status) {
        $("#employeeSaveButton").removeClass('disabled');
    }else {
        $("#employeeSaveButton").addClass('disabled');
    }
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
async function saveEmployee(employee) {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await $.ajax({
            type: "POST",
            url: "http://localhost:8080/helloShoes/api/v1/employee",
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            data: JSON.stringify(employee),
            contentType: "application/json"
        });
        Swal.fire({
            title: "Success!",
            text: response.name + " has been saved successfully!",
            icon: "success"
        });
        $("#employeeCloseButton").click();
        loadEmployee();
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.responseText,
        });
    }
}
const loadEmployee = () => {
    const refreshToken = localStorage.getItem('refreshToken');

    $('#employeeTableBody').empty();
    $.ajax({
        type:"GET",
        url: "http://localhost:8080/helloShoes/api/v1/employee",
        headers: {
            "Authorization": "Bearer " + refreshToken
        },
        contentType: "application/json",

        success: function (response) {

            console.log(response)
            response.map((employee, index) => {
                
                addRowEmployee(employee.employeeCode, employee.name, employee.gender, employee.civilStatus, employee.designation, employee.role, formatDate(employee.dob), formatDate(employee.joinedDate), employee.attachedBranch, employee.mainCity, employee.contactNumber, employee.email, employee.guardianName, employee.guardianContact);
            });

        },
        error: function (xhr, status, error) {
            console.error('Something Error');
        }
    });
};
function addRowEmployee(employeeCode, name, gender, civilStatus, designation, role, dob, joinedDate, attachedBranch, mainCity, contactNumber, email, guardianName, guardianContact) {
    var newRow = $('<tr>');
    newRow.append($('<td>').text(employeeCode));
    newRow.append($('<td>').text(name));
    newRow.append($('<td>').text(gender));
    newRow.append($('<td>').text(civilStatus));
    newRow.append($('<td>').text(designation));
    newRow.append($('<td>').text(role));
    newRow.append($('<td>').text(dob));
    newRow.append($('<td>').text(joinedDate));
    newRow.append($('<td>').text(attachedBranch));
    newRow.append($('<td>').text(mainCity));
    newRow.append($('<td>').text(contactNumber));
    newRow.append($('<td>').text(email));
    newRow.append($('<td>').text(guardianName));
    newRow.append($('<td>').text(guardianContact));

    $('#employeeTableBody').append(newRow);
}

async function updateEmployee(employee, employeeId) {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await $.ajax({
            type: "PUT",
            url: "http://localhost:8080/helloShoes/api/v1/employee/" + employeeId,
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            data: JSON.stringify(employee),
            contentType: "application/json"
        });
        $("#supplierCloseButton").click();
        Swal.fire({
            title: "Success!",
            text: employee.name + " has been update successfully!",
            icon: "success"
        });
        loadEmployee();
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.responseText,
        });
    }
}
async function searchEmployee(employeeId) {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
        const response = await $.ajax({
            type: "GET",
            url: "http://localhost:8080/helloShoes/api/v1/employee/" + employeeId,
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            contentType: "application/json"
        });

        $("#employeeCode").val(response.employeeCode);
        $("#employeeName").val(response.name);

        if (response.profilePicture) {
            $("#employeeProfilePicturePreview").attr("src", response.profilePicture).show();
        } else {
            $("#employeeProfilePicturePreview").hide();
        }

        $("#employeeGender").val(response.gender);
        $("#employeeCivilStatus").val(response.civilStatus);
        $("#employeeDesignation").val(response.designation);
        $("#employeeRole").val(response.role);
        $("#employeeDob").val(formatDate(response.dob));
        $("#employeeJoinedDate").val(formatDate(response.joinedDate));
        $("#employeeAttachedBranch").val(response.attachedBranch);
        $("#employeeAddressNo").val(response.addressNo);
        $("#employeeLane").val(response.lane);
        $("#employeeMainCity").val(response.mainCity);
        $("#employeeMainState").val(response.mainState);
        $("#employeePostalCode").val(response.postalCode);
        $("#employeeContactNumber").val(response.contactNumber);
        $("#employeeEmail").val(response.email);
        $("#employeeGuardianName").val(response.guardianName);
        $("#employeeGuardianContact").val(response.guardianContact);

    } catch (error) {
        console.error("Request failed:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Employee not found!",
        });
    }
}

function employeeClearFields() {
    $('#employeeName').val('').removeClass('is-valid is-invalid');
    $('#employeeCivilStatus').val('').removeClass('is-valid is-invalid');
    $('#employeeDesignation').val('').removeClass('is-valid is-invalid');
    $('#employeeAttachedBranch').val('').removeClass('is-valid is-invalid');
    $('#employeeAddressNo').val('').removeClass('is-valid is-invalid');
    $('#employeeLane').val('').removeClass('is-valid is-invalid');
    $('#employeeMainCity').val('').removeClass('is-valid is-invalid');
    $('#employeeMainState').val('').removeClass('is-valid is-invalid');
    $('#employeePostalCode').val('').removeClass('is-valid is-invalid');
    $('#employeeContactNumber').val('').removeClass('is-valid is-invalid');
    $('#employeeEmail').val('').removeClass('is-valid is-invalid');
    $('#employeeGuardianName').val('').removeClass('is-valid is-invalid');
    $('#employeeGuardianContact').val('').removeClass('is-valid is-invalid');
    $('#employeeProfilePicture').val('').removeClass('is-valid is-invalid');
    $('#employeeDob').val('').removeClass('is-valid is-invalid');
    $('#employeeJoinedDate').val('').removeClass('is-valid is-invalid');
    $('#employeeRole').val('').removeClass('is-valid is-invalid');
    $('#employeeGender').val('').removeClass('is-valid is-invalid');
    $('#employeeProfilePicturePreview').attr('src', '').hide();
    employeeButtonsHandle(false);
}
function employeeValidateField($field, pattern) {
    const value = $field.val().trim();
    if (pattern.test(value)) {
        $field.removeClass('is-invalid').addClass('is-valid');
        $("#employeeUpdateButton").removeClass("disabled");
    } else {
        $field.removeClass('is-valid').addClass('is-invalid');
        $("#employeeUpdateButton").addClass("disabled");
    }
}