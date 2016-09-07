#!/usr/bin/env ruby
require 'json'
require 'readline'

require_relative 'ui'
require_relative 'Item'
require_relative 'Situation'
require_relative 'Option'

class StoryCreator

    # All commands
    COMMANDS = [
        # General Commands
        "help",
        "save",
        "set_start",
        "show_json",
        "goto",
        "quit",
        "bye",

        # Item Commands
        "list_items",
        "add_item",
        "edit_item",
        "delete_item",

        # Situation Commands
        "list_situations",
        "add_situation",
        "edit_situation",
        "delete_situation",
        "show_situation",

        # Option commands
        "list_options",
        "add_option",
        "edit_option",
        "delete_option"
    ].sort

    # Commands that take an item ID
    ITEM_COMMANDS = [
        "edit_item",
        "delete_item"
    ]

    # Commands that take a situation ID
    SITUATION_COMMANDS = [
        "edit_situation",
        "delete_situation",
        "add_option",
        "set_start",
        "goto"
    ]

    # Commands that take an option index
    OPTION_COMMANDS = [
        "edit_option",
        "delete_option"
    ]

    def initialize
        @items = {}
        @situations = {}
        @options = {}

        # Current situation ID
        @current = ""
        @start_situation = ""
    end

    def help args
        puts "StoryCreator Commands:"

        # General commmands
        puts "help - display this help"
        puts "set_start <id> - set the start node"
        puts "save <fname> - save the final JSON file"
        puts "quit - exit the program, saving data"
        puts "goto <id> - Set the current situation pointer to <id>"
        puts "bye - same as quit"

        # Item commands
        puts "list_items - list all items"
        puts "add_item <id> - create a new item"
        puts "edit_item <id> - edit/create item"
        puts "delete_item <id> - delete item"

        # Situation commands
        puts "list_situations - list all situations"
        puts "add_situation <id> - create a new situation"
        puts "edit_situation <id> - create/edit a situation"
        puts "delete_situation <id> - delete a situation"
        puts "show_situation <id> - show the *current* situation"

        # Option commands
        puts "list_options - list all options for the current situation"
        puts "add_option <id> - add an option from the current situation -> <id>"
        puts "edit_option <index> - edit the option from the list in list_options"
        puts "delete_option <index> - Delete an option with the index "

    end

    def list_items args
        puts "All Items:"
        @items.each {|id, item| puts item}
    end

    def add_item args
        _, id = args
        if @items.has_key? id
            edit_item args
        else
            puts "Adding item with ID #{id}"
            @items[id] = Item.from_input id
        end
    end

    def edit_item args
        _, id = args
        if not @items.has_key? id
            add_item args
        else
            puts "Edit existing item with ID #{id}"
            @items[id].edit
        end
    end

    def delete_item args
        _, id = args
        if @items.has_key? id
            puts "Delete item with ID #{id}"
            @items.delete(id)
        else
            puts "Whoops, there's no item #{id} here!"
            puts "see 'list_items' to see available items"
        end
    end

    def list_situations args
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

    def show_situation args
        puts current_situation
        @options[@current].each_with_index {|opt, i| puts "#{i}) #{opt}"}
    end

    def list_options args
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

    def set_start args
        _, id = args
        @start_situation = id
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
            "options" => @options.values.flatten.map {|opt| opt.to_hash},
            "start" => @start_situation,
        }
    end

    def show_json args
        puts JSON.pretty_generate(to_hash)
    end

    def save args
        _, fname = args
        puts "Saving to #{fname}"
        File.open(fname, "w") do |f|
            f.write(JSON.pretty_generate(to_hash))
        end
    end

    def bye args
        puts "Bye!"
        exit 0
    end

    alias_method :quit, :bye

    def parse_command command
        args = command.split(' ')
        if COMMANDS.include? args[0]
            self.send(args[0], args)
        else
            puts "Bad command! Try 'help' for valid commands"
        end
    end

    def command_proc
        return proc do |s|
            # First, let's find the how many words we have
            buf = Readline.line_buffer
            words = buf.split(' ')
            num_words = words.length

            # If the last character was a space, go to the next word
            if buf[-1] == ' '
                num_words += 1
            end

            # We'll do a grep on the appropriate array looking
            # for prefixes
            pattern = /^#{Regexp.escape(s)}/

            # Determine which list of commands to look through
            if num_words < 2
                COMMANDS.grep(pattern)
            elsif num_words == 2
                cmd, *_ = words
                if ITEM_COMMANDS.include? cmd
                    @items.keys.grep(pattern)
                elsif SITUATION_COMMANDS.include? cmd
                    @situations.keys.grep(pattern)
                elsif OPTION_COMMANDS.include? cmd
                    @options[current].each_with_index{|o, i| i.to_s}.grep(pattern)
                else
                    []
                end
            else
                []
            end
        end
    end

    def repl
        if STDIN.tty?
            Readline.completion_append_character = ' '
            Readline.completion_proc = command_proc
            loop do
                line = Readline.readline("StoryCreator> ", true)
                parse_command(line.chomp)
            end
        else
            loop do
                parse_command(gets.chomp)
            end
        end
    end
end


creator = StoryCreator.new
creator.repl
