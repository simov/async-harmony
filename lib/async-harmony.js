
(function (name, root, factory) {
  if (typeof exports == 'object')
    module.exports = factory();
  else if (typeof define == 'function' && define.amd)
    define(factory);
  else
    root[name] = factory();

}('async', this, function () {
'use strict';


function check (errors) {
  return Object.keys(errors).length ? errors : null;
}


function series (jobs, done, kill=true) {
  var args = {}, results = {}, errors = {};

  var it = iterator();
  it.next();

  function* iterator () {
    for (let job in jobs) {
      yield jobs[job](args, (err, result, quit) => {
        if (kill && err) return done(err);
        if (err) errors[job] = err;
        args[job] = results[job] = result||null;
        if (quit) return done(check(errors), results, quit);
        setTimeout(() => it.next(), 0);
      });
    }
    done(check(errors), results);
  }
}


function eachSeries (items, job, done, kill=true) {
  var results = [], errors = [];

  var it = iterator();
  it.next();

  function* iterator () {
    for (let item of items) {
      yield job(item, (err, result, quit) => {
        if (kill && err) return done(err);
        if (err) errors.push(err);
        results.push(result||null);
        if (quit) return done(check(errors), results, quit);
        setTimeout(() => it.next(), 0);
      });
    }
    done(check(errors), results);
  }
}


function each (items, job, done, kill=false) {
  var results = [], errors = [];
  var total = items.length, completed = 0;
  var terminated = false;

  var it = iterator();
  it.next();

  function* iterator () {
    for (let item of items) {
      yield (() => {
        job(item, (err, result, quit) => {
          if (terminated) return;
          if (kill && err) {
            terminated = true;
            return done(err);
          }
          if (err) errors.push(err);
          results.push(result||null);

          if (quit) {
            terminated = true;
            return done(check(errors), results, quit);
          }

          if (total == ++completed)
            done(check(errors), results);
        });
        setTimeout(() => it.next(), 0);
      })();
    }
  }
}


function eachLimit (limit, items, job, done, kill=false) {
  var results = [], errors = [];
  var total = items.length;
  var completed = 0, started = 0, running = 0;
  var terminated = false;

  var it = iterator();
  it.next();

  function* iterator () {
    yield (() => {
      while (running < limit && started < total) {
        started++;
        running++;

        job(items[started-1], (err, result, quit) => {
          if (terminated) return;
          if (kill && err) {
            terminated = true;
            return done(err);
          }

          if (err) errors.push(err);
          results.push(result||null);

          if (quit) {
            terminated = true;
            return done(check(errors), results, quit);
          }

          completed++;
          running--;

          if (completed >= total)
            return done(check(errors), results);

          setTimeout(() => it.next(), 0);
        });
      }
    })();
    yield* iterator();
  }
}


function parallel (jobs, done, kill=false) {
  var results = {}, errors = {};
  var total = Object.keys(jobs).length, completed = 0;
  var terminated = false;

  var it = iterator();
  it.next();

  function* iterator () {
    for (let job in jobs) {
      yield (() => {
        jobs[job](((job) => ((err, result, quit) => {
          if (terminated) return;
          if (kill && err) {
            terminated = true;
            return done(err);
          }
          if (err) errors[job] = err;
          results[job] = result||null;

          if (quit) {
            terminated = true;
            return done(check(errors), results, quit);
          }
          
          if (total == ++completed)
            done(check(errors), results);
        }))(job));
        setTimeout(() => it.next(), 0);
      })();
    }
  }
}


function parallelLimit (limit, jobs, done, kill=false) {
  var results = {}, errors = {};
  var keys = Object.keys(jobs), total = keys.length;
  var completed = 0, started = 0, running = 0;

  var it = iterator();
  it.next();
  
  function* iterator () {
    yield (() => {
      while (running < limit && started < total) {
        started++;
        running++;
        var job = keys[started-1];

        jobs[job](((job) => ((err, result) => {
          if (kill && err) return done(err);

          if (err) errors[job] = err;
          results[job] = result||null;

          completed++;
          running--;

          if (completed >= total)
            return done((Object.keys(errors).length ? errors : null), results);

          setTimeout(() => it.next(), 0);
        }))(job));
      }
    })();
    yield* iterator();
  }
}


function forever (job, done) {
  var it = iterator();
  it.next();

  function* iterator () {
    yield job((err) => {
      if (err) return done(err);
      setTimeout(() => it.next(), 0);
    });
    yield* iterator();
  }
}


function until (test, job, done) {
  var it = iterator();
  it.next();

  function* iterator () {
    yield job((err) => {
      if (err) return done(err);
      if (test()) return done();
      setTimeout(() => it.next(), 0);
    });
    yield* iterator();
  }
}


function whilst (test, job, done) {
  var it = iterator();
  it.next();

  function* iterator () {
    yield job((err) => {
      if (err) return done(err);
      if (!test()) return done();
      setTimeout(() => it.next(), 0);
    });
    yield* iterator();
  }
}


return {
  series: series,
  
  eachSeries: eachSeries,
  each: each,
  eachLimit: eachLimit,

  parallel: parallel,
  parallelLimit: parallelLimit,

  forever: forever,
  until: until,
  whilst: whilst
};


}));
