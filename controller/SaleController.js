$(document).ready(function () {
    'use strict';
    $('.cashPaymentDetails').hide();
    $("#placeOrder").on('click', function (e) {
        orderLoadCustomers();
    });
   
    $("#paymentMethod").on('change', function (e) {
        const paymentMethod = $(this).val();
        if (paymentMethod === 'CARD') {
            $('.cashPaymentDetails').hide();
        } else {
            $('.cashPaymentDetails').show();
        }
    });
   
    
    $('#orderItemCode').on('keyup', function (e) {
        const itemCode = $(this).val();
        if (itemCode.length > 7) {
            searchForItemId(itemCode);
        }
    });

    $('#orderItemQTY').on('keyup', function (e) {
        const itemQTY = parseInt($(this).val(), 10);
        const itemQTYStock = parseInt($('#orderItemStock').val(), 10);
        if (isNaN(itemQTY) || itemQTY > itemQTYStock || itemQTY === '') {
            $('#orderItemQTY').removeClass('is-valid').addClass('is-invalid');
        } else {
            $('#orderItemQTY').removeClass('is-invalid').addClass('is-valid');
        }
    });

    $('#addCartButton').on('click', function (e) {
        if (checkValid()) {
            const itemCode = $('#orderItemCode').val();
            const itemImage = $('#orderItemPrev').attr('src');
            const itemDescription = $('#orderItemDescription').val();
            const itemQTY = parseInt($('#orderItemQTY').val(), 10);
            const itemPrice = parseFloat($('#orderItemPrice').val());
            const itemTotal = itemQTY * itemPrice;

            const itemQTYStock = parseInt($('#orderItemStock').val(), 10);
            let itemExists = false;
            let enoughStock = true;

            $('#cartTableBody tr').each(function () {
                const currentItemCode = $(this).find('td:eq(1)').text();
                if (currentItemCode === itemCode) {
                    const currentQTY = parseInt($(this).find('td:eq(4)').text(), 10);
                    const newQTY = currentQTY + itemQTY;
                    if (newQTY <= itemQTYStock) {
                        $(this).find('td:eq(4)').text(newQTY);
                        $(this).find('td:eq(5)').text(newQTY * itemPrice);
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Not enough Stock!",
                        });
                        enoughStock = false;
                        return false; 
                    }
                    itemExists = true;
                }
            });

            if (!enoughStock) {
                return; 
            }

            if (!itemExists) {
                const row = '<tr>' +
                    '<td><img src="' + itemImage + '" alt="' + itemDescription + '" style="width:50px;height:50px;"></td>' +
                    '<td>' + itemCode + '</td>' +
                    '<td>' + itemDescription + '</td>' +
                    '<td>' + itemPrice + '</td>' +
                    '<td>' + itemQTY + '</td>' +
                    '<td>' + itemTotal + '</td>' +
                    '<td><button class="btn btn-danger btn-sm" id="removeRow">Remove</button></td>' +
                    '</tr>';
                $('#cartTableBody').append(row);
            }

            $('#orderItemCode').val('');
            $('#orderItemDescription').val('');
            $('#orderItemStock').val('');
            $('#orderItemQTY').val('');
            $('#orderItemQTY').val('').removeClass('is-valid');
            $('#orderItemPrice').val('');
            $('#orderItemPrev').hide();
            calculateNetTotal();
        }
    });


    $('#cartTableBody').on('click', '#removeRow', function () {
        $(this).closest('tr').remove();
        calculateNetTotal();
    });
});

function calculateNetTotal() {
    let netTotal = 0;
    $('#cartTableBody tr').each(function () {
        const itemTotalText = $(this).find('td:eq(5)').text();
        const itemTotal = parseFloat(itemTotalText);
        if (!isNaN(itemTotal)) {
            netTotal += itemTotal;
        }
    });

    $('#subtotal').text(netTotal.toFixed(2)); 
}


async function searchForItemId(itemCode) {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        const itemResponse = await $.ajax({
            type: "GET",
            url: "http://localhost:8080/helloShoes/api/v1/item/" + itemCode,
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            contentType: "application/json"
        });

    if (!validateItemCode(itemCode) && !validateAccessoryCode(itemCode)) {
        clearItemDetails();
        return;
    }

    const url = validateItemCode(itemCode)
        ? `http://localhost:8080/helloShoes/api/v1/item/${itemCode}`
        : `http://localhost:8080/helloShoes/api/v1/accessories/${itemCode}`;

    try {
        const response = await $.ajax({
            type: "GET",
            url: url,
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            contentType: "application/json"
        });

        updateItemDetails(response);
    } catch (e) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${validateItemCode(itemCode) ? 'Item' : 'Accessory'} not found!`
        });
        console.log(e);
        clearItemDetails();
    }
}

function updateItemDetails(response) {
    $('#orderItemDescription').val(response.itemDescription || response.accessoriesDescription);
    $("#orderItemPrev").attr("src", response.itemPicture || response.accessoriesPicture).show();
    $('#orderItemStock').val(response.quantity);
    $('#orderItemPrice').val(response.unitPriceSell);
}

function clearItemDetails() {
    $('#orderItemDescription').val("");
    $("#orderItemPrev").hide();
    $('#orderItemStock').val("");
    $('#orderItemPrice').val("");
}


function checkValid() {
    const itemQTY = parseInt($('#orderItemQTY').val(), 10);
    const itemStock = parseInt($('#orderItemStock').val(), 10);
    if (itemQTY && itemStock && itemQTY <= itemStock) {
        return true;
    }
    return false;
}

function orderLoadCustomers() {
    const refreshToken = localStorage.getItem('refreshToken');
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/helloShoes/api/v1/customer",
        headers: {
            "Authorization": "Bearer " + refreshToken
        },
        success: function(data) {
            $('#orderCustomerCode').empty();

            $('#orderCustomerCode').append('<option selected disabled value="">Choose...</option>');
            
            data.forEach(function(customer) {
                $('#orderCustomerCode').append('<option value="' + customer.customerCode + '">' + customer.customerCode + '</option>');
            });
            $('#orderCustomerCode').change(function() {
                if (data === null || data.length === 0) {
                    orderLoadCustomers();
                }
                var selectedCustomerCode = $(this).val();
                var selectedCustomerName = "";

                data.forEach(function(customer) {

                    if (customer.customerCode === selectedCustomerCode) {
                        selectedCustomerName = customer .name;
                        return false;
                    }
                });

                // Set the supplier name input field
                $('#orderCustomerName').val(selectedCustomerName);
            });
        }
    });
}

async function placeOrder() {
    const paymentMethod = $('#paymentMethod').val();
    const totalPrice = $('#subtotal').text();

}

function validateItemCode(itemCode) {
    var pattern = /^(M|W)\d+(F|C|I|S)(H|F|W|FF|SD|S|SL)\d{5}$/;

    return pattern.test(itemCode);
}

function validateAccessoryCode(accessoryCode) {
    var pattern = /^(SHMP|POLB|POLBR|POLDBR|SOF|SOH)\d{5}$/;

    return pattern.test(accessoryCode);
}