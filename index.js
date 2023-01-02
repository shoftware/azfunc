import NodeCache from 'node-cache';
import { DEFAULT_TTL_SECONDS } from './constants.mjs';

/**
 * Global cache object.
 */
const CACHE = new NodeCache({ stdTTL: DEFAULT_TTL_SECONDS });

/**
 * Retrieve cached value if it exists, otherwise compute it via fallback function and store it.
 * @template T
 * @param {String} key 
 * @param {(function(): Promise<T>)} fallback 
 * @param {Number} ttl 
 * @returns {Promise<T>?}
 */
export async function cached(key, fallback = undefined, ttl = DEFAULT_TTL_SECONDS) {
    if (!key) return null;
    if (!CACHE.has(key) && fallback) CACHE.set(key, await Promise.resolve(fallback?.call()), ttl);
    return CACHE.get(key)
}

/**
 * Send response data via the context object.
 * @param {import('@azure/functions').Context} context 
 * @param {import('@azure/functions').HttpResponse} response 
 * @returns {import('@azure/functions').HttpResponse} response 
 */
export function send(context, response) {
    context.res = response;
    return response;
}

/**
 * Seeded random number generator, from https://stackoverflow.com/a/23304189.
 * @param {number} seed 
 * @returns {function(): number}
 */
export function RandomNumberGenerator(seed) {
    return function () {
        seed = Math.sin(seed) * 10_000;
        return seed - Math.floor(seed);
    };
}

/**
 * Shuffles a copy of the input array.
 * @template T
 * @param {T[]} arr input array
 * @param {object} options optional parameters
 * @param {function(): number} options.rng outputs values between [0-1]
 * @returns {T[]} output array
 */
export function shuffle(arr, { rng = Math.random } = {}) {
    arr = arr.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Traces the performance of the provided function.
 * @template T
 * @param {function(): Promise<T>} func 
 * @param {String} tag 
 * @returns {function(): Promise<T>}
 */
export function trace(func, tag = undefined) {
    tag = tag || func.name;
    return async function () {
        const start = performance.now();
        console.log(`[${tag}] Start.`);
        const result = await func.apply(this, arguments);
        console.log(`[${tag}] Ellapsed: ${Math.round(performance.now() - start)} ms.`);
        return result;
    }
}
