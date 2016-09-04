# Story Creator Specifications

The story creator program is for making an interactive command line REPL
for making it easy to write stories.

The story creator is really a directed graph editor. Each situation is a
vertex in the graph, and each option is a directed edge from one situation
to another (even to the same vertex)

Unfortunately, graphs are difficult to visualize in text format. However,
the program will be able to export a GraphViz-generated image of the
story graph to a PNG or SVG file.

## Commands:

Item Commands:

* `list_items` - List all items in the story
* `edit_item <item_id>` - Create/Edit an item with id `item_id`
* `delete_item <item_id>` - Delete an item with id `item_id`

Situation Commands

* `list_situations` - List all the situations in the story
* `edit_situation <situation_id>` - Create/Edit a situation. This will create
    a text file `situations/<situation_id>.txt` where the author can write
    a long description for the situation
* `delete_situation <situation_id>` - Delete a situation and all options
    going to/from the situation. Use with care.

Option Commands:

* `list_options` - Show all the options for the current situation
* `edit_option <to_situation_id>` - Create/edit an option from the current
    situation vertex to the situation `to_situation_id`.
* `delete_option <option_id>` delete the option with the numeric option id.
    run `list_options` or `show_situation` to find the ID numbers as these
    may change frequently.

Story Graph Commands:

* `set_title` - Set the title for the story.
* `export <fname>` - Save the story in JSON format to file `fname`
* `show_graph <png|svg>` - Compile a Graphviz diagram for the story graph in
    the given format.
* `goto <situation_id>` - Change the current situation to the one with
    id `<situation_id>`
* `show_situation` - Show the current situation and all its options.
