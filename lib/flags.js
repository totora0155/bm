'use strict';
module.exports = class Flag {
  constructor(flags) {
    this.flags = flags;
  }

  hasName() {
    const name = this.flags.n || this.flags.name;
    if (typeof name === 'boolean' || typeof name === 'undefined') {
      return false;
    }
    return true;
  }

  get name() {
    return this.flags.n || this.flags.name;
  }
}
