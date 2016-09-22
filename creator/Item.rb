require_relative "ui"

class Item
    attr_accessor :id, :name, :desc, :key_item

    def initialize id
        @id = id
        @name = ""
        @desc = ""
        @key_item = false
    end

    # Convert to a hash for JSON
    def to_hash
        data = {
            "name" => @name,
            "desc" => @desc
        }

        if @key_item
            data["key_item"] = true
        end

        data
    end

    def edit
        @name = prompt_edit_str "Item Name", @name
        @desc = prompt_edit_str "Item Description", @desc
        @key_item = prompt_approval "Is this a key item?"
    end

    def to_s
        key_desc = @key_item ? '(Key Item)' : ''
        "#{@id}: #{@name} - #{@desc} #{key_desc}"
    end

    # Create an Item from an ID and hash.
    # This data is from the JSON
    def self.from_hash id, data
        item = self.new id
        item.name = data['name']
        item.desc = data['desc']
        item.key_item = data['key_item'] || false
        item
    end

    # Read user input to populate the item data
    def self.from_input id
        item = self.new id
        item.name = prompt_str "Name for Item #{id}: "
        item.desc = prompt_str "Description for Item #{id}: "
        item.key_item = prompt_approval(
            "Is this a key item (can't be removed from inventory)?")
        item
    end
end
