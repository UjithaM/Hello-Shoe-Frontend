$(document).ready(function() {
    accessoriesButtonsHandle(false);
    $("#addAccessoriesButton").click(function (e) {
        $("#accessoriesSaveButton").show();
        $("#accessoriesUpdateButton").hide();
        $("#accessoriesDeleteButton").hide();
        $("#accessoriesCodeFiled").hide();
        getSuppliersAndSetSupplierName()
    })

    let base64StringAccessoriesImage = '';

    $('#accessoriesPicture').on('change', function() {
        const file = this.files[0];
        if (file) {
            toBase64(file).then(result => {
                base64StringAccessoriesImage = result
                $("#accessoriesImagePrv").attr("src", result).show();
            }).catch(error => {
                console.error('Error converting to Base64:', error);
            });
        }
    });

    $("#accessoriesSaveButton").click(function (e) {
        const accessoriesDescription = $("#accessoriesDescription").val();
        const accessoriesPicture = base64StringAccessoriesImage;
        const accessoriesUnitPriceSell = $("#accessoriesUnitPriceSell").val();
        const accessoriesUnitPriceBuy = $("#accessoriesUnitPriceBuy").val();
        const accessoriesExpectedProfit = $("#accessoriesExpectedProfit").val();
        const accessoriesProfitMargin = $("#accessoriesProfitMargin").val();
        const accessoriesQuantity = $("#accessoriesQuantity").val();
        const accessoriesVerities = $("#accessoriesVerities").val();
        const accessoriesSupplierCode = $("#accessoriesSupplierCode").val();

        const accessoriesDTO = new AccessoriesDTO(
            0,
            accessoriesDescription,
            accessoriesPicture,
            accessoriesUnitPriceSell,
            accessoriesUnitPriceBuy,
            accessoriesExpectedProfit,
            accessoriesProfitMargin,
            accessoriesQuantity,
            accessoriesVerities,
            accessoriesSupplierCode
        );
        console.log(accessoriesDTO);
        saveAccessories(accessoriesDTO);
    });
    $('#accessoriesTableBody').on('click', 'tr', function() {
        var rowData = [];
        $("#accessoriesSaveButton").hide();
        $("#accessoriesUpdateButton").show();
        $("#accessoriesDeleteButton").show();
        $("#accessoriesCodeFiled").show();
        $(this).find('td').each(function() {
            rowData.push($(this).text());
        });

        searchAccessories(rowData[0]);
        $('#accessoriesModal').modal('show');
    });

    $("#accessoriesUpdateButton").click(function (e) {
        const accessoriesCode = $("#accessoriesCode").val();
        const accessoriesDescription = $("#accessoriesDescription").val();
        if (base64StringAccessoriesImage === '') {
            base64StringAccessoriesImage = $("#accessoriesImagePrv").attr("src");
        }
        const accessoriesPicture = base64StringAccessoriesImage;
        const accessoriesUnitPriceSell = $("#accessoriesUnitPriceSell").val();
        const accessoriesUnitPriceBuy = $("#accessoriesUnitPriceBuy").val();
        const accessoriesExpectedProfit = $("#accessoriesExpectedProfit").val();
        const accessoriesProfitMargin = $("#accessoriesProfitMargin").val();
        const accessoriesQuantity = $("#accessoriesQuantity").val();
        const accessoriesVerities = $("#accessoriesVerities").val();
        const accessoriesSupplierCode = $("#accessoriesSupplierCode").val();

        const accessoriesDTO = new AccessoriesDTO(
            accessoriesCode,
            accessoriesDescription,
            accessoriesPicture,
            accessoriesUnitPriceSell,
            accessoriesUnitPriceBuy,
            accessoriesExpectedProfit,
            accessoriesProfitMargin,
            accessoriesQuantity,
            accessoriesVerities,
            accessoriesSupplierCode
        );
        console.log(accessoriesDTO);
        updateAccessories(accessoriesDTO, accessoriesCode);
    });
    $('#accessoriesCloseButton').on('click', function() {
        clearAccessoriesFields()
    });
    $('#accessoriesDescription').on('input', function() {
        validateField($(this), namePattern);
    });


    $('#accessoriesUnitPriceSell').on('input', function() {
        validateField($(this), digitPattern);
    });

    $('#accessoriesUnitPriceBuy').on('input', function() {
        validateField($(this), digitPattern);
    });

    $('#accessoriesExpectedProfit').on('input', function() {
        validateField($(this), digitPattern);
    });

    $('#accessoriesProfitMargin').on('input', function() {
        validateField($(this), digitPattern);
    });

    $('#accessoriesQuantity').on('input', function() {
        validateField($(this), digitPattern);
    });


    $('#accessoriesForm').on('input', function() {
        if ($('#accessoriesDescription').hasClass('is-valid') &&
            $('#accessoriesUnitPriceSell').hasClass('is-valid') &&
            $('#accessoriesUnitPriceBuy').hasClass('is-valid') &&
            $('#accessoriesExpectedProfit').hasClass('is-valid') &&
            $('#accessoriesProfitMargin').hasClass('is-valid') &&
            $('#accessoriesQuantity').hasClass('is-valid') &&
            $('#accessoriesVerities').val() !== null &&
            $('#accessoriesSupplierCode').val() !== null &&
            $('#accessoriesPicture').val() !== ''){
            accessoriesButtonsHandle(true);
        } else {
            accessoriesButtonsHandle(false);
        }
    });
    $("#accessoriesDeleteButton").click(function (e) {
        Swal.fire({
            title: "Do you want to delete " + $("#accessoriesDescription").val() + "?",
            showDenyButton: true,
            showCancelButton: true,
            denyButtonText: `Delete`,
            confirmButtonText: "Don't  Delete",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Accessories is not deleted", "", "info");
            } else if (result.isDenied) {
                try {
                    const accessoriesCode = $("#accessoriesCode").val();
                    const refreshToken = localStorage.getItem('refreshToken');
                    $.ajax({
                        type: "DELETE",
                        url: "http://localhost:8080/helloShoes/api/v1/accessories/" + accessoriesCode,
                        headers: {
                            "Authorization": "Bearer " + refreshToken
                        },
                        contentType: "application/json",
                        success: function (response) {
                            Swal.fire({
                                title: "Success!",
                                text: "Accessories has been deleted successfully!",
                                icon: "success"
                            });
                            $("#accessoriesCloseButton").click();
                            loadAccessories();
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
});

function accessoriesButtonsHandle(enable) {
    $('#accessoriesSaveButton').prop('disabled', !enable);
}

async function saveAccessories(accessories) {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await $.ajax({
            type: "POST",
            url: "http://localhost:8080/helloShoes/api/v1/accessories",
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            data: JSON.stringify(accessories),
            contentType: "application/json"
        });
        Swal.fire({
            title: "Success!",
            text: response.accessoriesDescription + " has been saved successfully!",
            icon: "success"
        });
        $("#accessoriesCloseButton").click();
        loadAccessories();
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.responseText,
        });
    }
}
const loadAccessories = () => {
    const refreshToken = localStorage.getItem('refreshToken');

    $('#accessoriesTableBody').empty();
    $.ajax({
        type:"GET",
        url: "http://localhost:8080/helloShoes/api/v1/accessories",
        headers: {
            "Authorization": "Bearer " + refreshToken
        },
        contentType: "application/json",

        success: function (response) {

            console.log(response)
            response.map((accessories, index) => {
                console.log(accessories)
                addRowAccessory(accessories.accessoriesCode, accessories.accessoriesDescription, accessories.unitPriceSell, accessories.unitPriceBuy, accessories.quantity, accessories.accessoriesVerities, accessories.supplierCode)
            });

        },
        error: function (xhr, status, error) {
            console.error('Something Error');
        }
    });

};

function addRowAccessory(accessoriesCode, accessoriesDescription, unitPriceSell, unitPriceBuy, quantity, accessoriesVerities, supplierCode) {
    var newRow = $('<tr>');
    newRow.append($('<td>').text(accessoriesCode));
    newRow.append($('<td>').text(accessoriesDescription));
    newRow.append($('<td>').text(unitPriceSell));
    newRow.append($('<td>').text(unitPriceBuy));
    newRow.append($('<td>').text(quantity));
    newRow.append($('<td>').text(accessoriesVerities));
    newRow.append($('<td>').text(supplierCode));

    $('#accessoriesTableBody').append(newRow);
}

async function searchAccessories(accessoriesCode) {
    const refreshToken = localStorage.getItem('refreshToken');
    getSuppliersAndSetSupplierName();
    try {
        const response = await $.ajax({
            type: "GET",
            url: "http://localhost:8080/helloShoes/api/v1/accessories/" + accessoriesCode,
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            contentType: "application/json"
        });
        $("#accessoriesCode").val(response.accessoriesCode);
        $("#accessoriesDescription").val(response.accessoriesDescription);

        if (response.accessoriesPicture) {
            $("#accessoriesImagePrv").attr("src", response.accessoriesPicture).show();
        } else {
            $("#accessoriesImagePrv").hide();
        }

        $("#accessoriesUnitPriceSell").val(response.unitPriceSell);
        $("#accessoriesUnitPriceBuy").val(response.unitPriceBuy);
        $("#accessoriesExpectedProfit").val(response.expectedProfit);
        $("#accessoriesProfitMargin").val(response.profitMargin);
        $("#accessoriesQuantity").val(response.quantity);
        $("#accessoriesVerities").val(response.accessoriesVerities);
        $("#accessoriesSupplierCode").val(response.supplierCode);
    } catch (error) {
        console.error("Request failed:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Item not found!",
        });
    }

}

async function updateAccessories(Accessories, accessoriesCode) {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await $.ajax({
            type: "PUT",
            url: "http://localhost:8080/helloShoes/api/v1/accessories/" + accessoriesCode,
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            data: JSON.stringify(Accessories),
            contentType: "application/json"
        });
        $("#accessoriesCloseButton").click();
        loadAccessories();
        Swal.fire({
            title: "Success!",
            text: Accessories.accessoriesDescription + " has been update successfully!",
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

function clearAccessoriesFields() {
    $('#accessoriesImagePrv').attr('src', '').hide();
    $("#accessoriesForm").get(0).reset();
    $('#accessoriesForm').find('.is-invalid, .is-valid').removeClass('is-invalid is-valid');
    accessoriesButtonsHandle(false);
}

