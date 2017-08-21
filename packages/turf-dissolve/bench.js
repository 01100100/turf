const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const dissolve = require('./');

const directory = path.join(__dirname, 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
    return {
        name: path.parse(filename).name,
        geojson: load.sync(directory + filename)
    };
});

/**
 * Single Process Benchmark
 *
 * polysByProperty: 64.173ms
 * polysWithoutProperty: 44.453ms
 */
for (const {name, geojson} of fixtures) {
    const propertyName = geojson.propertyName;
    console.time(name);
    dissolve(geojson, propertyName);
    console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * polysByProperty x 425 ops/sec ±7.64% (73 runs sampled)
 * polysWithoutProperty x 238 ops/sec ±11.04% (59 runs sampled)
 */
const suite = new Benchmark.Suite('turf-dissolve');
for (const {name, geojson} of fixtures) {
    const propertyName = geojson.propertyName;
    suite.add(name, () => dissolve(geojson, propertyName));
}

suite
    .on('cycle', e => console.log(String(e.target)))
    .on('complete', () => {})
    .run();