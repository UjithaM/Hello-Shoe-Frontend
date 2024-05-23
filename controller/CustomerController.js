
$(document).ready(function() {
    $("#addCustomerButton").click(function (e) {
        $('#customerFoam').get(0).reset();
        $("#customerSaveSubmit").show();
        $("#updateCustomerButton").hide();
        $("#deleteCustomerButton").hide();
        $("#customerCodeField").hide();
    })
    $("#customerSaveSubmit").click(function(event) {
        console.log("clicked");
        try {
            const customerName = $("#customerName").val();
            const genderS = $("#genderS").find(":selected").val();
            const joinDate = $("#joinDate").val();
            const level = $("#level").find(":selected").val();
            const totalPoints = $("#totalPoints").val();
            const dob = $("#dob").val();
            const addressNo = $("#addressNo").val();
            const lane = $("#lane").val();
            const mainCity = $("#mainCity").val();
            const mainState = $("#mainState").val();
            const postalCode = $("#postalCode").val();
            const contactNumber = $("#contactNumber").val();
            const customerEmail = $("#customerEmail").val();
            const recentPurchaseDate = null;

            const Customer = new CustomerDTO(
                0,
                customerName,
                genderS,
                joinDate,
                level,
                totalPoints,
                dob,
                addressNo,
                lane,
                mainCity,
                mainState,
                postalCode,
                contactNumber,
                customerEmail,
                recentPurchaseDate
            );

            console.log("Customer object:", Customer);

            saveCustomer(Customer);

        } catch (error) {
            console.error("Error creating Customer object:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.responseText,
            });
        }
    });

    $("#updateCustomerButton").click(function(event) {
        console.log("clicked");
        try {
            const customerCode = $("#customerCode").val();
            const customerName = $("#customerName").val();
            const genderS = $("#genderS").find(":selected").val();
            const joinDate = $("#joinDate").val();
            const level = $("#level").find(":selected").val();
            const totalPoints = $("#totalPoints").val();
            const dob = $("#dob").val();
            const addressNo = $("#addressNo").val();
            const lane = $("#lane").val();
            const mainCity = $("#mainCity").val();
            const mainState = $("#mainState").val();
            const postalCode = $("#postalCode").val();
            const contactNumber = $("#contactNumber").val();
            const customerEmail = $("#customerEmail").val();
            const recentPurchaseDate = null;

            const Customer = new CustomerDTO(
                0,
                customerName,
                genderS,
                joinDate,
                level,
                totalPoints,
                dob,
                addressNo,
                lane,
                mainCity,
                mainState,
                postalCode,
                contactNumber,
                customerEmail,
                recentPurchaseDate
            );

            console.log("Customer object:", Customer);

            updateCustomer(Customer, customerCode);

        } catch (error) {
            console.error("Error creating Customer object:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.responseText,
            });
        }
    });

    $("#deleteCustomerButton").click(function(event) {
        Swal.fire({
            title: "Do you want to delete " + $("#customerName").val() + "?",
            showDenyButton: true,
            showCancelButton: true,
            denyButtonText: `Delete`,
            confirmButtonText: "Don't  Delete",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire("Customer is not deleted", "", "info");
            } else if (result.isDenied) {
                try {
                    const customerCode = $("#customerCode").val();
                    const refreshToken = localStorage.getItem('refreshToken');
                    $.ajax({
                        type: "DELETE",
                        url: "http://localhost:8080/api/v1/customer/" + customerCode,
                        headers: {
                            "Authorization": "Bearer " + refreshToken
                        },
                        contentType: "application/json",
                        success: function (response) {
                            $("#customerFoamCloseButton").click();
                            Swal.fire({
                                title: "Success!",
                                text: "Customer has been deleted successfully!",
                                icon: "success"
                            });
                            loadCustomers();
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

    $('#customerLink').click(async function () {
        loadCustomers()
    });

    $('#customerTable tbody').on('click', 'tr', function() {
        var rowData = [];
        $("#customerSaveSubmit").hide();
        $("#updateCustomerButton").show();
        $("#deleteCustomerButton").show();
        $("#customerCodeField").show();
        $(this).find('td').each(function() {
            rowData.push($(this).text());
        });

        searchCustomer(rowData[0]);
        $('#customerModal').modal('show');
    });
});

const loadCustomers = () => {
    const refreshToken = localStorage.getItem('refreshToken');

    $('#customerTableBody').empty();
    $.ajax({
        type:"GET",
        url: "http://localhost:8080/api/v1/customer",
        headers: {
            "Authorization": "Bearer " + refreshToken
        },
        contentType: "application/json",

        success: function (response) {


            response.map((customer, index) => {

                
                const joinedDate = new Date(customer.joinDate);
                const formattedJoinedDate = `${joinedDate.getFullYear()}-${joinedDate.getMonth() + 1}-${joinedDate.getDate()}`;

                
                const dobDate = new Date(customer.dob);
                const formattedDobDate = `${dobDate.getFullYear()}-${dobDate.getMonth() + 1}-${dobDate.getDate()}`;
                addRow(customer.customerCode, customer.name, customer.gender, formattedJoinedDate, customer.level, customer.totalPoints, formattedDobDate, customer.mainCity, customer.contactNumber, customer.email, customer.recentPurchaseDate)

            });
            
        },
        error: function (xhr, status, error) {
            console.error('Something Error');
        }
    });
    
};
function addRow(customerCode, name, gender, joinDate, level, totalPoints, dob, city, contactNo, email, recentPurchaseDate) {

    var newRow = $('<tr>');
    newRow.append($('<td>').text(customerCode));
    newRow.append($('<td>').text(name));
    newRow.append($('<td>').text(gender));
    newRow.append($('<td>').text(joinDate));
    newRow.append($('<td>').text(level));
    newRow.append($('<td>').text(totalPoints));
    newRow.append($('<td>').text(dob));
    newRow.append($('<td>').text(city));
    newRow.append($('<td>').text(contactNo));
    newRow.append($('<td>').text(email));
    newRow.append($('<td>').text(recentPurchaseDate));


    $('#customerTableBody').append(newRow);
}

async function saveCustomer(customer) {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/v1/customer",
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            data: JSON.stringify(customer),
            contentType: "application/json"
        });
        $("#customerFoamCloseButton").click();
        Swal.fire({
            title: "Success!",
            text: customer.name + " has been added successfully!",
            icon: "success"
        });
        loadCustomers();
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.responseText,
        });
    }
}
async function updateCustomer(customer, customerId) {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await $.ajax({
            type: "PUT",
            url: "http://localhost:8080/api/v1/customer/" + customerId,
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            data: JSON.stringify(customer),
            contentType: "application/json"
        });
        $("#customerFoamCloseButton").click();
        Swal.fire({
            title: "Success!",
            text: customer.name + " has been update successfully!",
            icon: "success"
        });
        loadCustomers();
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.responseText,
        });
    }
}


