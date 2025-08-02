/**
 * LRU (Least Recently Used) Cache implementation
 * with TTL (Time To Live) support
 */
class LRUCache {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 100;
    this.defaultTTL = options.defaultTTL || 600000; // 10 minutes default
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      expired: 0
    };
    
    // For request deduplication
    this.pendingRequests = new Map();
    
    console.log(`🗄️ LRUCache: Initialized with maxSize=${this.maxSize}, defaultTTL=${this.defaultTTL}ms`);
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {any} Cached value or undefined
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      this.stats.expired++;
      this.stats.misses++;
      return undefined;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    this.stats.hits++;
    return entry.value;
  }

  /**
   * Set a value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  set(key, value, ttl = null) {
    // If cache is at max size, remove least recently used
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      this.stats.evictions++;
    }

    const entry = {
      value,
      expiry: Date.now() + (ttl || this.defaultTTL),
      created: Date.now()
    };

    // If key exists, delete first to ensure it's moved to end
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    this.cache.set(key, entry);
  }

  /**
   * Check if key exists and is not expired
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      this.stats.expired++;
      return false;
    }
    
    return true;
  }

  /**
   * Delete a key from cache
   * @param {string} key - Cache key
   * @returns {boolean} True if key existed
   */
  delete(key) {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
    console.log('🧹 LRUCache: Cache cleared');
  }

  /**
   * Get cache size
   * @returns {number}
   */
  size() {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   * @returns {object}
   */
  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: this.stats.hits > 0 
        ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      expired: 0
    };
  }

  /**
   * Get all keys in cache
   * @returns {string[]}
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache entries with metadata
   * @returns {object[]}
   */
  entries() {
    const entries = [];
    for (const [key, entry] of this.cache.entries()) {
      entries.push({
        key,
        expiry: entry.expiry,
        created: entry.created,
        ttl: entry.expiry - Date.now(),
        expired: Date.now() > entry.expiry
      });
    }
    return entries;
  }

  /**
   * Deduplicate concurrent requests for the same key
   * @param {string} key - Cache key
   * @param {Function} fetchFn - Async function to fetch data
   * @returns {Promise<any>}
   */
  async dedupe(key, fetchFn) {
    // Check cache first
    const cached = this.get(key);
    if (cached !== undefined) {
      return cached;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // Create new request promise
    const promise = fetchFn().then(
      (result) => {
        this.pendingRequests.delete(key);
        return result;
      },
      (error) => {
        this.pendingRequests.delete(key);
        throw error;
      }
    );

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * Warm the cache with frequently accessed data
   * @param {object[]} entries - Array of {key, value, ttl} objects
   */
  warm(entries) {
    let warmed = 0;
    for (const entry of entries) {
      if (!this.has(entry.key)) {
        this.set(entry.key, entry.value, entry.ttl);
        warmed++;
      }
    }
    console.log(`🔥 LRUCache: Warmed ${warmed} entries`);
  }

  /**
   * Prune expired entries
   * @returns {number} Number of pruned entries
   */
  prune() {
    let pruned = 0;
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
        pruned++;
      }
    }
    
    if (pruned > 0) {
      console.log(`✂️ LRUCache: Pruned ${pruned} expired entries`);
    }
    
    return pruned;
  }
}

module.exports = LRUCache;