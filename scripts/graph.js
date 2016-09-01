'use strict';

/**
 * A Situation is a vertex in the story graph.
 * It represents one location/story element
 * in the game.
 */
class Situation {
    /**
     * Construct a Situation vertex from
     * an id and a data object
     */
    constructor(id, data) {
        //The ID for this situation
        this.id = id;

        //The title for this situation that shows
        //up in the story panel heading
        this.title = data.title;

        //The longer description that goes in
        //the body of the story panel.
        this.desc = data.desc;
    }
}

/**
 * An Option is a directed edge in the story graph.
 * It represents a choice in the story with extra
 * information about what items are bartered.
 */
class Option {
    constructor(data, all_items) {
        //IDs of the source and destination
        //story nodes for this edge
        this.from = data.from;
        this.to = data.to;

        //Description for the option button.
        this.desc = data.desc || "";

        //If true, this option edge will be removed from
        //the graph after it is selected to prevent it
        //from being selected more than once.
        this.one_time = data.one_time || false;

        //If true, the button label will display
        //"Barter <item> for <item>" instead of the
        //description.
        this.barter = data.barter || false;

        //If true, the destination story node will
        //get an option called "back" to return to the
        //source node.
        this.back = data.back || false;

        //Items that are removed from inventory when this option
        //is selected. This is an array of pairs [item_id, quantity]
        //in the data but is converted into an array of ItemStacks
        //Note: This option will be disabled if the
        //player does not yet have these items and quantities.
        data.give_items = data.give_items || [];
        this.give_items = ItemStack.read_item_list(all_items, data.give_items);

        //Items that are added to the inventory when this option
        //is selected. This is an array of pairs [item_id, quantity]
        //in the JSON data but is converted into an array of ItemStacks
        data.take_items = data.take_items || [];
        this.take_items = ItemStack.read_item_list(all_items, data.take_items);
    }

    get label() {
        var give_items = this.give_items.join(", ")
        var take_items = this.take_items.join(", ")
        if (this.barter) {
            return `Barter ${give_items} for ${take_items}`;
        } else if (give_items) {
            return `${this.desc} (Requires ${give_items})`;
        } else {
            return this.desc;
        }
    }
}
/**
 * Adjacency list of Situations and Options
 * that represents a complete story.
 */
class StoryGraph {
    constructor(story_data, all_items) {
        //Construct the situation nodes
        this.situations = {};
        for (var id in story_data.situations)
            this.situations[id] = new Situation(id, story_data.situations[id]);

        //Create an empty adjacency list
        this.options = {};
        for (var id in this.situations)
            this.options[id] = [];

        //Populate it with options
        for (var opt of story_data.options)  {
            var option = new Option(opt, all_items);

            this.options[option.from].push(option);

            //Add a "Back" option if needed
            if (option.back) {
                var back_option = new Option({
                    to: option.from,
                    from: option.to,
                    desc: "Back"
                }, all_items);
                this.options[option.to].push(back_option);
            }
        }
    }

    remove_option(situation_id, option) {
        var options = this.options[situation_id];
        this.options[situation_id] = options.filter(x => x != option);
    }
}
