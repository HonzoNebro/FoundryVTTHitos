// Import Modules
import { HitosActor } from "./actor/actor.js";
import { HitosActorSheet } from "./actor/actor-sheet.js";
import { HitosItem } from "./item/item.js";
import { HitosItemSheet } from "./item/item-sheet.js";

Hooks.once('init', async function() {

  game.hitos = {
    HitosActor,
    HitosItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = HitosActor;
  CONFIG.Item.entityClass = HitosItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("hitos", HitosActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("hitos", HitosItemSheet, { makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
});