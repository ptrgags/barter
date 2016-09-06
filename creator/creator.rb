#!/usr/bin/env ruby
require 'json'

require_relative 'ui'
require_relative 'Item'
require_relative 'Situation'
require_relative 'Option'

class StoryCreator

    def initialize
        @items = {}
        @situations = {}
        @options = {}

        # Current situation ID
        @current = ""
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
        puts "list_options - list all options for the current situation"
        puts "add_option <id> - add an option from the current situation -> <id>"
        puts "edit_option <index> - edit the option from the list in list_options"
        puts "delete_option <index> - Delete an option with the index "
        puts "save <fname> - save the final JSON file"
        puts "goto <id> - Set the current situation pointer to <id>"
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
        if @options[id].nil?
            @options[id] = []
        end
    end

    # TODO: Prompt to delete the text file
    def delete_situation args
        _, id = args
        puts "Delete situation with ID #{id}"
        @situations.delete(id)
    end

    def list_options
        puts "All Options:"
        @options[@current].each_with_index {|opt, i| puts "#{i}) #{opt}"}
    end

    def add_option args
        _, to = args
        puts "Add option from #{@current} -> #{to}:"
        @options[@current].push(Option.from_input @current, to)
    end

    def edit_option args
        puts "TODO!"
    end

    def delete_option args
        _, index = args
        puts "Delete option ##{index}:"
        @options[@current].delete_at(index)
    end

    def current_situation
        @situations[@current]
    end

    def goto args
        _, id = args
        if @situations.has_key? id
            puts "Moving from #{@current} -> #{id}"
            @current = id
            puts "Current situation:"
            puts current_situation
        else
            puts "Situation '#{id}' does not exist"
        end
    end

    def to_hash
        {
            "items" => Hash[@items.map{|id, item| [id, item.to_hash]}],
            "situations" => Hash[@situations.map{|id, sit| [id, sit.to_hash]}],
            "options" => @options.values.flatten.map {|opt| opt.to_hash}
        }
    end

    def save args
        _, fname = args
        puts "saving to #{fname}"
        File.open(fname, "w") do |f|
            f.write(JSON.pretty_generate(to_hash))
        end
    end

    def bye
        puts "Bye!"
        exit 0
    end

    # TODO: Refactor this to use the readline library
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
        when "list_options"
            list_options
        when "add_option"
            add_option args
        when "delete_option"
            delete_option args
        when "goto"
            goto args
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
