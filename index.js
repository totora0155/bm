'use strict';
const mkdirp = require('mkdirp');
const archy = require('archy');
const low = require('lowdb');
const storage = require('lowdb/file-sync');
const homePath = require('home-path')();

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

module.exports = class Bookmark {
  constructor(cli) {
    this.input = cli.input;
    this.flags = cli.flags;
  }

  proc() {
    command.apply(this, this.input);
  }

  add() {
    // if (this.flags.f || this.flags.folder) {}
  }

  rm() {
    // if (this.flags.f || this.flags.folder) {}
  }

  createFolder(name) {
  }

  removeFolder(name) {
  }

  cd(name) {
  }

  precd() {
  }

  postcd() {
  }

  info() {
  }

  ls() {
    const result = [];
    Object.keys(db.object).forEach(key => {
      result.push(key);
      db.object[key].forEach(bm => {
        result.push(`    ${bm.name}`);
      });
    });

    console.log(result.join('\n'));
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
