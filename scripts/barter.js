'use strict';

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
    }

    get current_situation() { return this.story.situations[this.current]; }
    get current_options() {
        //Filter out one-time options that have already been selected.
        var options = this.story.options[this.current].filter(
            x => x.is_enabled);

        //We want to put "Back" links at the end of the list
        var non_back_options = options.filter(x => x.desc !== 'Back');
        var back_options = options.filter(x => x.desc === 'Back');
        return non_back_options.concat(back_options);
    }

    option_enabled(option) {
        return this.inventory.has_item_stacks(option.give_items);
    }

    select_option(option) {
        option.visited = true;
        this.current = option.to;

        //Update the player's inventory
        this.inventory.remove_item_stacks(option.give_items);
        this.inventory.add_item_stacks(option.take_items);
    }
}
