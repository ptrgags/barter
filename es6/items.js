'use strict';

/* global Item ItemStack */

/**
 * Plain old struct that represents an item in a
 * story
 */
class Item {
    constructor(id, data) {
        this.id = id;
        this.name = data.name;
        this.desc = data.desc;
        this.key_item = data.key_item || false;
    }

    toString() {
        return `Item(${this.id}, ${this.name})`;
    }

    /**
     * Go from a mapping of item_id -> {name, desc}
     * to a mapping of item_id -> Item
     */
    static read_items(item_data) {
        var items = {};
        for (var id in item_data) {
            if ({}.hasOwnProperty.call(item_data, id)) {
                var item = new Item(id, item_data[id]);
                items[id] = item;
            }
        }
        return items;
    }
}

/**
 * Wrapper for an Item + a quantity.
 */
class ItemStack {
    constructor(item, quantity) {
        this.item = item;
        this.quantity = quantity;
    }

    get id() { return this.item.id; }
    get name() { return this.item.name; }
    get desc() { return this.item.desc; }
    get key_item() { return this.item.key_item; }

    toString() {
        return `<b>${this.name} (${this.quantity})</b>`;
    }

    /**
     * Go from an array of pairs [id, quantity] to an array of
     * ItemStacks
     * all_items -- an mapping of item_id -> Item
     * item_list -- an array of [item_id, quantity]
     */
    static read_item_list(all_items, item_list)  {
        var stacks = [];
        for (var stack_arr of item_list) {
            var item_id;
            var item_quantity;
            [item_id, item_quantity] = stack_arr;
            var item = all_items[item_id];
            stacks.push(new ItemStack(item, item_quantity));
        }
        return stacks;
    }
}

/**
 * Data structure that represents the
 * player's current inventory
 */
class Inventory {
    constructor() {
        this.stacks = {};
    }

    get html() {
        var output = '';
        for (var stack_id in this.stacks) {
            if ({}.hasOwnProperty.call(this.stacks, stack_id)) {
                var stack = this.stacks[stack_id];
                var is_key_item = (stack.key_item) ? 'Yes' : 'No';
                output += `<tr><td>${stack.name}</td>`
                    + `<td>${stack.desc}</td>`
                    + `<td>${stack.quantity}</td>`
                    + `<td>${is_key_item}</td></tr>`;
            }
        }
        return output;
    }

    //Add an array of item stacks to the inventory
    add_item_stacks(stacks) {
        for (var stack of stacks)
            this.add_item_stack(stack);
    }

    //Add a single item stack to the inventory
    add_item_stack(stack) {
        if (stack.id in this.stacks)
            this.stacks[stack.id].quantity += stack.quantity;
        else
            this.stacks[stack.id] = stack;
    }

    //Check if the inventory has all of the correct quantity
    //of items in an array of item stacks.
    has_item_stacks(stacks) {
        for (var stack of stacks) {
            if(!this.has_item_stack(stack))
                return false;
        }
        return true;
    }

    //Check if an item stack is in the inventory and if so,
    //the inventory has at least the required quanity of items
    has_item_stack(stack) {
        if (!(stack.id in this.stacks))
            return false;
        if (this.stacks[stack.id].quantity < stack.quantity)
            return false;
        return true;
    }

    //Remove the same number of items described by
    //an array of item stacks. On error, this throws
    //an Error object.
    remove_item_stacks(stacks) {
        for (var stack of stacks)
            this.remove_item_stack(stack);
    }

    //Remove a single item stack's worth of items from the inventory.
    //On error, this throws an Error object
    remove_item_stack(stack) {
        //Don't remove key items
        if (stack.key_item)
            return;

        var inv_stack = this.stacks[stack.id];
        //Make sure the stack exists
        if(!this.has_item_stack(stack))
            throw Error(`Error removing ${stack} from ${inv_stack}`);

        //Decrement the stack quanity, and remove the stack if
        //the count reaches 0
        inv_stack.quantity -= stack.quantity;
        if (inv_stack.quantity === 0)
            delete this.stacks[stack.id];
    }

    toString() {
        var output = 'Inventory:';
        for (var stack_id in this.stacks) {
            if ({}.hasOwnProperty.call(this.stacks, stack_id)) {
                var stack = this.stacks[stack_id];
                output += `\n${stack.id}: ${stack.quantity}`;
            }
        }
        return output;
    }
}
