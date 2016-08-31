'use strict';

const barter = {};

/**
 * Send an AJAX request to get a story JSON file.
 */
var get_story = (story_name) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            dataType: "json",
            url: `stories/${story_name}.json`,
            success: resolve,
            error: reject
        });
    });
};

var setup = (story_data) => {
    //Master list of items for this story
    barter.items = Item.read_items(story_data.items);

    //Inventory
    barter.inventory = new Inventory();
    var start_inventory = ItemStack.read_item_list(
        barter.items, story_data.start_items);
    barter.inventory.add_item_stacks(start_inventory);

    //Story graph
    barter.graph = new StoryGraph(story_data, barter.items);
}

/**
 * Startup sequence
 */
$(document).ready(() => {
    //1. Get the story file
    get_story('tutorial')
        .then(setup)
        .catch(console.err);
});
