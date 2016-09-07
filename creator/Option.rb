require_relative "ui"

class Option
    attr_accessor :from_id, :to_id, :desc

    def initialize from, to
        @from_id = from
        @to_id = to
        @desc = ""
    end

    def to_hash
        {
            "from" => @from_id,
            "to" => @to_id,
            "desc" => @desc
        }
    end

    def to_s
        "#{@desc}: #{@from_id} -> #{@to_id}"
    end

    def self.from_hash data
        option = self.new data['from'], data['to']
        option.desc = data['desc']
        option
    end

    def self.from_input from, to
        option = self.new from, to
        option.desc = prompt_str "Label for Option button from #{from} -> #{to} "
        option
    end
end
