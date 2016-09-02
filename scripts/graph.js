'use strict';

/* global ItemStack Situation Option */

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

        //True if this situation has been visited
        this.visited = false;
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
        this.desc = data.desc || '';

        //If true, this option edge will be removed from
        //the graph after it is selected to prevent it
        //from being selected more than once.
        this.one_time = data.one_time || false;

        //If true, the button label will display
        //"Barter <item> for <item>" instead of the
        //description.
        this.barter = data.barter || false;

        //If true, this link is a back link, which gets treated slightly
        //differently when pruning options
        this.is_back_link = false;

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

        //Set this to true when the option has been selected
        this.visited = false;
    }

    /*
     * If this option can be selected. This is false only
     * if one_time AND visited or if this link is a back link
     */
    get is_available() {
        return this.is_back_link || !this.one_time || !this.visited;
    }

    /**
     * Format the label for the option button.
     */
    get label() {
        //List the items with commas in between
        var give_items = this.give_items.join(', ');
        var take_items = this.take_items.join(', ');

        //Barter options list the items that are given/received
        if (this.barter)
            return `Barter ${give_items} for ${take_items}`;
        //Options that require only giving items show what's needed
        else if (give_items)
            return `${this.desc} (Requires ${give_items})`;
        //Otherwise, just display the description.
        else
            return this.desc;
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
        for (var id in story_data.situations) {
            if ({}.hasOwnProperty.call(foo, key)) {
                this.situations[id] = new Situation(
                    id, story_data.situations[id]);
            }
        }

        //Create an empty adjacency list
        this.options = {};
        for (var id in this.situations) {
            if ({}.hasOwnProperty.call(foo, key)) {
                this.options[id] = [];
            }
        }

        //Populate it with options
        for (var opt of story_data.options)  {
            var option = new Option(opt, all_items);
            this.options[option.from].push(option);

            //Add a "Back" option if needed
            if (opt.back) {
                var back_option = new Option({
                    to: option.from,
                    from: option.to,
                    desc: 'Back'
                }, all_items);
                back_option.is_back_link = true;
                this.options[option.to].push(back_option);
            }
        }
    }

    //Check if a given situation has been visited and completely explored,
    //not including back links
    situation_completed(situation_id) {
        for (var opt of this.options[situation_id]) {
            if (opt.is_back_link)
                continue;
            if (opt.is_available)
                return false;
        }
        return this.situations[situation_id].visited;
    }
}
