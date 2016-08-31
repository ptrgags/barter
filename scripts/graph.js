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
    constructor(data) {
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
        //Note: This option will be disabled if the
        //player does not yet have these items and quantities.
        this.give_items = data.give_items || [];

        //Items that are added to the inventory when this option
        //is selected. This is an array of pairs [item_id, quantity]
        this.take_items = data.take_items || [];
    }

    //TODO: Getter for the button label.
}

/**
 * Adjacency list of Situations and Options
 * that represents a complete story.
 */
class StoryGraph {
    constructor(story_data) {
        //Construct the situation nodes
        this.situations = {};
        for (var id in story_data.situations)
            this.situations[id] = Situation(id, story_data.situations[id]);

        //Create an empty adjacency list
        this.options = {};
        for (var id in this.situations)
            this.options[id] = [];

        //Populate it with options
        for (var opt in story_data.options)  {
            var option = Option(opt);
            this.options[option.from].push(option);

            //Add a "Back" option if needed
            if (option.back) {
                var back_option = Option({
                    to: option.from,
                    from: option.to,
                    desc: "Back"
                });
                this.options[option.to].push(back_option);
            }
        }
    }
}

//TODO: Test the above
