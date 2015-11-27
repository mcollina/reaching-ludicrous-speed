
var bench = require('fastbench')
var fastparallel = require('fastparallel')()
var neo = require('neo-async')
var async = require('async')
var steed = require('steed')()
var max = 1000000

function benchFastParallel (cb) {
  fastparallel(new State(cb, 2), multiply, [1, 2, 3], done)
}

function benchSteed (cb) {
  steed.map(new State(cb, 2), [1, 2, 3], multiply, done)
}

function State (cb, factor) {
  this.cb = cb
  this.factor = 2
}

function multiply (arg, cb) {
  setImmediate(cb, null, arg * this.factor)
}

function done (err, results) {
  if (err) { return this.cb(err) }

  var acc = 0
  for (var i = 0; i < results.length; i++) {
    acc += results[i]
  }

  this.cb(null, acc)
}

function benchNeo (cb) {
  neo.map([1, 2, 3], function work (arg, cb) {
    setImmediate(cb, null, arg * 2)
  }, function (err, results) {
    if (err) { return cb(err) }

    var acc = 0
    for (var i = 0; i < results.length; i++) {
      acc += results[i]
    }

    cb(null, acc)
  })
}

function benchAsync (cb) {
  async.map([1, 2, 3], function work (arg, cb) {
    setImmediate(cb, null, arg * 2)
  }, function (err, results) {
    if (err) { return cb(err) }

    var acc = 0
    for (var i = 0; i < results.length; i++) {
      acc += results[i]
    }

    cb(null, acc)
  })
}

function benchFastParallelNoClass (cb) {
  fastparallel({ cb: cb, factor: 2 }, multiply, [1, 2, 3], done)
}

if (require.main == module) {
  var run = bench([
    benchFastParallel,
    benchFastParallelNoClass,
    benchSteed,
    benchAsync,
    benchNeo
  ], max)

  run(run)
}
