require_relative "ui"

# TODO: Handle Description files
class Situation
    attr_accessor :id, :title

    def initialize id
        @id = id
        @title = ""
    end

    # Convert to a hash for JSON
    def to_hash
        {
            "title" => @title
        }
    end

    def to_s
        "#{@id}: #{@title}"
    end

    def edit
        @title = prompt_edit_str "Situation Title:", @title
    end

    # Create a Situation from an ID and hash
    # This data is from the JSON
    def self.from_hash id, data
        situation = self.new id
        situation.title = data['title']
        situation
    end

    # Read user input to populate the situation data
    def self.from_input id
        situation = self.new id
        situation.title = prompt_str "Title for Situation #{id}: "
        situation
    end
end
