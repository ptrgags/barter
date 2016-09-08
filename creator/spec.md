# Story Creator

The story creator program is for making an interactive command line REPL
for making it easy to write stories.

The story creator is really a directed graph editor. Each situation is a
vertex in the graph, and each option is a directed edge from one situation
to another (even to the same vertex)

Unfortunately, graphs are difficult to visualize in text format. However,
the program will be able to export a GraphViz-generated image of the
story graph to a PNG or SVG file.

## Startup:

At startup, Barter Story Creator prompts the user for a story directory.
This is a path to where any situation text files and output files are
stored.

It also prompts you for a story ID. this is a single-word identifier that
by default matches the name of the story directory. This story ID is used
when naming graph diagrams and save files

## Commands:

Item Commands:

* `list_items` - List all items in the story
* `add_item <item_id>` - Create a new item
* `edit_item <item_id>` - Create/Edit an item with id `item_id`
* `delete_item <item_id>` - Delete an item with id `item_id`

Situation Commands

* `list_situations` - List all the situations in the story
* `add_situation <situation_id>` - Create a new situation.
* `edit_situation <situation_id>` - Create/Edit a situation. This will create
    a text file `situations/<situation_id>.txt` where the author can write
    a long description for the situation
* `delete_situation <situation_id>` - Delete a situation and all options
    going to/from the situation. Use with care.
* `show_situation` - Show the current situation and all its options.

Option Commands:

* `list_options` - Show all the options for the current situation
* `add_option <to_situation_id>` - Create/edit an option from the current
    situation vertex to the situation `to_situation_id`.
* `edit_option <option_id>` - Edit existing option with numeric option id.
* `delete_option <option_id>` delete the option with the numeric option id.
    run `list_options` or `show_situation` to find the ID numbers as these
    may change frequently.

General Commands:

* `help` - Show help for each command
* `save_story <fname>` - Save the story in JSON format to file `fname`
* `load_story <fname>` - Load the story in JSON format from file `fname`
* `show_graph <png|svg>` - Compile a Graphviz diagram for the story graph in
    the given format. the output file will be in `story_dir/story_id.png`
    (or `.svg`)
* `goto <situation_id>` - Change the current situation to the one with
    id `<situation_id>`
* `show_json` - Show the current JSON representation
* `set_start <situation_id>` - Set the start node for the story
* `set_start_items` - Set the start items.
