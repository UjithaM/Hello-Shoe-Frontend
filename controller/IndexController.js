$(document).ready(function () {
    'use strict';

    $('.needs-validation').on('submit', function (event) {
        if (this.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        $(this).addClass('was-validated');
    });
    $("form").submit(function (e)
    {
        console.log("form submit called");
        e.preventDefault();
    });
    $("#suppliers").css("display", "none");
    $("#customers").css("display", "none");
    $("#sales").css("display", "none");
    $("#employee").css("display", "none");
    $('.list-group-item').on('click', function(e){
        e.preventDefault();
        $('.list-group-item').removeClass('active');
        $(this).addClass('active');
       
        $("#suppliers").css("display", "none");
        $("#customers").css("display", "none");
        $("#dashboard").css("display", "none");
        $("#sales").css("display", "none");
        $("#employee").css("display", "none");
       
        var section = $(this).data('section');
        $(this.hash).css("display", "block");
        $('.content-section').removeClass('active');
        $('#' + section).addClass('active');
    });
});






