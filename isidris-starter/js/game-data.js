/* ====================================================================
   ISIDRIS — YOUR STORY CONTENT
   THIS IS THE FILE YOU WILL EDIT MOST OFTEN.

   Replace the example people, places, pictures and text with your own.
   No coding knowledge is needed to change ordinary text or image paths.

   The text and names below are DEMO CONTENT, not proposed game canon.
   See README.md for instructions on adding new scenes and choices.
   ==================================================================== */

const GAME_DATA = {
  title: "Isidris",
  subtitle: "After the Drowning",
  era: "The first years of exile",
  firstLocation: "moris-office", // Must match a location ID below.

  player: {
    name: "The Wanderer",
    silver: 12,
    renown: 0,
    inventory: ["weathered-cloak", "fishing-knife"],
    equipment: {
      head: null,
      body: "weathered-cloak",
      hand: "fishing-knife",
      relic: null
    },
    knownLore: ["the-drowning"],
    quests: [],
    firstJournalEntry: "You have come to the shores of the Outer Isles, where the people of Isidris are beginning again."
  },

  /* EQUIPMENT & INVENTORY
     slot can be: "head", "body", "hand", "relic", or null (not wearable).
     icon can be any short symbol or emoji. */
  items: {
    "weathered-cloak": {
      name: "Weathered cloak", type: "Clothing", slot: "body", icon: "♜",
      description: "A salt-stiff cloak, patched more times than its owner remembers."
    },
    "fishing-knife": {
      name: "Fishing knife", type: "Tool", slot: "hand", icon: "⚔",
      description: "A short working blade, serviceable but unremarkable."
    },
    "shell-talisman": {
      name: "Talisman of shells", type: "Charm", slot: "relic", icon: "✧",
      description: "A string of pale shells given by an exile singer."
    },
    "merchant-seal": {
      name: "Merchant's seal", type: "Quest item", slot: null, icon: "◈",
      description: "An old trade seal, stamped with the device of a vanished city."
    }
  },

  /* LORE ENTRIES
     Players can read an entry after a choice has a
     "loreDiscover" effect referencing its ID. */
  lore: {
    "areeris": {
      title: "Areeris", category: "Geography",
      paragraphs: [
        "A village outside Afanis, most notable for the remains of an old Isidrean fort nearby.",
      ]
    },
    "exile-songs": {
      title: "Songs of the Exiles", category: "Peoples & customs",
      paragraphs: [
        "Families arriving from the drowned island preserve their memories in songs and recited genealogies.",
        "Every harbor has its own version, and the versions do not always agree."
      ]
    },
    "old-sea-roads": {
      title: "The Old Sea Roads", category: "Places & trade",
      paragraphs: [
        "Isidrean merchants once sailed between the many islands and shores of the Inner Sea.",
        "A single language of trade persists even as the old political order comes apart."
      ]
    }
  },

  /* QUESTS
     Quest status is updated by choices, not by editing this definition. */
  quests: {
    "hoardfinder": {
      title: "The Hoardfinder",
      description: "You are commissioned to find and secure a hoard of antique Isidrean coins for the Mineeris family trading firm.",
      completedText: "You recovered the seal and returned it to the scribe. The last cargo can finally be accounted for."
    },
    "find-caris-imine": {
      title: "Find Caris Imine",
      description: "The Isidrean nobleman invites you to meet with him, if you find any antiques in the countryside.",
      completedText: "You recovered the seal and returned it to the scribe. The last cargo can finally be accounted for."
    }

  },

  /* LOCATIONS
     To add a new one, duplicate a location block and give it a new ID.
     Put its picture in assets/scenes/ and change the image path.

     CHOICES CAN HAVE THESE OPTIONAL FIELDS:
       id:         Unique identifier for the choice.
       label:      The clickable action text.
       hint:       Smaller text under the action.
       result:     Message displayed in the journal and dispatch box.
       goTo:       Another location ID (changes the current scene).
       once:       true = choice disappears once used.
       requires:   Conditions controlling whether choice is visible.
       effects:    Change inventory, quests, money, etc. (see examples).
  */
  locations: {
    "moris-office": {
      title: "The Office of Moris Aglad",
      region: "Afanis",
      chapter: "Quest I · A Lucrative Commission",
      image: "assets/scenes/salt-steps.svg", // Replace with your PNG/JPG/WebP if you like.
      imageAlt: "Stone harbor steps, ships, and a distant island in an overcast sea.",
      description: [
        `You are seated before Moris Aglad, senior merchant trading with the firm of the Mineeris family.`,
        `He scrawls numbers in a large book, as though unconsciously, as he speaks to you.`,
        `"I've received a large contract from an noble Isidrean family,' he says, 'They have a standing order for as many antique coins as I can get my hands on. They live at Tonisroc; I guess they're going to want to flaunt them at court."`,
        `He pauses and checks something in the ledger; he humbles to himself as he works out the numbers, nods, then returns to you,`,
        `"There's loads of ancient hoards all around the countryside. I want you to locate one and bring it back here. I want to send them something soon, as a gesture of good will and good services, so all I need is one good hoard."`,
        `"I recommend you ask around -- someone, I'm sure, knows where you might find one."`
      ],
      choices: [
        {
          id: "go-nearby-marketplace", label: "Go to the nearby marketplace",
          hint: "You hear merchant's hawking goods and a loud hubbub right outside.",
          goTo: "nearby-marketplace",
          effects: { questsStart: ["hoardfinder"] }
        },
        {
          id: "go-afanis-harbor", label: "Go to the harbor",
          hint: "From the window, you can just make out great masts and flowing sails over the apartment blocks.",
          goTo: "afanis-harbor",
          effects: { questsStart: ["hoardfinder"] }
        },
        {
          id: "go-nearby-tavern", label: "Go to a nearby tavern",
          hint: "Just down the road, you see, hear, and smell a riot of people inside a large tavern.",
          goTo: "nearby-tavern",
          effects: { questsStart: ["hoardfinder"] }
        }
      ]
    },

    "nearby-marketplace": {
      title: "Market of Nayleer",
      region: "Afanis",
      chapter: "Quest I · A Lucrative Commission",
      image: "assets/scenes/refugee-quarter.svg",
      imageAlt: "Canvas shelters and low stone houses clustered around a courtyard.",
      description: [
        "The market is bustling with men, women, and children of all ages. The streets are packed -- some merchants have set up stalls, others pile their goods in heaps.",
        "As you walk the market, you see three people who may have information."
      ],
      choices: [
        {
          id: "question-produce-sellers", label: "Question a group of produce sellers.",
          hint: "A group of women standing by a couple carts, loaded with terrestial produce.", once: true,
          description: 
           [`The women tell you that they are from the village of Fanar, and that as far as they know, no one has found or knows of any hoards in their area.`],
          result: "You learned of the village Fanar.",
        },
        {
          id: "question-isidrean-noble", label: "Question an Isidrean noble",
          hint: "A man whose features and dress tell you he is from Isidrean nobility is seated on a horse.", once: true,
          description: 
           [`He speaks to you from down his horse,.`,
            `"I know nothing about antique coins, other than that people find them here and there. Isidreans traded here for centuries, you know, and we used to occupy the land, too, way back when. Perhaps you can find one around an old fortress?"`,
            `He thinks a moment, and adds,`,
            `"If you find any, let me know. My name is Caris Imine. I live near the harbor in the apartments of Deeris. I've been thinking of collecting myself, you know."`],
          effects: {
          questsStart: ["find-caris-imine"],
          },
          result: "You met Caris Imine.",
        },
        {
          id: "question-beggar", label: "Question a beggar",
          hint: "A man wrapped in shoddy cloth sits by temple steps, watching the ground silently.", once: true,
          description:
          [`The man looks up at you and barks out in a dialect you have never heard before and only partly understand,`,
            `"I came to this city looking for a hoard of gold, too. You think I found it?"`,
            `He lifts up the palm of his hand to you and smiles.`],
          result: "You met the beggar.",
        },
        {
          id: "market-to-harbor", label: "Go to the harbor",
          goTo: "afanis-harbor",
        },
        {
          id: "market-to-tavern", label: "Go to a nearby tavern",
          goTo: "nearby-tavern",
        },
      ]
    },

    "afanis-harbor": {
      title: "The harbor of Afanis",
      region: "Afanis",
      chapter: "Chapter I · A Lucrative Commission",
      image: "assets/scenes/watchtower.svg",
      imageAlt: "An ancient watchtower atop a rocky cliff overlooking the harbor.",
      description: [
        `The harbor of Afanis is immense -- centuries of world-wide commerce made it nearly as large as those of the great port-cities of Isidris, in the days of its glory. Now, it is the biggest and busiest harbor on earth.`,
        `As you walk, you see two people who interest you.`,
      ],
      choices: [
        {
          id: "question-captain", label: "Question the ship captain",
          hint: "He is shouting orders and directing his crew as they load his ship.", once: true,
          description:
          [`The captain turns to you and says that he is not from this place -- couldn't you tell? He tells you you'd better ask a native.`],
          result: "You spoke to the ship captain.",
        },
        {
          id: "question-sailor", label: "Question a nearby sailor",
          hint: "He is leaning on a pile of boxes, watching the sea.", once: true,
          description:
          [`The sailor lazily moves his head away from the sea to look at you. Although slow to move, in his eye you see excitement as he says,`,
            `"I'm from the village of Areeris, not far from here. We have an old camp by us, with old stockades and a ditch that's been mostly filled in. Some people, when I was younger, found a couple hoards there. Others have looked and didn't find any."`,
            `"I tell you, though, I think there's more to be found there, if you look in the right place.`,],
          result: "The charts record a web of sea roads that once connected distant ports to Isidris.",
          effects: { loreDiscover: ["areeris"] }
        },
        {
          id: "harbor-to-market", label: "Go to the Market of Nayleer",
          goTo: "nearby-market",
        },
        {
          id: "habor-to-tavern", label: "Go to a nearby tavern",
          goTo: "nearby-tavern",
        },
      ]
    },

    "nearby-tavern": {
      title: "The tavern",
      region: "Afanis",
      chapter: "Chapter I · A Lucrative Commission",
      image: "assets/scenes/tavern.png",
      imageAlt: "An ancient watchtower atop a rocky cliff overlooking the harbor.",
      description: [
        `The tavern is packed with people. It smells acridly of smoke and alcohol.`,
        `No one looks up as you come in. In the center of the taven, a large group of people is holding onto each other and swaying, singing a song that is vaguely familiar.`,
        `You make your way over to the woman tending the stew pot.`
      ],
      choices: [
        {
          id: "question-cook", label: "Question the cook",
          hint: "She is sweating as she stirs the sides of the large cauldron.", once: true,
          description:
          [`She wipes her brow and tells you,.`,
            `"If you're looking for information about inland, you've come to the wrong place. Most of our people here are sailors and sailors' sons, who've never gone outside the walls of Afanis -- hell, who've never gone beyond this tavern.`,
            `She gives another stir of the pot, and continues,`,
            `Maybe you'll find an adventurer here or two, but I'd probably look somewhere else.`],
          result: "You spoke to the tavern cook.",
        },
        {
          id: "tavern-to-market", label: "Go to the Market of Nayleer",
          goTo: "nearby-market",
        },
        {
          id: "tavern-to-harbor", label: "Go to the harbor",
          goTo: "afanis-harbor",
        },
      ]
    }
  }
};
