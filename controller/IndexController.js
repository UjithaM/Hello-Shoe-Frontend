$(document).ready(function () {
    'use strict';
    
    $("#sign_section").css("display", "none");

    $("#deleteCustomerButton").hide();
    $("#updateCustomerButton").hide();

    $("#suppliers").css("display", "none");
    $("#customers").css("display", "none");
    $("#sales").css("display", "none");
    $("#employee").css("display", "none");
    $("#inventory").css("display", "none");

    //TODO uncomment this
    // $("header").hide();
    // $("main").hide();
    $('.needs-validation').on('submit', function (event) {
        if (this.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        $(this).addClass('was-validated');
    });
    $("form").submit(function (e)
    {
        e.preventDefault();
    });
    $('.list-group-item').on('click', function(e){
        e.preventDefault();
        $('.list-group-item').removeClass('active');
        $(this).addClass('active');
       
        $("#suppliers").css("display", "none");
        $("#customers").css("display", "none");
        $("#dashboard").css("display", "none");
        $("#sales").css("display", "none");
        $("#employee").css("display", "none");
        $("#inventory").css("display", "none");
       
        var section = $(this).data('section');
        $(this.hash).css("display", "block");
        $('.content-section').removeClass('active');
        $('#' + section).addClass('active');
    });
    //TODO remove this
    $("#login_section").css("display", "none");
    $("#dashboard").css("display", "none");
});

function checkUserHaveAdminPermission(refreshToken) {
    const arrayToken = refreshToken.split('.');

    const tokenPayload = JSON.parse(atob(arrayToken[1]));

    const role = tokenPayload.role[0].authority;
    return role === 'ROLE_ADMIN';
}



