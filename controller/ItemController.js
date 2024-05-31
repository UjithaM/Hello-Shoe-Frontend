$(document).ready(function() {
    // itemSaveButtonsHandle(false);
    $("#addItemButton").click(function (e) {
        $("#itemSaveButton").show();
        $("#itemUpdateButton").hide();
        $("#itemDeleteButton").hide();
        $("#itemCodeField").hide();
        getSuppliersAndSetSupplierName()
    })

    let base64StringItemImage = '';

    $('#itemPicture').on('change', function() {
        const file = this.files[0];
        if (file) {
            toBase64(file).then(result => {
                base64StringItemImage = result
                $("#itemPicturePreview").attr("src", result).show();
            }).catch(error => {
                console.error('Error converting to Base64:', error);
            });
        }
    });
    $('#itemLink').click(async function () {
        loadItem()
    })

    $("#itemSaveButton").click(function (e) {
        const itemDescription = $("#itemDescription").val();
        const itemPicture = base64StringItemImage;
        const itemCategory = $("#itemCategory").val();
        const itemSize = $("#itemSize").val();
        const unitPriceSell = $("#unitPriceSell").val();
        const unitPriceBuy = $("#unitPriceBuy").val();
        const expectedProfit = $("#expectedProfit").val();
        const profitMargin = $("#profitMargin").val();
        const quantity = $("#quantity").val();
        const itemStatus = $("#itemStatus").val();
        const occasion = $("#occasion").val();
        const verities = $("#verities").val();
        const gender = $("#gender").val();
        const itemSupplierCode = $("#itemSupplierCode").val();
        
        const itemDTO = new ItemDTO(
            0,
            itemDescription,
            itemPicture,
            itemCategory,
            itemSize,
            unitPriceSell,
            unitPriceBuy,
            expectedProfit,
            profitMargin,
            quantity,
            itemStatus,
            occasion,
            verities,
            gender,
            itemSupplierCode
        );
        console.log(itemDTO);
        saveItem(itemDTO);
    });
    $('#itemTableBody').on('click', 'tr', function() {
        var rowData = [];
        $("#itemSaveButton").hide();
        $("#itemUpdateButton").show();
        $("#itemDeleteButton").show();
        $("#itemCodeField").show();
        $(this).find('td').each(function() {
            rowData.push($(this).text());
        });

        searchItem(rowData[0]);
        $('#itemModal').modal('show');
    });

});
function itemSaveButtonsHandle(status) {
    if (status) {
        $("#itemSaveButton").removeClass('disabled');
    }else {
        $("#itemSaveButton").addClass('disabled');
    }
}
async function saveItem(item) {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await $.ajax({
            type: "POST",
            url: "http://localhost:8080/helloShoes/api/v1/item",
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            data: JSON.stringify(item),
            contentType: "application/json"
        });
        Swal.fire({
            title: "Success!",
            text: response.itemDescription + " has been saved successfully!",
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
async function getSuppliersAndSetSupplierName() {
    const refreshToken = localStorage.getItem('refreshToken');
    $.ajax({
        url: 'http://localhost:8080/helloShoes/api/v1/supplier',
        type: 'GET',
        headers: {
            "Authorization": "Bearer " + refreshToken
        },
        success: function(data) {
            $('#itemSupplierCode').empty();

            $('#itemSupplierCode').append('<option selected disabled value="">Choose...</option>');

            data.forEach(function(supplier) {
                $('#itemSupplierCode').append('<option value="' + supplier.supplierCode + '">' + supplier.supplierCode + '</option>');
            });

            $('#itemSupplierCode').change(function() {
                if (data === null || data.length === 0) {
                    getSuppliersAndSetSupplierName();
                }
                var selectedSupplierCode = $(this).val();
                var selectedSupplierName = "";

                data.forEach(function(supplier) {

                    if (supplier.supplierCode === selectedSupplierCode) {
                        selectedSupplierName = supplier.name;
                        return false;
                    }
                });

                // Set the supplier name input field
                $('#itemSupplierName').val(selectedSupplierName);
            });
            $('#itemSupplierCode').on('click', function() {
                if (data === null || data.length === 0) {
                    getSuppliersAndSetSupplierName();
                }
                var selectedSupplierCode = $(this).val();
                var selectedSupplierName = "";

                data.forEach(function(supplier) {

                    if (supplier.supplierCode === selectedSupplierCode) {
                        selectedSupplierName = supplier.name;
                        return false;
                    }
                });

                // Set the supplier name input field
                $('#itemSupplierName').val(selectedSupplierName);
            });
        },
        error: function(xhr, status, error) {
            console.error('Failed to fetch suppliers:', error);
        }
    });
}

const loadItem = () => {
    const refreshToken = localStorage.getItem('refreshToken');

    $('#itemTableBody').empty();
    $.ajax({
        type:"GET",
        url: "http://localhost:8080/helloShoes/api/v1/item",
        headers: {
            "Authorization": "Bearer " + refreshToken
        },
        contentType: "application/json",

        success: function (response) {

            console.log(response)
            response.map((item, index) => {
                console.log(item)
                addRowItem(item.itemCode, item.itemDescription, item.itemCategory, item.size, item.unitPriceSell, item.unitPriceBuy, item.quantity, item.itemStatus, item.supplierCode);
            });

        },
        error: function (xhr, status, error) {
            console.error('Something Error');
        }
    });
};
function addRowItem(itemCode, itemDescription, itemCategory, size, unitPriceSell, unitPriceBuy, quantity, itemStatus, supplierCode) {
    var newRow = $('<tr>');
    newRow.append($('<td>').text(itemCode));
    newRow.append($('<td>').text(itemDescription));
    newRow.append($('<td>').text(itemCategory));
    newRow.append($('<td>').text(size));
    newRow.append($('<td>').text(unitPriceSell));
    newRow.append($('<td>').text(unitPriceBuy));
    newRow.append($('<td>').text(quantity));
    newRow.append($('<td>').text(itemStatus));
    newRow.append($('<td>').text(supplierCode));

    $('#itemTableBody').append(newRow);
}
async function searchItem(itemId) {
    const refreshToken = localStorage.getItem('refreshToken');
    getSuppliersAndSetSupplierName();
    try {
        const response = await $.ajax({
            type: "GET",
            url: "http://localhost:8080/helloShoes/api/v1/item/" + itemId,
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            contentType: "application/json"
        });
        $("#itemCode").val(response.itemCode);
        $("#itemDescription").val(response.itemDescription);

        if (response.itemPicture) {
            $("#itemPicturePreview").attr("src", response.itemPicture).show();
        } else {
            $("#itemPicturePreview").hide();
        }

        $("#itemCategory").val(response.itemCategory);
        $("#itemSize").val(response.size);
        $("#unitPriceSell").val(response.unitPriceSell);
        $("#unitPriceBuy").val(response.unitPriceBuy);
        $("#expectedProfit").val(response.expectedProfit);
        $("#profitMargin").val(response.profitMargin);
        $("#quantity").val(response.quantity);
        $("#itemStatus").val(response.itemStatus);
        $("#occasion").val(response.occasion);
        $("#verities").val(response.verities);
        $("#gender").val(response.gender);
        $("#itemSupplierCode").val(response.supplierCode);
    } catch (error) {
        console.error("Request failed:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Item not found!",
        });
    }
}

