'use strict';
/* global barter click_button */

var display_situation = (situation) => {
    $('#title').html(situation.title);
    $('#description').html(situation.desc);
};

var display_inventory = (inventory) => {
    $('#inventoryContents').html(inventory.html);
};

var display_options = (options) => {
    $('#options').empty();
    for (var option of options) {
        var button = $('<button>')
            .html(option.label)
            .data('option', option)
            .click(click_button)
            .addClass('btn btn-default')
            .prop('disabled', !barter.option_enabled(option));
        $('#options').append(button);
    }
};

var update = () => {
    display_situation(barter.current_situation);
    display_options(barter.current_options);
    display_inventory(barter.inventory);
};

var click_button = (event) => {
    var option = $(event.currentTarget).data('option');
    barter.select_option(option);
    update();
};
