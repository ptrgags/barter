#!/usr/bin/env ruby
require 'json'
require 'readline'
require 'fileutils'
require 'graphviz'

require_relative 'ui'
require_relative 'Item'
require_relative 'Situation'
require_relative 'Option'

class StoryCreator

    # All commands
    COMMANDS = [
        # General Commands
        "help",
        "save_story",
        "load_story",
        "set_start",
        "set_start_items",
        "show_json",
        "show_graph",
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

        # Start situation for this story
        @start_situation = ""

        # Starting inventory for this story
        @start_items = []

        # Path to directory where story will be stored
        @story_dirname = ""

        # Identifier for naming graph files and save files 
        @story_id = ""
    end

    def help _
        puts "StoryCreator Commands:"

        # General commmands
        puts "help - display this help"
        puts "set_start <id> - set the start node"
        puts "set_start_items - set the starting inventory"
        puts "save <fname> - save the final JSON file into the story directory"
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

    def list_items _
        puts "All Items:"
        @items.each {|_, item| puts item}
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

    def list_situations _
        puts "All situations:"
        @situations.each {|_, situation| puts situation}
    end

    def add_situation args
        _, id = args 
        if @situations.has_key? id
            edit_situation args
        else
            puts "Add situation with ID #{id}"
            fname = File.join @story_dirname, "#{id}.txt"
            @situations[id] = Situation.from_input id, fname
            @options[id] = []
        end
    end

    def edit_situation args
        _, id = args
        if not @situations.has_key? id
            add_situation args
        else
            puts "Edit situation with ID #{id}"
            @situations[id].edit
        end
    end

    def delete_situation_options id
        delete_opts = prompt_approval "Delete options for situation #{id}?"
        if delete_opts
            puts "Removing options for situation #{id}"
            opts = @options.reject{|sit_id, _| sit_id == id}
            opts = opts.map do |sit_id, items|
                [sit_id, items.reject {|item| item.to_id == id}]
            end
            @options = Hash[opts]
        end 
    end

    def delete_situation args
        _, id = args
        if @situations.has_key? id
            puts "Delete situation with ID #{id}"
            @situations[id].delete_desc_file
            @situations.delete(id)
            delete_situation_options id
        else
            puts "Sorry, situation #{id} does not exist!"
        end
    end

    def display_options
        if @current.empty?
            puts "No Situation selected. Use `goto <situation_id>` first" 
        else
            @options[@current].each_with_index {|opt, i| puts "#{i}) #{opt}"}
        end
    end

    def show_situation _
        if @current.empty?
            puts "No Situation selected. Use `goto <situation_id>` first" 
        else
            puts current_situation
            display_options
        end
    end

    def list_options _
        puts "All Options:"
        display_options
    end

    
    # The cyclomatic complexity is too damn high!
    def add_option args
        _, to = args

        if @current.empty?
            puts "No Situation selected. Use `goto <situation_id>` first" 
            return
        end

        opt = nil
        if @situations.has_key? to
            puts "Add option from #{@current} -> #{to}:"
            opt = Option.from_input @current, to
        else 
            puts "Situation #{to} doesn't yet exist"
            create_sit = prompt_approval "Create situation #{to}?"
            if create_sit
                add_situation args
                opt = Option.from_input @current, to
            end
        end

        unless opt.nil?
            opt.give_items = prompt_give_items @items, []
            opt.take_items = prompt_take_items @items, []
            if opt.give_items.any? and opt.take_items.any?
                opt.barter = prompt_approval "Label this option as a Barter?"
            end
            @options[@current].push(opt)
        end
    end

    def edit_option args
        _, index = args
        opt = @options[@current][index.to_i]
        opt.edit
        opt.give_items = prompt_give_items @items, opt.give_items
        opt.take_items = prompt_take_items @items, opt.take_items
        if opt.give_items.any? and opt.take_items.any?
            opt.barter = prompt_approval "Label this option as a Barter?"
        end
    end

    def delete_option args
        _, index = args
        puts "Delete option ##{index}:"
        @options[@current].delete_at(index.to_i)
    end

    def current_situation
        @situations[@current]
    end

    def set_start args
        _, id = args
        @start_situation = id
    end

    def set_start_items _
        @start_items = prompt_start_items @items, @start_items
    end

    def goto args
        _, id = args
        if @situations.has_key? id
            puts "Moving from #{@current} -> #{id}"
            @current = id
        else
            puts "Situation '#{id}' does not yet exist"
            create_sit = prompt_approval "Create Situation #{id}?"
            if create_sit
                add_situation args
                @current = id
            end
        end
        puts "Current situation:"
        show_situation args
    end

    def to_hash
        {
            "items" => Hash[@items.map{|id, item| [id, item.to_hash]}],
            "situations" => Hash[@situations.map{|id, sit| [id, sit.to_hash]}],
            "options" => @options.values.flatten.map {|opt| opt.to_hash},
            "start" => @start_situation,
            "start_items" => @start_items
        }
    end

    def show_json _
        puts JSON.pretty_generate(to_hash)
    end

    def show_graph args
        _, format = args
        unless ["png", "svg"].include? format
            puts "Image format must be 'png' or 'svg'"
            return
        end

        g = GraphViz.new :G, type: :digraph
        graph_nodes = Hash[@situations.map{|id, _| [id, g.add_nodes(id)]}]
        @options.values.flatten.map do |opt|
            g.add_edges(
                graph_nodes[opt.from_id], 
                graph_nodes[opt.to_id],
                "label" => opt.label)
            if opt.back
                g.add_edges(
                    graph_nodes[opt.to_id],
                    graph_nodes[opt.from_id],
                    "label" => "Back") 
            end
        end

        fname = File.join(@story_dirname, "#{@story_id}.#{format}")
        g.output format.to_sym => fname
        puts "Created image of story graph in #{fname}"
    end

    def save_story args
        _, fname = args
        full_fname = File.join @story_dirname, fname
        puts "Saving to #{full_fname}"
        File.open(full_fname, "w") do |f|
            f.write(JSON.pretty_generate(to_hash))
        end
    end

    def load_items items
        items.each do |id, item_data|
            @items[id] = Item.from_hash id, item_data
        end
    end

    def load_situations situations
        situations.each do |id, sit_data|
            fname = File.join @story_dirname, "#{id}.txt"
            @situations[id] = Situation.from_hash id, sit_data, fname
            @options[id] = []
        end
    end

    def load_options options
        options.each do |opt_data|
            opt = Option.from_hash opt_data
            @options[opt.from_id].push(opt)
        end
    end

    def load_story args
        _, fname = args
        full_fname = File.join @story_dirname, fname
        json = File.read(full_fname)
        data = JSON.parse(json)
        load_items data['items']
        load_situations data['situations']
        load_options data['options']
        @start_situation = data['start']
        @start_items = data['start_items']
    end

    def auto_save
        save_file = ".#{@story_id}-save.json"
        if prompt_approval "Save story to #{save_file}?"
            save_story [nil, save_file]
        end
    end

    def auto_load
        save_file = ".#{@story_id}-save.json"
        is_file = File.file?(File.join @story_dirname, save_file)
        if is_file and prompt_approval "Load story from #{save_file}?"
            load_story [nil, save_file]
        end
    end

    def bye _
        auto_save
        puts "Bye!"
        exit 0
    end

    alias quit bye

    def parse_command command
        args = command.split(' ')
        if COMMANDS.include? args[0]
            self.send(args[0], args)
        else
            puts "Bad command! Try 'help' for valid commands"
        end
    end

    # TODO: The cyclomatic complexity is too damn high!
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
                    @options[@current]
                        .each_with_index{|_, i| i.to_s}
                        .grep(pattern)
                else
                    []
                end
            else
                []
            end
        end
    end

    def repl
        puts "Welcome to Barter Story Creator!"
        @story_dirname = prompt_str "Story directory name: "
        FileUtils.mkdir_p(@story_dirname)
        @story_id = File.basename @story_dirname
        @story_id = prompt_edit_str "Story ID for naming files?", @story_id
        auto_load

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
