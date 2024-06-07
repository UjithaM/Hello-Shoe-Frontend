const cardNumberPattern = /^\d{13,19}$/;
const cardNamePattern = /^[a-zA-Z\s]+$/;
const expiryMonthPattern = /^(0?[1-9]|1[012])$/;
const expiryYearPattern = /^\d{2}$/;
const cvvPattern = /^\d{3,4}$/;
const zipPattern = /^\d{5,10}$/;

$(document).ready(function () {
    'use strict';
    $('.cashPaymentDetails').hide();
    addCartButtonHandle(false);
    $("#placeOrder").on('click', function (e) {
        orderLoadCustomers();
    });

    $('#salesLink').click(async function () {
        loadOrder();
    });
   
    $("#paymentMethod").on('change', function (e) {
        const paymentMethod = $(this).val();
        if (paymentMethod === 'CARD') {
            $('.cashPaymentDetails').hide();
            $('#cardModal').modal('show');
            $('#orderModal').modal('hide');

        } else {
            $('.cashPaymentDetails').show();
        }
    });

    $("#payNow").on('change', function (e) {

    });

    $('#customer_paid_btn').on('click', function (e) {
        const paidAmount = parseFloat($('#customer_paid_amount').val());
        const netTotal = parseFloat($('#subtotal').text());
        const balance = paidAmount - netTotal;
        if (balance < 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Insufficient amount!",
            });
        }else $('#balance').text(balance.toFixed(2));
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
        if (isNaN(itemQTY) || itemQTY > itemQTYStock || itemQTY === '' || itemQTY < 1) { 
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

    $('#checkOutButton').on('click', function (e) {
        const paymentMethod = $('#paymentMethod').val();
        const totalPrice = parseFloat($('#subtotal').text());
        let orderItems = [];
        let orderAccessories = [];
        const customerCode = $('#orderCustomerCode').val();
        const employeeCode = localStorage.getItem('employeeCode');

        $('#cartTableBody tr').each(function () {
            const itemCode = $(this).find('td:eq(1)').text();
            const quantity = parseInt($(this).find('td:eq(4)').text(), 10);
            if (validateItemCode(itemCode)) {
                const orderItemDTO = new OrderItemDTO(itemCode, quantity);
                orderItems.push(orderItemDTO);
            } else {
                const orderAccessoriesDTO = new OrderAccessoriesDTO(itemCode, quantity);
                orderAccessories.push(orderAccessoriesDTO);
            }
        });
        if (paymentMethod !== ''){
            if (orderItems.length !== 0 || orderAccessories.length !== 0) {
                  if (customerCode !== '') {
                      placeOrder();
                  }else {
                      $('#orderCustomerCode').removeClass('is-valid').addClass('is-invalid');
                      Swal.fire({
                          icon: "error",
                          title: "Oops...",
                          text: "Please select a customer!",
                      });
                  }
            }else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Please add an item to the cart!",
                });
            }
        }else {
            $('#paymentMethod').removeClass('is-valid').addClass('is-invalid');
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please select a payment method!",
            });
        }
        
        
    });

    $('#payNow').on('click', function (e) {
        Swal.fire({
            title: "Success!",
            text: "payment Successful !",
            icon: "success"
        });
        $('#orderModal').modal('show');
        $('#cardModal').modal('hide');
        $("#paymentForm").get(0).reset();
    });

    $('#payNow').addClass('disabled');

    $('#cardNumber').on('input', function() {
        validateField($(this), cardNumberPattern);
    });
    $('#paymentMethod').on('change', function() {
        if ($(this).val() !== '') {
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });
    $('#orderCustomerCode').on('change', function() {
        if ($(this).val() !== '') {
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });

    $('#cardName').on('input', function() {
        validateField($(this), cardNamePattern);
    });

    $('#expiryMonth').on('input', function() {
        validateField($(this), expiryMonthPattern);
    });

    $('#expiryYear').on('input', function() {
        validateField($(this), expiryYearPattern);
    });

    $('#CVV').on('input', function() {
        validateField($(this), cvvPattern);
    });

    $('#zip').on('input', function() {
        validateField($(this), zipPattern);
    });

    $('#paymentForm').on('input', function() {
        if ($('#cardNumber').hasClass('is-valid') &&
            $('#cardName').hasClass('is-valid') &&
            $('#expiryMonth').hasClass('is-valid') &&
            $('#expiryYear').hasClass('is-valid') &&
            $('#CVV').hasClass('is-valid') &&
            $('#zip').hasClass('is-valid')) {
            $('#payNow').removeClass('disabled');
        } else {
            $('#payNow').addClass('disabled');
        }
    });

    $('#orderItemCode').on('input', function() {
        const value = $(this).val();
        if (value.startsWith("M") || value.startsWith("W")) {
            validateField($(this), /^(M|W)\d+(F|C|I|S)(H|F|W|FF|SD|S|SL)\d{5}$/);
        } else {
            validateField($(this), /^(SHMP|POLB|POLBR|POLDBR|SOF|SOH)\d{5}$/);
        }
    });

    $('#orderItemQTY').on('input', function() {
        const qtyPattern = /^[1-9]\d*$/;
        validateField($(this), qtyPattern);
    });
    
    $('#cartForm').on('input', function () {
        if ($('#orderItemCode').hasClass('is-valid') &&
            $('#orderItemQTY').hasClass('is-valid')) {
            addCartButtonHandle(true);
        } else {
            addCartButtonHandle(false);
        }
    });


});

