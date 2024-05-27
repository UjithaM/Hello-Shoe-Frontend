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
            url: "http://localhost:8080/api/v1/employee",
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            data: JSON.stringify(employee),
            contentType: "application/json"
        });
        $("#customerFoamCloseButton").click();
        Swal.fire({
            title: "Success!",
            text: response.name + " has been saved successfully!",
            icon: "success"
        });
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.responseText,
        });
    }
}
