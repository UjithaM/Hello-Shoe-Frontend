$(document).ready(function () {
    'use strict';
    const itemToggle = $('#itemToggle');
    const itemSection = $('#itemSection');
    const accessoriesToggle = $('#accessoriesToggle');
    const accessoriesSection = $('#accessoriesSection');
    itemToggle.addClass('disabled');
   
    itemToggle.on('click', function(e){
        itemSection.css('display', 'block');
        accessoriesSection.css('display', 'none');
        itemToggle.addClass('disabled');
        accessoriesToggle.removeClass('disabled');
    });
    accessoriesToggle.on('click', function(e){
        itemSection.css('display', 'none');
        accessoriesSection.css('display', 'block');
        accessoriesToggle.addClass('disabled');
        itemToggle.removeClass('disabled');
    });
});