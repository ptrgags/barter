require_relative "ui"

class Option
    attr_accessor(
        :from_id, 
        :to_id, 
        :desc, 
        :back, 
        :give_items, 
        :take_items,
        :one_time,
        :barter)

    def initialize from, to
        @from_id = from
        @to_id = to
        @desc = ""

        # True if this option a -> b has
        # a back link b -> a
        @back = false

        # Items associated with this option
        @give_items = []
        @take_items = []

    
        # True if this option can only be selected once
        @one_time = false

        # If true, the label will be "Barter <give> for <take>"
        # instead of @desc
        @barter = false
    end

    def to_hash
        data = {
            "from" => @from_id,
            "to" => @to_id,
        }

        # Only set the following keys if needed
        unless barter
            data["desc"] = @desc
        end

        if one_time
            data["one_time"] = true
        end

        if give_items.any?
            data["give_items"] = @give_items
        end

        if take_items.any?
            data["take_items"] = @take_items
        end

        if barter
            data["barter"] = true
        end

        if back
            data["back"] = true
        end

        data
    end

    def to_s
        output =  "#{@desc}: #{@from_id} -> #{@to_id}\n"
        output += "    back=#{@back}, barter=#{@barter}, one_time=#{@one_time}\n"
        output += "    give: #{@give_items.inspect}\n"
        output += "    take: #{@take_items.inspect}\n"
        output
    end

    def label
        @barter ? "Barter..." : @desc
    end

    def edit
        @desc = prompt_edit_str "Option Button Label:", @desc
        @back = prompt_approval "Add a back link #{@to_id} -> #{@from_id}?"
        @one_time = prompt_approval "Is this a one-time option?"
    end

    def self.from_hash data
        option = self.new data['from'], data['to']
        option.desc = data['desc'] || ""
        option.back = data['back'] || false
        option.barter = data['barter'] || false
        option.one_time = data['one_time'] || false
        option.give_items = data['give_items'] || []
        option.take_items = data['take_items'] || []
        option
    end

    def self.from_input from, to
        option = self.new from, to
        option.desc = prompt_str "Label for Option button from #{from} -> #{to}: "
        option.back = prompt_approval "Add a back link #{to} -> #{from}?"
        option.one_time = prompt_approval "Is this a one-time option?"
        option
    end
end