async function searchCustomer(customerId) {

 
    const refreshToken = localStorage.getItem('refreshToken');

    try {
        const response = await $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/v1/customer/" + customerId,
            headers: {
                "Authorization": "Bearer " + refreshToken
            },
            contentType: "application/json"
        });
        $('#customerCode').val(response.customerCode);
        $('#customerName').val(response.name);
        $('#genderS').val(response.gender);
        $('#joinDate').val(formatDate(response.joinDate));
        $('#level').val(response.level);
        $('#totalPoints').val(response.totalPoints);
        $('#dob').val(formatDate(response.dob));
        $('#addressNo').val(response.addressNo);
        $('#lane').val(response.lane);
        $('#mainCity').val(response.mainCity);
        $('#mainState').val(response.mainState);
        $('#postalCode').val(response.postalCode);
        $('#contactNumber').val(response.contactNumber);
        $('#customerEmail').val(response.email);
        $('#recentPurchaseDate').val(formatDateTime(response.recentPurchaseDate));


    } catch (error) {
        console.error("Request failed:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Customer not found!",
        });
    }
}
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateTime(dateTimeString) {
    if (!dateTimeString) return "";
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    let month = (1 + dateTime.getMonth()).toString().padStart(2, '0');
    let day = dateTime.getDate().toString().padStart(2, '0');
    let hours = dateTime.getHours().toString().padStart(2, '0');
    let minutes = dateTime.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

