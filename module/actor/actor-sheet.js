/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class HitosActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["hitos", "sheet", "actor"],
      template: "systems/hitos/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    for (let attr of Object.values(data.data.attributes)) {
      attr.isCheckbox = attr.dtype === "Boolean";
    }
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    let r1 = new Roll("1d10").roll().result;
    let r2 = new Roll("1d10").roll().result;
    let r3 = new Roll("1d10").roll().result;
    let mCM = [r1, r2, r3];
    let label = dataset.label ? `Rolling ${dataset.label}` : '';
    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      sound: CONFIG.sounds.dice,
      content: mCM.sort(function (a, b) { return a - b }),
      flavor: label
    });

    /*if (dataset.roll) {
      let roll = new Roll(dataset.roll, this.actor.data.data);
      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      roll.dice(new rolls(mCM(0), mCM(1), mCM(2)))
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    } else {
      let content = r1.render() + r2.render() + r3.render();
      ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        sound: CONFIG.sounds.dice,
        content: content
      });
    }*/
  }

  /*{"class":"Roll","formula":"3d10","dice":
  [{"class":"Die","faces":10,"rolls":
  [{"roll":5},{"roll":10},{"roll":6}],
  "formula":"3d10","options":{}}],
  "parts":["_d0"],"result":"21","total":21}*/


  _sortmCM(r1, r2, r4) {
    /*let r1 = new Roll("1d10").roll().result;
    let r2 = new Roll("1d10").roll().result;
    let r3 = new Roll("1d10").roll().result;*/
    let mCM = [r1, r2, r3];
    return mCM.sort(function (a, b) { return a - b });
  }

}
