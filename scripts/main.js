//Setup the program

//Barter namespace
var barter = {};

//Read raw data
readItems(itemsRaw);
readOptions(optionsRaw);
readSituations(situationsRaw);

//Set up the inventory
barter.inventory = new Inventory();
barter.inventory.addItems(new ItemStack(barter.items["pencil"], 1));
barter.situation = "intro";

//Functions

//initialize the page by displaying the first situation
var init = function () {
    setupSituation(barter.situation);
};

//Display a situation on the page
var setupSituation = function (id) {
    var situation = barter.situations[id];
    $("#title").html(situation.title);
    $("#description").html(situation.description);
    generateButtons(situation);
};

//Generate buttons based on a situation's options
var generateButtons = function (situation) {
    $("#options").html("");
    for (var i in situation.options) {
        var option = situation.options[i];
        if (!option.onetime || option.onetime && !option.visited) {
            var button;
            switch (option.type) {
                case "goto":
                    button = goToButton(option);
                    break;
                case "give":
                    button = giveButton(option);
                    break;
                case "barter":
                    button = barterButton(option);
                    break;
                case "get":
                    button = getButton(option);
                    break;
                default:
                    console.log("YOU GET NOTHING! YOU LOSE! GOOD DAY SIR!");
                    break;
            }
            $("#options").append(button);
        }
    }
};

//Create a generic button
var createButton = function (label, action, option) {
    var button = document.createElement("button");
    button.innerHTML = label;
    button.onclick = action;
    button.disabled = !meetsRequirements(option);
    return button;
};

//Check if the player's inventory has enough items to meet an option's
//requirements
var meetsRequirements = function (option) {
    if (option.requiredItems === null)
        return true;
    else
        return barter.inventory.hasItems(option.requiredItems);
};

//Create a button that advances to the next situation
var goToButton = function (option) {
    var button = createButton(option.name, actionGoTo(option), option);
    return button;
};

//Create a button that takes items from the player's inventory
var giveButton = function (option) {
    var button = createButton(option.name, actionGive(option), option);
    return button;
};

//Create a button that gives items to the player
var getButton = function (option) {
    var button = createButton(option.name, actionGet(option), option);
    return button;
};


//Create a button that will swap player items for new items
var barterButton = function (option) {
    var item1 = barter.items[option.requiredItems.id];
    var item2 = barter.items[option.items.id];
    var quantity1 = option.requiredItems.quantity;
    var quantity2 = option.items.quantity;
    var label = "Barter <b>" + item1.name + " (" + quantity1 + ")</b> for <b>"
        + item2.name + " (" + quantity2 + ")</b>";
    var button = createButton(label, actionBarter(option), option);
    return button;
};

//Get a lambda function for bartering items
var actionBarter = function (option) {
    return function () {
        visit(option);
        barter.inventory.removeItems(option.requiredItems);
        barter.inventory.addItems(option.items);
        updateInventory();
        actionGoTo(option)();
    };
};

//Get a lambda function for adding items to the inventory
var actionGet = function (option) {
    return function () {
        visit(option);
        barter.inventory.addItems(option.items);
        updateInventory();
        actionGoTo(option)();
    }
};

//Get a lambda function for removing items from the inventory
var actionGive = function (option) {
    return function () {
        visit(option);
        barter.inventory.removeItems(option.requiredItems);
        updateInventory();
        actionGoTo(option)();
    }
};

//Get a lambda function for going to a new situation
var actionGoTo = function (option) {
    return function () {
        visit(option);
        barter.situation = option.next;
        setupSituation(barter.situation);
    };
};

//Turn on the visited flag of an option
var visit = function (option) {
    option.visited = true;
};

//Refresh the inventory on the page
var updateInventory = function () {
    $("#inventoryContents").html(generateInventory(barter.inventory.stacks));
};

//Generate the inventory HTML string
var generateInventory = function (stackArr) {
    var str = "";
    for (var stack in stackArr)
        str += inventoryItemString(stackArr[stack]);
    return str;
};

//Generate a table row in the inventory table on the page
var inventoryItemString = function (stack) {
    return "<tr><td>"
            + stack.name
            + "</td><td>"
            + stack.description
            + "</td><td>"
            + stack.quantity
            + "</td></tr>";
};