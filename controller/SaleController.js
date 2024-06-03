$(document).ready(function () {
    'use strict';

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
    });
});

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

        $('#orderItemDescription').val(itemResponse.itemDescription);
        $("#orderItemPrev").attr("src", itemResponse.itemPicture).show();
        $('#orderItemStock').val(itemResponse.quantity);
        $('#orderItemPrice').val(itemResponse.unitPriceSell);

    } catch (e) {
        try {
            const accessoriesResponse = await $.ajax({
                type: "GET",
                url: "http://localhost:8080/helloShoes/api/v1/accessories/" + itemCode,
                headers: {
                    "Authorization": "Bearer " + refreshToken
                },
                contentType: "application/json"
            });

            $('#orderItemDescription').val(accessoriesResponse.accessoriesDescription);
            $("#orderItemPrev").attr("src", accessoriesResponse.accessoriesPicture).show();
            $('#orderItemStock').val(accessoriesResponse.quantity);
            $('#orderItemPrice').val(accessoriesResponse.unitPriceSell);
        } catch (e) {
            $('#orderItemDescription').val("");
            $("#orderItemPrev").hide();
            $('#orderItemStock').val("");
            $('#orderItemPrice').val("");
            console.log(e);
        }
    }
}

function checkValid() {
    const itemQTY = parseInt($('#orderItemQTY').val(), 10);
    const itemStock = parseInt($('#orderItemStock').val(), 10);
    if (itemQTY && itemStock && itemQTY <= itemStock) {
        return true;
    }
    return false;
}
