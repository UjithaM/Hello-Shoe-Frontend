$(document).ready(function() {
    supplierButtonsHandle(false);
    $("#addSupplierButton").click(function (e) {
        $("#supplierSaveButton").show();
        $("#supplierUpdateButton").hide();
        $("#supplierDeleteButton").hide();
        $("#supplierCodeField").hide();
        clearSupplierFields();
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

    $('#supplierLink').click(async function () {
        loadSuppliers();
    })
    
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
            supplierButtonsHandle(true);
        }
    });

    $('#supplierTable tbody').on('click', 'tr', function() {
        var rowData = [];
        $("#supplierSaveButton").hide();
        $("#supplierUpdateButton").show();
        $("#supplierDeleteButton").show();
        $("#supplierCodeField").show();
        $(this).find('td').each(function() {
            rowData.push($(this).text());
        });

        searchSupplier(rowData[0]);
        $('#supplierModel').modal('show');
    });
    
    $("#supplierUpdateButton").click(function (e) {
        try {
            const supplierCode = $("#supplierCode").val();
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
                supplierCode, 
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
            updateSupplier(Supplier, supplierCode);
        } catch (e) {
            console.log(e)
            alert("Error adding supplier");
        }
    });
    
    $("#supplierDeleteButton").click(function (e) {
        Swal.fire({
            title: "Do you want to delete " + $("#supplierName").val() + "?",
            showDenyButton: true,
            showCancelButton: true,
            denyButtonText: `Delete`,
            confirmButtonText: "Don't  Delete",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire("Supplier is not deleted", "", "info");
            } else if (result.isDenied) {
                try {
                    const supplierCode = $("#supplierCode").val();
                    const refreshToken = localStorage.getItem('refreshToken');
                    $.ajax({
                        type: "DELETE",
                        url: "http://localhost:8080/helloShoes/api/v1/supplier/" + supplierCode,
                        headers: {
                            "Authorization": "Bearer " + refreshToken
                        },
                        contentType: "application/json",
                        success: function (response) {
                            $("#supplierCloseButton").click();
                            Swal.fire({
                                title: "Success!",
                                text: "Supplier has been deleted successfully!",
                                icon: "success"
                            });
                            loadSuppliers();
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

    $("#supplierCloseButton").click(clearSupplierFields());
});
async function saveSupplier(supplier) {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await $.ajax({
            type: "POST",
            url: "http://localhost:8080/helloShoes/api/v1/supplier",
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
        loadSuppliers();
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.responseText,
        });
    }
}

function supplierButtonsHandle(status) {
    if (status) {
        $("#supplierSaveButton").removeClass('disabled');
    }else {
        $("#supplierSaveButton").addClass('disabled');
    }
}

const loadSuppliers = () => {
    const refreshToken = localStorage.getItem('refreshToken');

    $('#supplierTableBody').empty();
    $.ajax({
        type:"GET",
        url: "http://localhost:8080/helloShoes/api/v1/supplier",
        headers: {
            "Authorization": "Bearer " + refreshToken
        },
        contentType: "application/json",

        success: function (response) {


            response.map((supplier, index) => {

                addRowSupplier(supplier.supplierCode, supplier.name, supplier.category, supplier.country, supplier.mobileNumber, supplier.landlineNumber, supplier.email);
            });

        },
        error: function (xhr, status, error) {
            console.error('Something Error');
        }
    });
};

function addRowSupplier(supplierCode, supplierName, supplierCategory, supplierCountry, supplierMobile, supplierLandline, supplierEmail) {
    var newRow = $('<tr>');
    newRow.append($('<td>').text(supplierCode));
    newRow.append($('<td>').text(supplierName));
    newRow.append($('<td>').text(supplierCategory));
    newRow.append($('<td>').text(supplierCountry));
    newRow.append($('<td>').text(supplierMobile));
    newRow.append($('<td>').text(supplierLandline));
    newRow.append($('<td>').text(supplierEmail));

    $('#supplierTableBody').append(newRow);

}

async function searchSupplier(supplierId) {


    const refreshToken = localStorage.getItem('refreshToken');

    try {
        const response = await $.ajax({
            type: "GET",
            url: "http://localhost:8080/helloShoes/api/v1/supplier/" + supplierId,
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            contentType: "application/json"
        });
        $("#supplierCode").val(response.supplierCode);
        $("#supplierName").val(response.name);
        $('input[name="supplierCategory"][value="' + response.category + '"]').prop('checked', true);
        $("#supplierAddressNo").val(response.addressNo);
        $("#supplierMainCity").val(response.mainCity);
        $("#supplierLane").val(response.lane);
        $("#supplierMainState").val(response.mainState);
        $("#supplierPostalCode").val(response.postalCode);
        $("#SupplierCountry").val(response.country);
        $("#supplierMobileNumber").val(response.mobileNumber);
        $("#supplierLandlineNumber").val(response.landlineNumber);
        $("#supplierEmail").val(response.email);
    } catch (error) {
        console.error("Request failed:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Customer not found!",
        });
    }
}

async function updateSupplier(supplier, supplierId) {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await $.ajax({
            type: "PUT",
            url: "http://localhost:8080/helloShoes/api/v1/supplier/" + supplierId,
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            data: JSON.stringify(supplier),
            contentType: "application/json"
        });
        $("#supplierCloseButton").click();
        Swal.fire({
            title: "Success!",
            text: supplier.name + " has been update successfully!",
            icon: "success"
        });
        loadSuppliers();
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.responseText,
        });
    }
}

function clearSupplierFields() {
    console.log("Clearing fields");
    $("#supplierFoam").get(0).reset();
    supplierButtonsHandle(false);
}


