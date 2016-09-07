require "readline"

COMMANDS = [
    "list_options",
    "add_option",
    "delete_option",
    "set_start",
    "goto",
    "save",
    "help",
    "show_json",
    "quit",
    "exit"
].sort

IDS = [
    "intro",
    "ship",
    "deck",
    "cargo"
]

comp_proc = proc do |s|
    buf = Readline.line_buffer
    words = buf.split(' ')
    argc = words.length
    if buf[-1] == ' '
        argc += 1
    end

    pattern = /^#{Regexp.escape(s)}/
    if argc == 1
        COMMANDS.grep(pattern)
    elsif argc == 2
        IDS.grep(pattern)
    else
        []
    end
end

Readline.completion_append_character = " "
Readline.completion_proc = comp_proc

while line = Readline.readline("> ", true)
    puts line
end
