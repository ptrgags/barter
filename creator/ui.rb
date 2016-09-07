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
