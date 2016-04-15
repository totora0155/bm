'use strict';
const mkdirp = require('mkdirp');
const archy = require('archy');
const low = require('lowdb');
const storage = require('lowdb/file-sync');
const homePath = require('home-path')();
const Flag = require('./flags');
const helpers = require('./helpers');
const getCurrentDirname = helpers.getCurrentDirname;

let db;
try {
  db = low(`${homePath}/.tsum/db.json`, {storage});
} catch (e) {
  mkdirp.sync(`${homePath}/.tsum`);
  db = low(`${homePath}/.tsum/db.json`, {storage});
}

const COMMANDS = [
  'add', 'rm', 'ls', 'cd', 'info'
]

let flag;

module.exports = class Bookmark {
  constructor(cli) {
    this.input = cli.input;
    flag = new Flag(cli.flags);
  }

  process() {
    command.apply(this, this.input);
  }

  add(foldername) {
    let table;
    let name;

    if (foldername) {
      table = db(foldername);
    } else {
      table = db('default');
    }

    if (flag.hasName()) {
      name = flag.name;
    } else {
      name = getCurrentDirname();
    }

    const bookmark = {
      name,
      path: process.cwd(),
      count: 0,
      birthtime: new Date()
    };

    if (typeof table.find({name: bookmark.name}) !== 'undefined') {
      console.error(`Already it's a name(${bookmark.name}) exists`);
      process.exit(1);
    }

    if (typeof table.find({path: bookmark.path}) !== 'undefined') {
      console.error(`Already it'a a path(${bookmark.path}) exists`);
      process.exit(1);
    }

    table.push(bookmark);
  }

  rm(foldername) {
    let table;
    if (foldername) {
      table = db(foldername);
    } else {
      table = db('default');
    }

    const bookmark = table.find({path: process.cwd()})
    if (bookmark === 'undefined') {
      console.error(`Bookmark don't exists in current dir`);
      process.exit(1);
    }

    table.remove(bookmark);
  }

  // cd $(bm cd foldername/bookmarkname)
  cd(bookmarkpath) {
    const paths = bookmarkpath.split('/');
    const foldername = paths[0];
    const bookmarkname = paths[1];

    if (foldername && bookmarkname) {
      const bookmark = db(foldername).find({name: bookmarkname});
      console.log(bookmark.path);
    } else {
      console.error(`${bookmarkpath} is not found`)
      process.exit(1);
    }
  }

  precd() {
  }

  postcd() {
  }

  info(foldername) {
    let table;
    if (foldername) {
      table = db(foldername);
    } else {
      table = db('default');
    }

    const bookmark = table.find({path: process.cwd()})
    if (bookmark === 'undefined') {
      console.error(`Bookmark don't exists in current dir`);
      process.exit(1);
    }

    console.log(JSON.stringify(bookmark, null, 4));
  }

  ls() {
    const result = [];
    Object.keys(db.object).forEach(key => {
      result.push(key);
      db.object[key].forEach(bm => {
        result.push(`    ${bm.name}`);
      });
    });

    console.log(`${result.join('\n')}\n`);
    return result;
  }
}

function command(command, arg) {
  if (typeof command === 'undefined') {
    this.add();
  } else if (~COMMANDS.indexOf(command)) {
    this[command](arg);
  } else {
    console.error('todo');
  }
}

//
// module.exports = function tsum(repo, flags, db) {
//   const matches = repo.match(/\/(.+)$/)
//   if (matches === null) {
//     throw Error('Please wrote `username/reponame`');
//   }
//
//   const reponame = matches[1];
//   const dirname = process.cwd() + '/' + reponame;
//
//   fs.stat(dirname, (err) => {
//     if (!err) {
//       throw Error(`./${reponame} already exists`);
//     }
//
//     const spinner = ora({
//       text: `Cloning ${repo} ...`,
//       color: 'red'
//     });
//
//     spinner.start();
//     const data = {
//       repo,
//       path: dirname,
//       url: formatURL(repo)
//     };
//     Git.Clone(data.url, dirname)
//       .then((repo) => {
//         spinner.stop();
//
//         process.nextTick(() => {
//           console.log(`Cloned into ./${reponame}`);
//           db('clones').push(data);
//         });
//       })
//   });
// };
//
// function formatURL(repo) {
//   return 'https://github.com/' + repo + '.git';
// }
