# Barter (2014, 2016)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/242d9adf41f2423981182d0ac9bb8323)](https://www.codacy.com/app/ptrgags/barter?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ptrgags/barter&amp;utm_campaign=Badge_Grade)

Barter is a text-based game I started as an independent study project in my
senior year of high school. Now in college, I am revisiting the idea, revising
the code to use new features of JavaScript.

Barter is a text-based branching-story platform much like
*Choose Your Own Adventure* books or visual novels. However, the game platform
supports items that can be bartered with other characters in the story.

Currently, there is still only a tutorial game to show how the mechanics work,
but I plan to add a full-length story in the near future.

## Usage

To view Barter, simply view https://ptrgags.github.io/barter

To host Barter locally, run `node app.js`. This hosts the static site
on port 3000.

## How it Works

### Story Graph

The story is represented by a graph data structure. Each `Situation` is a
vertex in this graph. A `Situation` is any distinct story element/location.
Some examples include a room description, a section of dialog, or a
story event.

`Option`s are the edges in the graph. They represent some action that
results in a transition from one `Situation` to the next. Each `Option`
can also have two optional lists of items attached to it. One is a list of items
that will be received into the player's inventory. The other is a list of
items the player will have to give up to continue the story.

As the player clicks buttons in the story, the game traverses the graph and
displays the current situation and the options that leave the situation node.

This graph structure allows stories to be very varied in structure. Stories
could be linear in nature, or they could have many branches and cycles depending
on the desired effect.

### Story Files

Each story is contained in a JSON file using the format described below. See
[`tutorial.json`](stories/tutorial.json) for an example.

**Story**:

The whole JSON file is a `Story`. It describes all the data for a single game:

| Key           | Type                        | Description |
|---------------|-----------------------------|-------------|
| `items`       | `{item_id: Item}`           | Master table of items |
| `situations`  | `{situation_id: Situation}` | Master table of situation vertices |
| `options`     | `[Option]`                  | Master array of option edges |
| `start`       | `String`                    | `situation_id` of the start situation |
| `start_items` | `[ItemStack]`               | Array that represents the starting inventory |

Note that `item_id` and `situation_id` are simply `String`s providing unique
IDs for `Item`s and `Situation`s.

**Item**:

An `Item` is an object in the game. Each item is represented in JSON with an
object with the following keys:

| Key | Type | Description |
|-----|------|-------------|
| `name` | `String` | Short name of the item |
| `desc` | `String` | (slightly) longer description of the item. |

**ItemStack**:

An `ItemStack` is simply an `Item` and a positive integer quantity. It is
represented by an array `[item_id, quantity]`

**Situation**:

A `Situation` is a vertex in the story graph. It represents a single room,
event, or other point in a story. It is represented in JSON with an object
with the following keys:

| Key     | Type     | Description |
|---------|----------|-------------|
| `title` | `String` | Title to display in the situation heading |
| `desc`  | `String` | Paragraph that explains the current situation |

**Option**:

An `Option` represents an edge in the story graph. It represents a single choice
in the story. Each option can involve the player giving/taking items, or both
(bartering). An `Option` is represented in JSON by an object with the following
keys:

| Key          | Type           | Required | Description |
|--------------|----------------|----------|-------------|
| `from`       | `situation_id` | Yes      | ID of source situation vertex |
| `to`         | `situation_id` | Yes      | ID of destination situation vertex. Can be the same as from. |
| `desc`       | `String`       | No*      | Description of the option to put on the option button |
| `barter`     | `Boolean`      | No       | If `true`, the button will be labeled "Barter `<give_items>` for `<take_items>`"
| `one_time`   | `Boolean`      | No       | If `true`, this option can only be clicked once per game |
| `give_items` | `[ItemStack]`  | No       | Array of items and quantities the player will lose when selecting this option |
| `take_items` | `[ItemStack]`  | No       | Array of items and quantities the player will gain when selecting this option |


## Future Developments

In the future, I plan to add the following features:

* Story creation program. Story JSON files are time-consuming to make, so it
    would be nice to have a tool to shift the focus away from the file format
    and towards the content.
* Actually write a branching story to make the game playable.
* Allow selecting between multiple stories.
