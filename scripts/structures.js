//Item data type
var Item = function (id, name, description, type) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
};
//Read items from raw data
var readItems = function (raw) {
    barter.items = {};
    for (var key in raw)
        barter.items[key] = new Item(key, raw[key][0], raw[key][1], raw[key][2]);
};

//Item Stack data type
var ItemStack = function (item, quantity) {
    this.item = item;
    this.quantity = quantity;
};
ItemStack.prototype = {
    get id() { return this.item.id; },
    get name() { return this.item.name; },
    get description() { return this.item.description; },
    get type() { return this.item.type; }
};

//Option data type
var Option = function (id, name, type, next, requiredItem, requiredQuantity, item, quantity, onetime) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.next = next;
    this.requiredItems = requiredItem !== null ? new ItemStack(barter.items[requiredItem], requiredQuantity) : null;
    this.items = item !== null ? new ItemStack(barter.items[item], quantity) : null;
    this.onetime = onetime;
    this.visited = false;
};

//Read options from raw data
var readOptions = function (raw) {
    barter.options = {};
    for (var key in raw)
        barter.options[key] = new Option(key, raw[key][0], raw[key][1], raw[key][2], raw[key][3], raw[key][4], raw[key][5], raw[key][6], raw[key][7]);
};

//Situation Manifold data type
var SituationManifold = function (id, title, description, options) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.options = options;
};

//Read situations from raw data
var readSituations = function (raw) {
    barter.situations = {};
    for (var key in raw) {
        var options = [];
        for (var index in raw[key][2]) {
            var option = barter.options[raw[key][2][index]];
            options.push(option);
        }
        barter.situations[key] = new SituationManifold(key, raw[key][0], raw[key][1], options);
    }
};

//Inventory data structure
var Inventory = function () {
    this.stacks = [];
    this.getStack = function (id) {
        for (var i in this.stacks) {
            if (this.stacks[i].id === id)
                return this.stacks[i];
        }
        return null;
    }
    //Remove items based on a stack
    this.removeItems = function (stack) {
        var index = -1;
        for (var i in this.stacks) {
            if (this.stacks[i].id === stack.id) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            var item = this.stacks[index];
            if (item.quantity > stack.quantity)
                item.quantity -= stack.quantity;
            else
                this.stacks.splice(index, 1);
        }
    }
    //Add items based on a stack
    this.addItems = function (stack) {
        var existingStack = this.getStack(stack.id);
        if (existingStack === null)
            this.stacks.push(stack);
        else
            existingStack.quantity += stack.quantity;
    }
    //Check if this inventory has the desired items, including the proper
    //quantity
    this.hasItems = function (stack) {
        var existingStack = this.getStack(stack.id);
        if (existingStack === null)
            return false;
        else if (existingStack.quantity >= stack.quantity)
            return true;
        else
            return false;
    }
};