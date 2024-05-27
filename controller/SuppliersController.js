$(document).ready(function() {
    supplierSaveButtonHandle(false);
    $("#addSupplierButton").click(function (e) {
        $("#supplierUpdateButton").hide();
        $("#supplierDeleteButton").hide();
        $("#supplierCodeField").hide();
    });
    $("#supplierSaveButton").click(function (e) {
        
        try {
            const supplierName = $("#supplierName").val();
            const supplierCategory = $('input[name="supplierCategory"]:checked').val();
            const supplierAddressNo = $("#supplierAddressNo").val();
            const supplierMainCity = $("#supplierMainCity").val();
            const supplierLane = $("#supplierLane").val();
            const supplierMainState = $("#supplierMainState").val();
            const supplierPostalCode = $("#supplierPostalCode").val();
            const supplierCountry = $("#SupplierCountry").val();
            const supplierMobileNumber = $("#supplierMobileNumber").val();
            const supplierLandLineNumber = $("#supplierLandlineNumber").val();
            const supplierEmail = $("#supplierEmail").val();

            const Supplier = new SupplierDTO(
                0, 
                supplierName, 
                supplierCategory, 
                supplierAddressNo, 
                supplierLane, 
                supplierMainCity, 
                supplierMainState, 
                supplierPostalCode, 
                supplierCountry, 
                supplierMobileNumber, 
                supplierLandLineNumber, 
                supplierEmail);
            console.log(Supplier);
            saveSupplier(Supplier);
        } catch (e) {
            console.log(e)
            alert("Error adding supplier");
        }
    });
  
    $('#supplierName').on('input', function() {
        validateField($(this), namePattern);
    });
    
    $('#supplierAddressNo').on('input', function() {
        validateField($(this), addressPattern);
        console.log()
        if ($('input[name="supplierCategory"]:checked').val() !== undefined) {
            $('input[name="supplierCategory"]').removeClass('is-invalid').addClass('is-valid');
        }else {
            $('input[name="supplierCategory"]').removeClass('is-valid').addClass('is-invalid');
        }
    });
    
    $('input[name="supplierCategory"]').change(function() {
        if ($('input[name="supplierCategory"]:checked').val() !== undefined) {
            $('input[name="supplierCategory"]').removeClass('is-invalid').addClass('is-valid');
        }else {
            $('input[name="supplierCategory"]').removeClass('is-valid').addClass('is-invalid');
        }
    });
    
    $('#supplierLane').on('input', function() {
        validateField($(this), addressPattern);
    });

    $('#supplierMainCity').on('input', function() {
        validateField($(this), cityPattern);
    });

    $('#supplierMainState').on('input', function() {
        validateField($(this), statePattern);
    });

    $('#supplierPostalCode').on('input', function() {
        validateField($(this), postalCodePattern);
    });

    $('#SupplierCountry').on('input', function() {
        validateField($(this), namePattern);
    });

    $('#supplierMobileNumber').on('input', function() {
        validateField($(this), phonePattern);
    });

    $('#supplierLandlineNumber').on('input', function() {
        validateField($(this), phonePattern);
    });

    $('#supplierEmail').on('input', function() {
        validateField($(this), emailPattern);
    });

    $('#supplierFoam').on('input', function() {
        console.log("input")
        if ($('#supplierName').hasClass('is-valid') &&
            $('#supplierAddressNo').hasClass('is-valid') &&
            $('#supplierLane').hasClass('is-valid') &&
            $('#supplierMainCity').hasClass('is-valid') &&
            $('#supplierMainState').hasClass('is-valid') &&
            $('#supplierPostalCode').hasClass('is-valid') &&
            $('#supplierMobileNumber').hasClass('is-valid') &&
            $('#supplierLandlineNumber').hasClass('is-valid') &&
            $('#supplierEmail').hasClass('is-valid') &&
            $('input[name="supplierCategory"]:checked').val() !== undefined ) {
            supplierSaveButtonHandle(true);
        }
    });
    
});
async function saveSupplier(supplier) {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/v1/supplier",
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            data: JSON.stringify(supplier),
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

function supplierSaveButtonHandle(status) {
    if (status) $("#supplierSaveButton").removeClass('disabled');
    else $("#supplierSaveButton").addClass('disabled');
}
