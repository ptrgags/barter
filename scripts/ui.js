var display_situation = (situation) => {
    $("#title").html(situation.title);
    $("#description").html(situation.desc);
};

var click_button = (event) => {
    var option = $(event.currentTarget).data();
    barter.graph.goto(option.to);
    barter.inventory.remove_item_stacks(option.give_items);
    barter.inventory.add_item_stacks(option.take_items);
    update();
}

var display_options = (options) => {
    $("#options").empty();
    for (var option of options) {
        var is_enabled = barter.inventory.has_item_stacks(option.give_items);
        var button = $("<button>")
            .html(option.label)
            .data(option)
            .click(click_button)
            .addClass("btn btn-default")
            .prop("disabled", !is_enabled);
        $("#options").append(button);
    }
};

var display_inventory = (inventory) => {
    $("#inventoryContents").html(inventory.html);
}

var update = () => {
    display_situation(barter.graph.current_situation);
    display_options(barter.graph.current_options);
    display_inventory(barter.inventory);
}
