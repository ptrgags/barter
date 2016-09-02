'use strict';

/* global Item */

/**
 * Main class for representing the story data
 */
class Barter {
    constructor(story_data) {
        //Master list of items used in this story
        this.items = Item.read_items(story_data.items);

        //Initialize the player's inventory
        this.inventory = new Inventory();
        var start_inventory = ItemStack.read_item_list(
            this.items, story_data.start_items);
        this.inventory.add_item_stacks(start_inventory);

        //Initialize the story graph
        this.story = new StoryGraph(story_data, this.items);

        //Current situation in the story graph
        this.current = story_data.start;
        this.current_situation.visited = true;
    }

    get current_situation() { return this.story.situations[this.current]; }

    /**
     * Get a list of the currently available options. Back links are always
     * available and are moved to the end of the list. Non-back options
     * need to be checked for availability.
     */
    get current_options() {
        //Get all the options for the current situations
        var options = this.story.options[this.current];

        //Divide the options into back links and non-back links
        var back_options = options.filter((x) => x.is_back_link);
        var non_back_options = options.filter((x) => !x.is_back_link);

        //Only keep options that lead to unvisited content.
        var available_options = non_back_options.filter((x) =>
            x.is_available && !this.story.situation_completed(x.to)
        );

        //Put the back links at the end of the list.
        return available_options.concat(back_options);
    }

    /**
     * For an available option, check if the inventory has the
     * required items.
     */
    option_enabled(option) {
        return this.inventory.has_item_stacks(option.give_items);
    }

    /**
     * When an Option is selected, advance to the next
     * situation and make any needed changes to the inventory.
     */
    select_option(option) {
        //Mark the option as visited
        option.visited = true;

        //Move to the next situation and mark it as visited
        this.current = option.to;
        this.current_situation.visited = true;

        //Update the player's inventory
        this.inventory.remove_item_stacks(option.give_items);
        this.inventory.add_item_stacks(option.take_items);
    }
}
