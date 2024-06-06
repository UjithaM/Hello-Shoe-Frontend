$(document).ready(function() {
    itemButtonsHandle(false);
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
    $('#inventoryLink').click(async function () {
        loadItem()
        loadAccessories()
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
    $("#itemUpdateButton").click(function (e) {
        const itemCode = $("#itemCode").val();
        const itemDescription = $("#itemDescription").val();
        if (base64StringItemImage === '') {
            base64StringItemImage = $("#itemPicturePreview").attr("src");
        }
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
            itemCode,
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
        updateItem(itemDTO, itemCode);
    });
    $("#itemDeleteButton").click(function (e) {
        Swal.fire({
            title: "Do you want to delete " + $("#itemDescription").val() + "?",
            showDenyButton: true,
            showCancelButton: true,
            denyButtonText: `Delete`,
            confirmButtonText: "Don't  Delete",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("item is not deleted", "", "info");
            } else if (result.isDenied) {
                try {
                    const employeeCode = $("#itemCode").val();
                    const refreshToken = localStorage.getItem('refreshToken');
                    $.ajax({
                        type: "DELETE",
                        url: "http://localhost:8080/helloShoes/api/v1/item/" + employeeCode,
                        headers: {
                            "Authorization": "Bearer " + refreshToken
                        },
                        contentType: "application/json",
                        success: function (response) {
                            Swal.fire({
                                title: "Success!",
                                text: "Item has been deleted successfully!",
                                icon: "success"
                            });
                            $("#itemCloseButton").click();
                            loadItem();
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

    $('#itemDescription').on('input', function() {
        validateField($(this), namePattern);
    });
    $('#itemCategory').on('input', function() {
        validateField($(this), namePattern);
    });
    $('#itemSize').on('input', function() {
        validateField($(this), digitPattern);
    });
    $('#unitPriceSell').on('input', function() {
        validateField($(this), digitPattern);
    });
    $('#unitPriceBuy').on('input', function() {
        validateField($(this), digitPattern);
    });
    $('#expectedProfit').on('input', function() {
        validateField($(this), digitPattern);
    });
    $('#profitMargin').on('input', function() {
        validateField($(this), digitPattern);
    });
    $('#quantity').on('input', function() {
        validateField($(this), digitPattern);
    });
    $('#itemStatus').on('input', function() {
        validateField($(this), namePattern);
    });

    $('#itemForm').on('input', function() {
        if ($('#itemDescription').hasClass('is-valid') &&
            $('#itemCategory').hasClass('is-valid') &&
            $('#itemSize').hasClass('is-valid') &&
            $('#unitPriceSell').hasClass('is-valid') &&
            $('#unitPriceBuy').hasClass('is-valid') &&
            $('#expectedProfit').hasClass('is-valid') &&
            $('#profitMargin').hasClass('is-valid') &&
            $('#quantity').hasClass('is-valid') &&
            $('#itemStatus').hasClass('is-valid') &&
            $('#itemPicture').val() !== '' &&
            $('#occasion').val() !== null &&
            $('#verities').val() !== null &&
            $('#gender').val() !== null &&
            $('#itemSupplierCode').val() !== null ) {
            itemButtonsHandle(true);
        } else {
            itemButtonsHandle(false);
        }
    });
    $('#itemCloseButton').on('click', function() {
        itemClearFields();
    });

    $('#sortSelector').on('change', function() {
        if ($(this).val() === 'price') {
            sortByPrice();
        } else if ($(this).val() === 'name') {
            sortByName();
        }else if ($(this).val() === 'gender') {
            sortByGender();
        } else if ($(this).val() === 'Occasion') {
            sortByOccasion();
        }
    });
});
function itemButtonsHandle(enable) {
    $('#itemSaveButton').prop('disabled', !enable);
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
        loadItem()
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
            $('#accessoriesSupplierCode').empty();


            $('#itemSupplierCode').append('<option selected disabled value="">Choose...</option>');
            $('#accessoriesSupplierCode').append('<option selected disabled value="">Choose...</option>');

            data.forEach(function(supplier) {
                $('#itemSupplierCode').append('<option value="' + supplier.supplierCode + '">' + supplier.supplierCode + '</option>');
                $('#accessoriesSupplierCode').append('<option value="' + supplier.supplierCode + '">' + supplier.supplierCode + '</option>');
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

            $('#accessoriesSupplierCode').change(function() {
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
                $('#accessoriesSupplierName').val(selectedSupplierName);
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
            $('#accessoriesSupplierCode').on('click', function() {
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
                $('#accessoriesSupplierName').val(selectedSupplierName);
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
        type: "GET",
        url: "http://localhost:8080/helloShoes/api/v1/item",
        headers: {
            "Authorization": "Bearer " + refreshToken
        },
        contentType: "application/json",

        success: function (response) {
            console.log(response);
            $('#itemTableBody').empty();
            response.map((item) => {
                addRowItem(
                    item.itemCode,
                    item.itemDescription,
                    item.size,
                    item.unitPriceSell,
                    item.quantity,
                    item.gender,
                    item.occasion,
                    item.itemStatus,
                    item.supplierCode
                );
            });
        },
        error: function (xhr, status, error) {
            console.error('Something went wrong');
        }
    });
};

function addRowItem(itemCode, itemDescription, size, price, quantity, gender, occasion, itemStatus, supplierCode) {
    var newRow = $('<tr>');
    newRow.append($('<td>').text(itemCode));
    newRow.append($('<td>').text(itemDescription));
    newRow.append($('<td>').text(size));
    newRow.append($('<td>').text(price));
    newRow.append($('<td>').text(quantity));
    newRow.append($('<td>').text(gender));
    newRow.append($('<td>').text(occasion));
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
async function updateItem(item, itemId) {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await $.ajax({
            type: "PUT",
            url: "http://localhost:8080/helloShoes/api/v1/item/" + itemId,
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            data: JSON.stringify(item),
            contentType: "application/json"
        });
        $("#itemCloseButton").click();
        loadItem()
        Swal.fire({
            title: "Success!",
            text: item.itemDescription + " has been update successfully!",
            icon: "success"
        });
        loadItem();
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.responseText,
        });
    }
}

function itemClearFields() {
    $("#itemForm").get(0).reset();
    $('#itemForm').find('.is-invalid, .is-valid').removeClass('is-invalid is-valid');
    $('#itemPicturePreview').attr('src', '').hide();
    itemButtonsHandle(false);
}

function sortByPrice() {
    const rows = $('#itemTableBody tr').get();
    rows.sort(function (a, b) {
        const A = parseFloat($(a).find('td').eq(3).text());
        const B = parseFloat($(b).find('td').eq(3).text());
        return A - B;
    });
    $.each(rows, function (index, row) {
        console.log(row);
        $('#itemTableBody').append(row);
    });
}


function sortByName() {
    const rows = $('#itemTableBody tr').get();
    rows.sort(function (a, b) {
        const A = $(a).find('td').eq(1).text().toUpperCase();
        const B = $(b).find('td').eq(1).text().toUpperCase();
        console.log(A, B);
        return (A < B) ? -1 : (A > B) ? 1 : 0;
    });
    $.each(rows, function (index, row) {
        $('#itemTableBody').append(row);
    });
}


function sortByGender() {
    const rows = $('#itemTableBody tr').get();
    rows.sort(function (a, b) {
        const A = $(a).find('td').eq(5).text().toUpperCase().includes("FEMALE") ? 1 : 0;
        const B = $(b).find('td').eq(5).text().toUpperCase().includes("FEMALE") ? 1 : 0;
        console.log(A, B);
        return B - A;
    });
    $.each(rows, function (index, row) {
        $('#itemTableBody').append(row);
    });
}

function sortByOccasion() {
    const rows = $('#itemTableBody tr').get();
    rows.sort(function (a, b) {
        const A = $(a).find('td').eq(6).text().toUpperCase().includes("CASUAL") ? 1 : 0;
        const B = $(b).find('td').eq(6).text().toUpperCase().includes("CASUAL") ? 1 : 0;
        console.log(A, B);
        return B - A;
    });
    $.each(rows, function (index, row) {
        $('#itemTableBody').append(row);
    });
}
