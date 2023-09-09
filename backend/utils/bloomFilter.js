var BitSet = require("bitset");
var murmur = require("murmurhash-js");

const BLOOM_FILTER_SIZE = 50000;
let bs = new BitSet();

function fillBloomFilter() {
  bs.setRange(0, BLOOM_FILTER_SIZE, 0);
}

function existsInBloomFilter(username) {
  var b1, b2, b3, b4, b5;
  b1 = murmur.murmur3(username, 10) % BLOOM_FILTER_SIZE;
  b2 = murmur.murmur3(username, 11) % BLOOM_FILTER_SIZE;
  b3 = murmur.murmur3(username, 12) % BLOOM_FILTER_SIZE;
  b4 = murmur.murmur3(username, 13) % BLOOM_FILTER_SIZE;
  b5 = murmur.murmur3(username, 14) % BLOOM_FILTER_SIZE;
  if (bs.get(b1) && bs.get(b2) && bs.get(b3) && bs.get(b4) && bs.get(b5)) {
    return true;
  }
  return false;
}

async function updateBloomFilter(username) {
  b1 = murmur.murmur3(username, 10) % BLOOM_FILTER_SIZE;
  bs.set(b1, 1);
  b2 = murmur.murmur3(username, 11) % BLOOM_FILTER_SIZE;
  bs.set(b2, 1);
  b3 = murmur.murmur3(username, 12) % BLOOM_FILTER_SIZE;
  bs.set(b3, 1);
  b4 = murmur.murmur3(username, 13) % BLOOM_FILTER_SIZE;
  bs.set(b4, 1);
  b5 = murmur.murmur3(username, 14) % BLOOM_FILTER_SIZE;
  bs.set(b5, 1);
}

async function createBloomFilter(users) {
  fillBloomFilter();
  var username, b1, b2, b3, b4, b5;
  users.forEach(function (user) {
    username = user.username;
    b1 = murmur.murmur3(username, 10) % BLOOM_FILTER_SIZE;
    bs.set(b1, 1);
    b2 = murmur.murmur3(username, 11) % BLOOM_FILTER_SIZE;
    bs.set(b2, 1);
    b3 = murmur.murmur3(username, 12) % BLOOM_FILTER_SIZE;
    bs.set(b3, 1);
    b4 = murmur.murmur3(username, 13) % BLOOM_FILTER_SIZE;
    bs.set(b4, 1);
    b5 = murmur.murmur3(username, 14) % BLOOM_FILTER_SIZE;
    bs.set(b5, 1);
  });
}

module.exports = { createBloomFilter, existsInBloomFilter, updateBloomFilter };
