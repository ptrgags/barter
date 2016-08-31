'use strict';

$(document).ready(() => {
    var item = new Item("test_item", {
        name: "Test Item",
        desc: "An Item for Testing"
    });

    var stack = new ItemStack(item, 3);
    var inventory = new Inventory();

    console.log(`${item}`);
    console.log(`${stack}`);
    console.log(`${inventory}`);

    inventory.add_item_stack(stack);
    console.log(`${inventory}`);

    var required = new ItemStack(item, 2);
    inventory.remove_item_stack(required);
    console.log(`${inventory}`);

    inventory.remove_item_stack(required);
    console.log(`${inventory}`);
});
