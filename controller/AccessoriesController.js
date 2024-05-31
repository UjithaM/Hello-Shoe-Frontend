$(document).ready(function() {
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
        $("#itemCloseButton").click();
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