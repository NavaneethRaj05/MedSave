const NodeCache = require('node-cache');

const cache = new NodeCache({
  stdTTL: parseInt(process.env.CACHE_TTL_SECONDS || '3600', 10),
  checkperiod: 600,
});

const get = (key) => cache.get(key);
const set = (key, value, ttl) => (ttl ? cache.set(key, value, ttl) : cache.set(key, value));
const del = (key) => cache.del(key);
const flush = () => cache.flushAll();

module.exports = { get, set, del, flush };
