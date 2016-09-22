'use strict';

/* global Item ItemStack */

/**
 * Plain old struct that represents an item in a
 * story
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Item = function () {
    function Item(id, data) {
        _classCallCheck(this, Item);

        this.id = id;
        this.name = data.name;
        this.desc = data.desc;
        this.key_item = data.key_item || false;
    }

    _createClass(Item, [{
        key: 'toString',
        value: function toString() {
            return 'Item(' + this.id + ', ' + this.name + ')';
        }

        /**
         * Go from a mapping of item_id -> {name, desc}
         * to a mapping of item_id -> Item
         */

    }], [{
        key: 'read_items',
        value: function read_items(item_data) {
            var items = {};
            for (var id in item_data) {
                if ({}.hasOwnProperty.call(item_data, id)) {
                    var item = new Item(id, item_data[id]);
                    items[id] = item;
                }
            }
            return items;
        }
    }]);

    return Item;
}();

/**
 * Wrapper for an Item + a quantity.
 */


var ItemStack = function () {
    function ItemStack(item, quantity) {
        _classCallCheck(this, ItemStack);

        this.item = item;
        this.quantity = quantity;
    }

    _createClass(ItemStack, [{
        key: 'toString',
        value: function toString() {
            return '<b>' + this.name + ' (' + this.quantity + ')</b>';
        }

        /**
         * Go from an array of pairs [id, quantity] to an array of
         * ItemStacks
         * all_items -- an mapping of item_id -> Item
         * item_list -- an array of [item_id, quantity]
         */

    }, {
        key: 'id',
        get: function get() {
            return this.item.id;
        }
    }, {
        key: 'name',
        get: function get() {
            return this.item.name;
        }
    }, {
        key: 'desc',
        get: function get() {
            return this.item.desc;
        }
    }, {
        key: 'key_item',
        get: function get() {
            return this.item.key_item;
        }
    }], [{
        key: 'read_item_list',
        value: function read_item_list(all_items, item_list) {
            var stacks = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = item_list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stack_arr = _step.value;

                    var item_id;
                    var item_quantity;

                    var _stack_arr = _slicedToArray(stack_arr, 2);

                    item_id = _stack_arr[0];
                    item_quantity = _stack_arr[1];

                    var item = all_items[item_id];
                    stacks.push(new ItemStack(item, item_quantity));
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

            return stacks;
        }
    }]);

    return ItemStack;
}();

/**
 * Data structure that represents the
 * player's current inventory
 */


var Inventory = function () {
    function Inventory() {
        _classCallCheck(this, Inventory);

        this.stacks = {};
    }

    _createClass(Inventory, [{
        key: 'add_item_stacks',


        //Add an array of item stacks to the inventory
        value: function add_item_stacks(stacks) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = stacks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var stack = _step2.value;

                    this.add_item_stack(stack);
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
        }

        //Add a single item stack to the inventory

    }, {
        key: 'add_item_stack',
        value: function add_item_stack(stack) {
            if (stack.id in this.stacks) this.stacks[stack.id].quantity += stack.quantity;else this.stacks[stack.id] = stack;
        }

        //Check if the inventory has all of the correct quantity
        //of items in an array of item stacks.

    }, {
        key: 'has_item_stacks',
        value: function has_item_stacks(stacks) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = stacks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var stack = _step3.value;

                    if (!this.has_item_stack(stack)) return false;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return true;
        }

        //Check if an item stack is in the inventory and if so,
        //the inventory has at least the required quanity of items

    }, {
        key: 'has_item_stack',
        value: function has_item_stack(stack) {
            if (!(stack.id in this.stacks)) return false;
            if (this.stacks[stack.id].quantity < stack.quantity) return false;
            return true;
        }

        //Remove the same number of items described by
        //an array of item stacks. On error, this throws
        //an Error object.

    }, {
        key: 'remove_item_stacks',
        value: function remove_item_stacks(stacks) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = stacks[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var stack = _step4.value;

                    this.remove_item_stack(stack);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }

        //Remove a single item stack's worth of items from the inventory.
        //On error, this throws an Error object

    }, {
        key: 'remove_item_stack',
        value: function remove_item_stack(stack) {
            //Don't remove key items
            if (stack.key_item) return;

            var inv_stack = this.stacks[stack.id];
            //Make sure the stack exists
            if (!this.has_item_stack(stack)) throw Error('Error removing ' + stack + ' from ' + inv_stack);

            //Decrement the stack quanity, and remove the stack if
            //the count reaches 0
            inv_stack.quantity -= stack.quantity;
            if (inv_stack.quantity === 0) delete this.stacks[stack.id];
        }
    }, {
        key: 'toString',
        value: function toString() {
            var output = 'Inventory:';
            for (var stack_id in this.stacks) {
                if ({}.hasOwnProperty.call(this.stacks, stack_id)) {
                    var stack = this.stacks[stack_id];
                    output += '\n' + stack.id + ': ' + stack.quantity;
                }
            }
            return output;
        }
    }, {
        key: 'html',
        get: function get() {
            var output = '';
            for (var stack_id in this.stacks) {
                if ({}.hasOwnProperty.call(this.stacks, stack_id)) {
                    var stack = this.stacks[stack_id];
                    var is_key_item = stack.key_item ? 'Yes' : 'No';
                    output += '<tr><td>' + stack.name + '</td>' + ('<td>' + stack.desc + '</td>') + ('<td>' + stack.quantity + '</td>') + ('<td>' + is_key_item + '</td></tr>');
                }
            }
            return output;
        }
    }]);

    return Inventory;
}();