const loadOrder = () => {
    const refreshToken = localStorage.getItem('refreshToken');

    $('#orderTableBody').empty();
    $.ajax({
        type:"GET",
        url: "http://localhost:8080/helloShoes/api/v1/order",
        headers: {
            "Authorization": "Bearer " + refreshToken
        },
        contentType: "application/json",

        success: function (response) {
            response.forEach(function (order) {
                addRow(order.orderNo, formatDate(order.purchaseDate), order.paymentMethod, order.totalPrice, order.customerCode, order.employeeCode);
            });
        },
        error: function (xhr, status, error) {
            console.error('Something Error');
        }
    });

};

function addRow(orderNumber, purchaseDate, paymentMethod, totalPrice, customerCode, employeeCode) {
    var newRow = $('<tr>');
    newRow.append($('<td>').text(orderNumber));
    newRow.append($('<td>').text(purchaseDate));
    newRow.append($('<td>').text(paymentMethod));
    newRow.append($('<td>').text(totalPrice));
    newRow.append($('<td>').text(customerCode));
    newRow.append($('<td>').text(employeeCode));

    $('#orderTableBody').append(newRow);
}

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
    const purchaseDate = new Date().toISOString();
    const paymentMethod = $('#paymentMethod').val();
    const totalPrice = parseFloat($('#subtotal').text());
    let orderItems = [];
    let orderAccessories = [];
    const customerCode = $('#orderCustomerCode').val();
    const employeeCode = localStorage.getItem('employeeCode');

    $('#cartTableBody tr').each(function () {
        const itemCode = $(this).find('td:eq(1)').text();
        const quantity = parseInt($(this).find('td:eq(4)').text(), 10);
        if (validateItemCode(itemCode)) {
            const orderItemDTO = new OrderItemDTO(itemCode, quantity);
            orderItems.push(orderItemDTO);
        } else {
            const orderAccessoriesDTO = new OrderAccessoriesDTO(itemCode, quantity);
            orderAccessories.push(orderAccessoriesDTO);
        }
    });



    const orderDTO = new OrderDTO(0, purchaseDate, paymentMethod, totalPrice, orderItems, orderAccessories, customerCode, employeeCode);

    console.log(orderDTO);

    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await $.ajax({
            type: "POST",
            url: "http://localhost:8080/helloShoes/api/v1/order",
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            data: JSON.stringify(orderDTO),
            contentType: "application/json"
        });
        $("#orderCloseButton").click();
        Swal.fire({
            title: "Success!",
            text: "Order has been added successfully!",
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


function validateItemCode(itemCode) {
    var pattern = /^(M|W)\d+(F|C|I|S)(H|F|W|FF|SD|S|SL)\d{5}$/;

    return pattern.test(itemCode);
}

function validateAccessoryCode(accessoryCode) {
    var pattern = /^(SHMP|POLB|POLBR|POLDBR|SOF|SOH)\d{5}$/;

    return pattern.test(accessoryCode);
}

function addCartButtonHandle(status) {
    if (status) $("#addCartButton").removeClass('disabled');
    else $("#addCartButton").addClass('disabled');
}

function checkOutButtonHandle(status) {
    if (status) $("#checkOutButton").removeClass('disabled');
    else $("#checkOutButton").addClass('disabled');
}
