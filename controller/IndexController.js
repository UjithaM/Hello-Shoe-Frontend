$(document).ready(function () {
    'use strict';
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken || checkTokenExpired(refreshToken)) {
        localStorage.removeItem('refreshToken');
        $("header").hide();
        $("main").hide();
        $("#login_section").show();
    } else {
        $("header").show();
        $("main").show();
        $("#login_section").hide();
    }

    // Hide initial sections
    $("#sign_section").css("display", "none");
    $("#deleteCustomerButton").hide();
    $("#updateCustomerButton").hide();
    $("#suppliers").hide();
    $("#customers").hide();
    $("#sale").hide();
    $("#employee").hide();
    $("#inventory").hide();

    // Form validation
    $('.needs-validation').on('submit', function (event) {
        if (this.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        $(this).addClass('was-validated');
    });

    // Prevent form default submission
    $("form").submit(function (e) {
        e.preventDefault();
    });

    // List group item click handler
    $('.list-group-item').on('click', function (e) {
        e.preventDefault();
        $('.list-group-item').removeClass('active');
        $(this).addClass('active');

        // Hide all sections initially
        $("#suppliers").hide();
        $("#customers").hide();
        $("#dashboard").hide();
        $("#sale").hide();
        $("#employee").hide();
        $("#inventory").hide();

        // Show the selected section
        var section = $(this).data('section');
        $(this.hash).show();
        $('.content-section').removeClass('active');
        $('#' + section).addClass('active');
    });
});

function checkUserHaveAdminPermission(refreshToken) {
    const arrayToken = refreshToken.split('.');
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    const role = tokenPayload.role[0].authority;
    return role === 'ROLE_ADMIN';
}

function checkTokenExpired(refreshToken) {
    const arrayToken = refreshToken.split('.');
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    const exp = tokenPayload.exp;
    const now = Date.now() / 1000;
    return now > exp;
}

function updateCard(t, id) {
    var elem = document.getElementById(id);
    if (t.value !== "") elem.innerText = t.value;
}