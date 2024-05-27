$(document).ready(function() {
    // $("#supplierSaveButton").addClass('disabled');
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