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
