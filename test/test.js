import test from 'ava';
import sinon from 'sinon';
import low from 'lowdb';
import rewire from 'rewire';
import data from './db/bookmark.json';

const db = low()
db.object.defaults = data.defaults;
const Bookmark = rewire('..');
Bookmark.__set__('db', db);

test('defualt (add)', t => {
  const bm = new Bookmark({input: []});
  const spy = sinon.spy(bm, 'add');
  bm.proc();
  t.true(spy.called);
})

test('add', t => {
  const bm = new Bookmark({input: ['add']});
  const spy = sinon.spy(bm, 'add');
  bm.proc();
  t.true(spy.called);
})

test('ls', t => {
  const bm = new Bookmark({input: ['ls']});
  const spy = sinon.spy(bm, 'ls');
  bm.proc();
  t.true(spy.called);
})

test('cd', t => {
  const bm = new Bookmark({input: ['cd']});
  const spy = sinon.spy(bm, 'cd');
  bm.proc();
  t.true(spy.called);
})
