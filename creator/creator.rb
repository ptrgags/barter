#!/usr/bin/env ruby
require 'json'

require_relative 'ui'
require_relative 'Item'
require_relative 'Situation'

class StoryCreator
    
    def initialize
        @items = {}
        @situations = {}
    end

    def help
        puts "StoryCreator Commands:"
        puts "help - display this help"
        puts "list_items - list all items"
        puts "edit_item <id> - edit/create item"
        puts "delete_item <id> - delete item"
        puts "list_situations - list all situations"
        puts "edit_situation <id> - create/edit a situation"
        puts "delete_situation <id> - delete a situation"
        puts "save <fname> - save the final JSON file"
        puts "quit - exit the program, saving data"
        puts "exit - same as quit"
    end

    def list_items
        puts "All Items:"
        @items.each {|id, item| puts item}
    end

    def edit_item args
        _, id = args
        puts "Edit item with ID #{id}"
        @items[id] = Item.from_input id
    end

    def delete_item args
        _, id = args
        puts "Delete item with ID #{id}"
        @items.delete(id)
    end

    def list_situations
        puts "All situations:"
        @situations.each {|id, situation| puts situation}
    end

    def edit_situation args
        _, id = args
        puts "Edit situation with ID #{id}"
        @situations[id] = Situation.from_input id
    end

    # TODO: Prompt to delete the text file
    def delete_situation args
        _, id = args
        puts "Delete situation with ID #{id}"
        @situations.delete(id)
    end

    def save args
        _, fname = args
        puts "saving to #{fname}"
        # TODO: These should be converted to hashes
        data = {
            "items" => @items,
            "situations" => @situations
        }
        File.open(fname, "w") do |f|
            f.write(JSON.pretty_generate(data))
        end
    end

    def bye
        puts "Bye!"
        exit 0
    end

    def parse_command command
        args = command.split(' ')
        case args[0]
        when "list_items"
            list_items
        when "edit_item"
            edit_item args
        when "delete_item"
            delete_item args
        when "list_situations"
            list_situations
        when "edit_situation"
            edit_situation args
        when "delete_situation"
            delete_situation args
        when "save"
            save args
        when "help"
            help
        when "quit", "exit"
            bye
        else
            puts "Bad command! Try 'help' for valid commands"
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
