'use strict';
/* global barter click_button */

var display_situation = function display_situation(situation) {
    $('#title').html(situation.title);
    $('#description').html(situation.desc);
};

var display_inventory = function display_inventory(inventory) {
    $('#inventoryContents').html(inventory.html);
};

var display_options = function display_options(options) {
    $('#options').empty();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var option = _step.value;

            var button = $('<button>').html(option.label).data('option', option).click(click_button).addClass('btn btn-default').prop('disabled', !barter.option_enabled(option));
            $('#options').append(button);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};

var update = function update() {
    display_situation(barter.current_situation);
    display_options(barter.current_options);
    display_inventory(barter.inventory);
};

var click_button = function click_button(event) {
    var option = $(event.currentTarget).data('option');
    barter.select_option(option);
    update();
};