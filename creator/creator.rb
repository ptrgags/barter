#!/usr/bin/env ruby
require 'json'

require_relative 'ui'
require_relative 'Item'

class StoryCreator
    def initialize
        @items = {}
    end

    def parse_command command
        args = command.split(' ')
        case args[0]
        when /^list_items/
            puts "All Items:"
            @items.each {|id, item| puts item}
        when /^edit_item/
            cmd, id = args
            puts "Edit item with ID #{id}"
            @items[id] = Item.from_input id
        when /^delete_item/
            command, id = args
            puts "Delete item with ID #{id}"
            @items.delete(id)
        when /^save/
            cmd, fname = args
            puts "saving to #{fname}"
            data = {
                "items" => @items
            }
            File.open(fname, "w") do |f|
                f.write(JSON.pretty_generate(data))
            end
        when /^quit/
            puts "Bye!"
            exit 0
        else
            puts "Bad Command! Try Again"
        end
    end

    def repl
        loop do
            parse_command(prompt_str "StoryCreator> ")
        end
    end
end


creator = StoryCreator.new
creator.repl


#story = JSON.parse(File.read "tutorial.json")
#items = story['items']

#all_items = items.map {|id, data| Item.from_hash id, data}
#puts all_items



#puts Item.from_input "banana"


#items.map {|key, val| puts [key, val].inspect}
