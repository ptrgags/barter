'use strict';

/* global ItemStack Situation Option StoryGraph */

/**
 * A Situation is a vertex in the story graph.
 * It represents one location/story element
 * in the game.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Situation =
/**
 * Construct a Situation vertex from
 * an id and a data object
 */
function Situation(id, data) {
    _classCallCheck(this, Situation);

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
};

/**
 * An Option is a directed edge in the story graph.
 * It represents a choice in the story with extra
 * information about what items are bartered.
 */


var Option = function () {
    function Option(data, all_items) {
        _classCallCheck(this, Option);

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

        //Initialize the items.
        this.init_items(all_items, data);

        //Set this to true when the option has been selected
        this.visited = false;
    }

    /**
     * Convert listed item IDs to actual ItemStacks.
     */


    _createClass(Option, [{
        key: 'init_items',
        value: function init_items(all_items, data) {
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

        /*
         * If this option can be selected. This is false only
         * if one_time AND visited or if this link is a back link
         */

    }, {
        key: 'is_available',
        get: function get() {
            return this.is_back_link || !this.one_time || !this.visited;
        }

        /**
         * Format the label for the option button.
         */

    }, {
        key: 'label',
        get: function get() {
            //List the items with commas in between
            var give_items = this.give_items.join(',<br/>');
            var take_items = this.take_items.join(',<br/>');

            //Barter options list the items that are given/received
            if (this.barter) return 'Barter ' + give_items + ' <br/> for ' + take_items;
            //Options that require only giving items show what's needed
            else if (give_items) return this.desc + ' <br/> (Requires ' + give_items + ')';
                //Otherwise, just display the description.
                else return this.desc;
        }
    }]);

    return Option;
}();
/**
 * Adjacency list of Situations and Options
 * that represents a complete story.
 */


var StoryGraph = function () {
    function StoryGraph(story_data, all_items) {
        _classCallCheck(this, StoryGraph);

        //Construct the situation nodes
        this.populate_situations(story_data);

        //Construct the option adjacency list
        this.empty_adjacency_list();
        this.populate_options(story_data, all_items);
    }

    /*
     * Read the story data and create a mapping
     * of situation_id -> Situation
     */


    _createClass(StoryGraph, [{
        key: 'populate_situations',
        value: function populate_situations(story_data) {
            this.situations = {};
            for (var id in story_data.situations) {
                if ({}.hasOwnProperty.call(story_data.situations, id)) {
                    this.situations[id] = new Situation(id, story_data.situations[id]);
                }
            }
        }

        /**
         * Initialize the adjacency list for every
         * situation in the graph.
         */

    }, {
        key: 'empty_adjacency_list',
        value: function empty_adjacency_list() {
            this.options = {};
            for (var id in this.situations) {
                if ({}.hasOwnProperty.call(this.situations, id)) this.options[id] = [];
            }
        }

        /**
         * Read the story data and populate the adjacency list
         */

    }, {
        key: 'populate_options',
        value: function populate_options(story_data, all_items) {
            //Populate it with options
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = story_data.options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var opt = _step.value;

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
        }

        //Check if a given situation has been visited and completely explored,
        //not including back links

    }, {
        key: 'situation_completed',
        value: function situation_completed(situation_id) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.options[situation_id][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var opt = _step2.value;

                    if (opt.is_back_link) continue;
                    if (opt.is_available) return false;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return this.situations[situation_id].visited;
        }
    }]);

    return StoryGraph;
}();