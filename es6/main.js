'use strict';

/* global update barter Barter */

var barter = null;

/**
 * Send an AJAX request to get a list of all
 * available stories
 */
var get_story_list = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            dataType: 'json',
            url: 'stories/story_list.json',
            success: resolve,
            error: reject
        });
    });
};

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

var init_page = (story_list) => {
    //Populate the story select dropdown
    var select = $('#story-select');
    for (var story of story_list) {
        $('<option>')
            .data('story', story)
            .text(story.title)
            .appendTo(select);
    }
    init_story(story_list[0]);
};

/**
 * Get the data for a single story
 * and begin to update the page
 */
var init_story = (story) => {
    //Set Story Title and Author
    $('#story-title').html(story.title);
    $('#author').html(story.author);

    //Get the story data and start the story
    get_story(story.file)
        .then(start_story)
        .catch(console.err);
}

/**
 * Start a single story
 */
var start_story = (story_data) => {
    barter = new Barter(story_data);
    update();
};

/**
 * Startup sequence
 */
$(document).ready(() => {
    //When the a new story is selected, initialize that story
    $('#story-select').change(function(){
        init_story($(this).find(':selected').data('story'));
    });

    //Get the list of stories and initialize the page
    //when done
    get_story_list()
        .then(init_page)
        .catch(console.err);
});
