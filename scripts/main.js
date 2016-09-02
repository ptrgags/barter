'use strict';

/* global update barter Barter */

var barter = null;

/**
 * Send an AJAX request to get a story JSON file.
 */
var get_story = (story_name) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            dataType: 'json',
            url: `stories/${story_name}.json`,
            success: resolve,
            error: reject
        });
    });
};

var setup = (story_data) => {
    barter = new Barter(story_data);
    update();
};

/**
 * Startup sequence
 */
$(document).ready(() => {
    //1. Get the story file
    get_story('tutorial')
        .then(setup)
        .catch(console.err);
});
