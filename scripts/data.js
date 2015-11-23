//Data for the items
//Format:
//id: [name, description, type]
var itemsRaw = {
    pencil: ["Pencil", "A spare pencil I brought with me for the exam.",    "item"],
    paper:  ["Paper", "A sheet of paper.",                                  "key-item"],
    lead:   ["Pencil Lead", "Mechanical pencil lead.",                      "key-item"],
    eraser: ["Eraser", "An eraser.",                                        "key-item"],
    pen:    ["Pen", "A pen. I need this for the exam.",                     "key-item"]
};
//Data for the options
//Format:
//id: [name, type, next, requiredItem, requiredQuantity, item, quantity, onetime]
var optionsRaw = {
    next1:      ["Continue",            "goto",     "classroom",    null, null,     null, null,     false   ],
    spkNancy:   ["Speak with Nancy",    "goto",     "nancy",        null, null,     null, null,     false   ],
    spkSara:    ["Speak with Sara",     "goto",     "sara",         null, null,     null, null,     false   ],
    spkGeorge:  ["Speak with George",   "goto",     "george",       null, null,     null, null,     false   ],
    spkBiff:    ["Speak with Biff",     "goto",     "biff",         null, null,     null, null,     false   ],
    srchRoom:   ["Search Room",         "goto",     "srchRoom",     null, null,     null, null,     false   ],
    exam:       ["Take Exam",           "give",     "exam",         "pen", 1,       null, null,     false   ],
    barter1:    ["Barter",              "barter",   "classroom",    "pencil", 1,    "lead", 1,      true    ],
    barter2:    ["Barter",              "barter",   "classroom",    "paper", 1,     "lead", 1,      true    ],
    back:       ["Back",                "goto",     "classroom",    null, null,     null, null,     false   ],
    barter3:    ["Barter",              "barter",   "classroom",    "lead", 2,      "eraser", 1,    true    ],
    barter4:    ["Barter",              "barter",   "classroom",    "eraser", 1,    "pen", 1,       true    ],
    srchTrash:  ["Search Trash Can",    "goto",     "srchTrash",    null, null,     null, null,     true    ],
    srchFloor:  ["Search Floor",        "goto",     "srchFloor",    null, null,     null, null,     false   ],
    next2:      ["Continue",            "get",      "classroom",    null, null,     "paper", 1,     false   ],
};
//Data for the situations
//Format: 
//id: [title, description, options]
//Where options is an array of option IDs
var situationsRaw = {
    intro:      ["Intro", "You are in a classroom the day of the math exam. You came prepared with an extra pencil, but when you arrived, you saw a note on the board: “Exams will be written in pen ONLY”. You realize you will have to obtain a pen from someone, as you do not have any. You consider asking Biff, who always seems to have extra school supplies.",
                ["next1"]],
    classroom:  ["Classroom", "You are in the classroom. What do you do?",
                ["spkNancy", "spkSara", "spkGeorge", "spkBiff", "srchRoom", "exam"]],
    nancy:      ["Nancy", "<b>Nancy</b>: Sorry, I don’t have an extra pen to give you. I have a bunch of mechanical pencil lead though if you want to trade something for it.",
                ["barter1", "barter2", "back"]],
    sara:       ["Sara", "<b>Sara</b>: I don’t have anything to give you, but I know that George has erasers, Biff has pens, and Nancy has mechanical pencil leads.",
                ["back"]],
    george:     ["George", "<b>George</b>: I don’t have a pen but I have an eraser! You can have it if you can get me a couple of mechanical pencil leads.",
                ["barter3", "back"]],
    biff:       ["Biff", "<b>Biff</b>: I have an extra pen you could have, but I will need something in return. I could use an extra eraser; I have another exam after this one.",
                ["barter4", "back"]],
    srchRoom:   ["Search Room", "Where would you like to search?",
                ["srchTrash", "srchFloor"]],
    srchTrash:  ["Search Trash Can", "The only thing in the trashcan is a blank sheet of loose-leaf paper with a few creases in it. You think it might be useful.",
                ["next2"]],
    srchFloor:  ["Search Floor", "You search the floor. You find nothing but dust.",
                ["next1"]],
    exam:       ["Exam", "Pen in hand, you sit down just in time to take the exam.<br/><br/><b>Tutorial Complete!</b>",
                []],
};