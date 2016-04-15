'use strict';
const meow = require('meow');
const Bookmark = require('..');

const cli = meow(`
  Usage
    $ bm <comamnd> [options]

  Commands
    add  ....
    rm   ....
    ls   ....
    cd   ....

  Options
    -h, --help  Show help

  Examples
    $
`, {
  alias: {
    h: 'help',
  }
});

if (cli.flags.h || cli.flags.help) {
  console.log(cli.help);
  process.exit(0);
}

new Bookmark(cli).process();
