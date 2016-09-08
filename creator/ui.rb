# Prompt the user to enter a line of text
def prompt_str prompt
    print prompt
    line = gets || ""
    line.chomp
end


# Prompt the user to enter a line of text to replace
# an old string value. An empty response means keep the
# old value.
def prompt_edit_str prompt, old_val
    puts "Old Value: #{old_val}"
    print "#{prompt} [blank = keep old val]: "
    line = gets || ""
    if line.chomp.empty?
        old_val
    else
        line.chomp
    end
end

# Prompt for y/n/yes/no
# as a case-insensitive match and returns a bool
# anything other than y/n/yes/no returns the default
# value
def prompt_approval prompt, default=false
    print "#{prompt} [y/n]: "
    answer = gets || ""
    answer = answer.chomp.downcase
    if ['y', 'yes'].include? answer
        true
    elsif ['n', 'no'].include? answer
        false
    else
        default
    end
end

def prompt_items items, start_items=nil
    puts "Enter items and quantities in the following format"
    puts "<item_id> <quantity>"
    puts "if quantity is 0, the item will be removed"
    puts "Enter 'help' for list of items"
    puts "Enter a blank line when done"

    item_stacks = Hash.new(0)
    unless start_items.nil?
        start_items.each{|id, quant| item_stacks[id] = quant}
    end

    loop do
        puts "Current item list:"
        item_stacks.each do |id, quant| 
            if quant > 0
                puts "#{id}: #{quant}"
            end
        end

        line = prompt_str "--> " 
        break if line.empty?

        # Display help
        if line == 'help'
            puts "===================="
            puts "item_id: name"
            puts "--------------------"
            items.each {|id, item| puts "#{id}: #{item.name}"}
            puts "===================="
            next
        end

        item_id, quantity = line.split " "
        quantity = Integer(quantity) rescue nil
        if quantity.nil?
            puts "Quantity must be an integer. try again"
        elsif not items.has_key? item_id
            create_item = prompt_approval "Item #{item_id} doesn't exist. Create it?"
            if create_item
                puts "Creating item #{item_id}"
                items[item_id] = Item.from_input item_id
                item_stacks[item_id] = quantity
            else
                puts "Skipping..."
            end
        else
            item_stacks[item_id] = quantity
        end
    end
    item_stacks.reject{|id, quant| quant < 1}.to_a
end


# TODO: Ew ew refactor this!
def prompt_give_items items, start_items=nil
    if prompt_approval "Does the player need item(s) to select this option?"
        prompt_items items, start_items
    else
        []
    end
end

def prompt_take_items items, start_items=nil
    if prompt_approval "Does the player get item(s) from this option?"
        prompt_items items, start_items
    else
        []
    end
end

def prompt_start_items items, start_items=nil
    if prompt_approval "Does the player start with any item(s)?"
        prompt_items items, start_items
    else
        []
    end
end
