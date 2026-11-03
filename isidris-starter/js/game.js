/* ====================================================================
   ISIDRIS — GAME ENGINE
   This file handles tabs, choices, items, quests and saving.
   Most story editing should happen in game-data.js, NOT here.
   No frameworks, packages or internet access required.
   ==================================================================== */
(() => {
  'use strict';

  const SAVE_KEY = 'isidris-starter-save-v1';
  const SLOT_LABELS = { head: 'Head', body: 'Body', hand: 'Hand', relic: 'Relic' };
  const TABS = ['equipment', 'quests', 'lore', 'map', 'journal'];
  const $ = (id) => document.getElementById(id);
  let state;
  let activeTab = 'equipment';
  let expandedLore = null;

  function freshState() {
    const p = GAME_DATA.player;
    return {
      location: GAME_DATA.firstLocation,
      currentDescription: null,
      notifications: {
        equipment: false,
        quests: false,
        lore: false,
        map: false,
        journal: false
      },
      silver: p.silver,
      renown: p.renown,
      inventory: [...p.inventory],
      equipment: { ...p.equipment },
      knownLore: [...p.knownLore],
      quests: Object.fromEntries(p.quests.map(id => [id, 'active'])),
      flags: {},
      usedChoices: [],
      visited: [GAME_DATA.firstLocation],
      turn: 1,
      journal: [{ turn: 1, text: p.firstJournalEntry }]
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && GAME_DATA.locations[parsed.location] && Array.isArray(parsed.inventory) && Array.isArray(parsed.journal)) {
          return parsed;
        }
      }
    } catch (error) { console.warn('Could not read save:', error); }
    return freshState();
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      $('save-message').textContent = 'Progress saves automatically';
    } catch (error) {
      $('save-message').textContent = 'Saving unavailable in this browser';
      console.warn('Could not save:', error);
    }
  }

  function element(tag, className, textValue) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textValue !== undefined && textValue !== null) el.textContent = textValue;
    return el;
  }

  // Avoid embedding raw HTML from your data: text is treated as text.
  function paragraphs(container, strings, className) {
    for (const line of strings || []) container.append(element('p', className, line));
  }

  function hasItem(itemId) { return state.inventory.includes(itemId); }
  function meetsRequirements(r = {}) {
    if (r.hasItem && !hasItem(r.hasItem)) return false;
    if (r.notItem && hasItem(r.notItem)) return false;
    if (r.flag && !state.flags[r.flag]) return false;
    if (r.notFlag && state.flags[r.notFlag]) return false;
    if (r.questActive && state.quests[r.questActive] !== 'active') return false;
    if (r.questComplete && state.quests[r.questComplete] !== 'complete') return false;
    return true;
  }

  function availableChoices(location) {
    return (location.choices || []).filter(c =>
      !(c.once && state.usedChoices.includes(c.id)) && meetsRequirements(c.requires));
  }

  function log(text) {
    if (text) state.journal.push({ turn: state.turn, text });
    if (state.journal.length > 150) state.journal.shift();
  }

  function applyEffects(e = {}) {
    const previousInventory = state.inventory.length;
    const previousLore = state.knownLore.length;
    const previousQuests = JSON.stringify(state.quests);
    for (const id of e.itemsAdd || []) {
      if (GAME_DATA.items[id] && !hasItem(id)) state.inventory.push(id);
    }
    for (const id of e.itemsRemove || []) {
      state.inventory = state.inventory.filter(item => item !== id);
      for (const slot of Object.keys(state.equipment)) {
        if (state.equipment[slot] === id) state.equipment[slot] = null;
      }
    }
    for (const id of e.loreDiscover || []) {
      if (GAME_DATA.lore[id] && !state.knownLore.includes(id)) state.knownLore.push(id);
    }
    for (const id of e.questsStart || []) {
      if (GAME_DATA.quests[id] && !state.quests[id]) state.quests[id] = 'active';
    }
    for (const id of e.questsComplete || []) {
      if (GAME_DATA.quests[id] && state.quests[id] === 'active') state.quests[id] = 'complete';
    }
    for (const flag of e.flags || []) state.flags[flag] = true;
    if (typeof e.silver === 'number') state.silver += e.silver;
    if (typeof e.renown === 'number') state.renown += e.renown;
    if (state.inventory.length !== previousInventory) {
      state.notifications.equipment = activeTab !== 'equipment';    }
  
    if (state.knownLore.length !== previousLore) {
      state.notifications.lore = activeTab !== 'lore';    }
  
    if (JSON.stringify(state.quests) !== previousQuests) {
      state.notifications.quests = activeTab !== 'quests';    }
  }

  function travelTo(id) {
    if (!GAME_DATA.locations[id]) return;
  
    state.location = id;
  
    if (!state.visited.includes(id)) {
      state.visited.push(id);
      state.notifications.map = activeTab !== 'map';    }
  }

  function takeChoice(choice) {
    if (!availableChoices(GAME_DATA.locations[state.location]).some(c => c.id === choice.id)) return;
  
    state.turn++;
  
    if (choice.once) state.usedChoices.push(choice.id);
  
    applyEffects(choice.effects);
  
    log(choice.result || `You choose to ${choice.label.toLowerCase()}.`);
  
    if (choice.goTo) {
      travelTo(choice.goTo);
      state.currentDescription = null;
    } else {
      state.currentDescription = choice.description || null;
    }
  
    save();
    render();
  }

  function renderScene() {
    const location = GAME_DATA.locations[state.location];
    $('location-title').textContent = location.title;
    $('scene-image').src = location.image;
    $('scene-image').alt = location.imageAlt || location.title;
    $('scene-region').textContent = location.region;
    $('region-indicator').textContent = location.region;
    $('scene-chapter').textContent = location.chapter || 'The World of Isidris';
    $('turn-indicator').textContent = `TURN ${String(state.turn).padStart(3, '0')}`;
    $('character-location').textContent = location.title;
    const description = $('location-description');
    description.replaceChildren();
    paragraphs(description, state.currentDescription || location.description);

    const choices = availableChoices(location);
    $('choice-count').textContent = `${choices.length} available`;
    const list = $('choices');
    list.replaceChildren();
    if (!choices.length) list.append(element('p', 'no-choices', 'There are no further actions here. Check your map to travel elsewhere.'));
    for (const [index, choice] of choices.entries()) {
      const btn = element('button', 'choice-button');
      btn.type = 'button';
      btn.append(element('span', 'choice-number', String(index + 1).padStart(2, '0')));
      const content = element('span');
      content.append(element('span', 'choice-title', choice.label));
      if (choice.hint) content.append(element('span', 'choice-subtitle', choice.hint));
      btn.append(content, element('span', 'choice-arrow', '›'));
      btn.addEventListener('click', () => takeChoice(choice));
      list.append(btn);
    }
  }

  function renderStats() {
    $('game-title').textContent = GAME_DATA.title.toUpperCase();
    document.title = `${GAME_DATA.title} | ${GAME_DATA.subtitle}`;
    $('game-subtitle').textContent = GAME_DATA.subtitle;
    $('game-era').textContent = GAME_DATA.era;
    $('character-name').textContent = GAME_DATA.player.name;
    $('stat-silver').textContent = state.silver;
    $('stat-renown').textContent = state.renown;
    $('stat-visited').textContent = state.visited.length;
  }

  function miniHeading(textValue) { return element('h3', 'mini-heading', textValue); }

  function renderEquipment(root) {
    root.append(element('p', 'tab-intro', 'What you carry, and what you keep close at hand.'));
    root.append(miniHeading('Equipped'));
    const grid = element('div', 'equipment-grid');
    for (const [slot, label] of Object.entries(SLOT_LABELS)) {
      const box = element('div', 'equipment-slot');
      box.append(element('div', 'slot-name', label));
      const item = GAME_DATA.items[state.equipment[slot]];
      box.append(element('div', item ? 'slot-value' : 'slot-value slot-empty', item ? item.name : 'Empty'));
      grid.append(box);
    }
    root.append(grid, miniHeading('Inventory'));
    const list = element('div', 'inventory-list');
    if (!state.inventory.length) list.append(element('p', 'inventory-empty', 'Your pack is empty.'));
    for (const id of state.inventory) {
      const item = GAME_DATA.items[id];
      if (!item) continue;
      const wrapper = element('div', 'inventory-item');
      wrapper.title = item.description || '';
      wrapper.append(element('div', 'item-icon', item.icon || '✧'));
      const info = element('div', 'item-info');
      info.append(element('div', 'item-name', item.name), element('div', 'item-type', item.type || 'Item'));
      wrapper.append(info);
      if (item.slot) {
        const isEquipped = state.equipment[item.slot] === id;
        const btn = element('button', 'item-action', isEquipped ? 'Unequip' : 'Equip');
        btn.type = 'button';
        btn.addEventListener('click', () => {
          state.equipment[item.slot] = isEquipped ? null : id;
          save(); render();
        });
        wrapper.append(btn);
      }
      list.append(wrapper);
    }
    root.append(list);
  }

  function renderQuests(root) {
    root.append(element('p', 'tab-intro', 'Promises made, obligations unfulfilled, and favors remembered.'));
    const entries = Object.entries(state.quests);
    root.append(miniHeading(`Your quests · ${entries.length}`));
    if (!entries.length) root.append(element('p', 'empty-state', 'No quests yet. There may be someone who needs your help.'));
    for (const [id, status] of entries) {
      const q = GAME_DATA.quests[id];
      if (!q) continue;
      const card = element('article', 'quest-card');
      card.append(element('div', `quest-status ${status === 'complete' ? 'complete' : ''}`, status === 'complete' ? '✓ COMPLETED' : '◆ IN PROGRESS'));
      card.append(element('h3', 'quest-title', q.title));
      card.append(element('p', 'quest-description', status === 'complete' ? q.completedText || q.description : q.description));
      root.append(card);
    }
  }

  function renderLore(root) {
    root.append(element('p', 'tab-intro', 'Fragments of history collected as you travel.'));
    root.append(miniHeading(`Collected knowledge · ${state.knownLore.length}`));
    if (!state.knownLore.length) root.append(element('p', 'empty-state', 'No lore has been discovered yet.'));
    for (const id of state.knownLore) {
      const entry = GAME_DATA.lore[id];
      if (!entry) continue;
      const card = element('section', 'lore-card');
      const trigger = element('button', 'lore-toggle');
      trigger.type = 'button';
      const title = element('span');
      title.append(element('span', 'lore-category', entry.category || 'Lore'));
      title.append(element('span', '', entry.title));
      trigger.append(title, element('span', 'lore-chevron', expandedLore === id ? '−' : '+'));
      trigger.setAttribute('aria-expanded', expandedLore === id ? 'true' : 'false');
      trigger.addEventListener('click', () => { expandedLore = expandedLore === id ? null : id; renderTab(); });
      card.append(trigger);
      if (expandedLore === id) {
        const article = element('div', 'lore-article');
        paragraphs(article, entry.paragraphs);
        card.append(article);
      }
      root.append(card);
    }
  }

  function renderMap(root) {
    root.append(element('p', 'tab-intro', 'Travel among the places you have already discovered. More destinations can be added in the story data.'));
    root.append(miniHeading(`Known places · ${state.visited.length}`));
    for (const id of state.visited) {
      const loc = GAME_DATA.locations[id];
      if (!loc) continue;
      const card = element('div', 'map-card');
      card.append(element('span', 'map-marker', id === state.location ? '◆' : '◇'));
      const info = element('div', 'map-info');
      info.append(element('div', 'map-place', loc.title), element('div', 'map-region', loc.region));
      card.append(info);
      const btn = element('button', 'map-btn', id === state.location ? 'Here' : 'Travel');
      btn.type = 'button';
      btn.disabled = id === state.location;
      btn.addEventListener('click', () => {
        state.turn++;
        travelTo(id);
        state.currentDescription = null;
        log(`You return to ${loc.title}.`);
        save(); render();
      });
      card.append(btn);
      root.append(card);
    }
  }

  function renderJournal(root) {
    root.append(element('p', 'tab-intro', 'The events of your journey, newest first.'));
    root.append(miniHeading(`Recorded events · ${state.journal.length}`));
    for (const entry of [...state.journal].reverse()) {
      const card = element('div', 'journal-entry');
      card.append(element('div', 'journal-time', `TURN ${String(entry.turn).padStart(3,'0')}`));
      card.append(element('p', 'journal-text', entry.text));
      root.append(card);
    }
  }

  function renderTab() {
    const root = $('tab-panel');
    root.replaceChildren();
    root.setAttribute('aria-labelledby', `tab-${activeTab}`);
    for (const btn of document.querySelectorAll('.tab')) {
      const selected = btn.dataset.tab === activeTab;
      btn.classList.toggle('active', selected);
      btn.setAttribute('aria-selected', String(selected));
      btn.tabIndex = selected ? 0 : -1;
      btn.classList.toggle('has-notification', !!state.notifications[btn.dataset.tab]);
    }
    if (activeTab === 'equipment') renderEquipment(root);
    else if (activeTab === 'quests') renderQuests(root);
    else if (activeTab === 'lore') renderLore(root);
    else if (activeTab === 'map') renderMap(root);
    else if (activeTab === 'journal') renderJournal(root);
  }

  function setTab(name) {
    if (!TABS.includes(name)) return;
  
    activeTab = name;
    state.notifications[name] = false;
  
    save();
    renderTab();
  }

  function render() { renderStats(); renderScene(); renderTab(); }

  function init() {
    state = load();
    state.notifications = {
      equipment: false,
      quests: false,
      lore: false,
      map: false,
      journal: false,
      ...state.notifications
    };
    for (const btn of document.querySelectorAll('.tab')) {
      btn.addEventListener('click', () => setTab(btn.dataset.tab));
      btn.addEventListener('keydown', event => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const index = TABS.indexOf(btn.dataset.tab);
        const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
        setTab(TABS[next]);
        $(`tab-${TABS[next]}`).focus();
      });
    }
    $('reset-game').addEventListener('click', () => {
      if (!window.confirm('Start a new game? This will erase your saved progress in this browser.')) return;
      state = freshState();
      activeTab = 'equipment';
      expandedLore = null;
      save(); render();
    });
    $('scene-image').addEventListener('error', () => {
      // If a custom picture is missing, show a tinted blank scene instead of a broken-image icon.
      $('scene-image').style.visibility = 'hidden';
    });
    $('scene-image').addEventListener('load', () => { $('scene-image').style.visibility = 'visible'; });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
