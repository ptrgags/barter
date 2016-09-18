'use strict';

/* global Item Inventory StoryGraph ItemStack */

/**
 * Main class for representing the story data
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Barter = function () {
    function Barter(story_data) {
        _classCallCheck(this, Barter);

        //Master list of items used in this story
        this.items = Item.read_items(story_data.items);

        //Initialize the player's inventory
        this.inventory = new Inventory();
        var start_inventory = ItemStack.read_item_list(this.items, story_data.start_items);
        this.inventory.add_item_stacks(start_inventory);

        //Initialize the story graph
        this.story = new StoryGraph(story_data, this.items);

        //Current situation in the story graph
        this.current = story_data.start;
        this.current_situation.visited = true;
    }

    _createClass(Barter, [{
        key: 'option_enabled',


        /**
         * For an available option, check if the inventory has the
         * required items.
         */
        value: function option_enabled(option) {
            return this.inventory.has_item_stacks(option.give_items);
        }

        /**
         * When an Option is selected, advance to the next
         * situation and make any needed changes to the inventory.
         */

    }, {
        key: 'select_option',
        value: function select_option(option) {
            //Mark the option as visited
            option.visited = true;

            //Move to the next situation and mark it as visited
            this.current = option.to;
            this.current_situation.visited = true;

            //Update the player's inventory
            this.inventory.remove_item_stacks(option.give_items);
            this.inventory.add_item_stacks(option.take_items);
        }
    }, {
        key: 'current_situation',
        get: function get() {
            return this.story.situations[this.current];
        }

        /**
         * Get a list of the currently available options. Back links are always
         * available and are moved to the end of the list. Non-back options
         * need to be checked for availability.
         */

    }, {
        key: 'current_options',
        get: function get() {
            var _this = this;

            //Get all the options for the current situations
            var options = this.story.options[this.current];

            //Divide the options into back links and non-back links
            var back_options = options.filter(function (x) {
                return x.is_back_link;
            });
            var non_back_options = options.filter(function (x) {
                return !x.is_back_link;
            });

            //Only keep options that lead to unvisited content.
            var available_options = non_back_options.filter(function (x) {
                return x.is_available && !_this.story.situation_completed(x.to);
            });

            //Put the back links at the end of the list.
            return available_options.concat(back_options);
        }
    }]);

    return Barter;
}();