require_relative "ui"

class Item
    attr_accessor :id, :name, :desc

    def initialize id
        @id = id
        @name = ""
        @desc = ""
    end

    # Convert to a hash for JSON
    def to_hash
        {
            "name" => @name,
            "desc" => @desc
        }
    end

    def edit
        @name = prompt_edit_str "Item Name", @name
        @desc = prompt_edit_str "Item Description", @desc
    end

    def to_s
        "#{@id}: #{@name} - #{@desc}"
    end

    # Create an Item from an ID and hash.
    # This data is from the JSON
    def self.from_hash id, data
        item = self.new id
        item.name = data['name']
        item.desc = data['desc']
        item
    end

    # Read user input to populate the item data
    def self.from_input id
        item = self.new id
        item.name = prompt_str "Name for Item #{id}: "
        item.desc = prompt_str "Description for Item #{id}: "
        item
    end
end
