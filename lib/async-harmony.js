
(function (name, root, factory) {
    if (typeof exports == 'object')
        module.exports = factory();
    else if (typeof define == 'function' && define.amd)
        define(factory);
    else
        root[name] = factory();

}('async', this, function () {
'use strict';


function series (jobs, done, kill=true) {
    var args = {}, results = {}, errors = {};

    var it = iterator();
    it.next();

    function* iterator () {
        for (let job in jobs) {
            yield jobs[job](args, (err, result) => {
                if (kill && err) return done(err);
                if (err) errors[job] = err;
                args[job] = results[job] = result||null;
                setTimeout(() => it.next(), 0);
            });
        }
        done((Object.keys(errors).length ? errors : null), results);
    }
}


function eachSeries (items, job, done, kill=true) {
    var results = [], errors = [];

    var it = iterator();
    it.next();

    function* iterator () {
        for (let item of items) {
            yield job(item, (err, result) => {
                if (kill && err) return done(err);
                if (err) errors.push(err);
                results.push(result||null);
                setTimeout(() => it.next(), 0);
            });
        }
        done((errors.length ? errors : null), results);
    }
}


function each (items, job, done, kill=false) {
    var results = [], errors = [];
    var total = items.length, finished = 0;

    var it = iterator();
    it.next();

    function* iterator () {
        for (let item of items) {
            yield (() => {
                job(item, (err, result) => {
                    if (total == -1) return;
                    if (kill && err) {
                        total = -1;
                        return done(err);
                    }
                    if (err) errors.push(err);
                    results.push(result||null);

                    if (total == ++finished)
                        done((errors.length ? errors : null), results);
                });
                setTimeout(() => it.next(), 0);
            })();
        }
    }
}


function eachLimit (limit, items, job, done, kill=false) {
    var results = [], errors = [];
    var total = items.length, finished = 0;
    var index = 0, quota = limit;

    var it = iterator();
    it.next();

    function* iterator () {
        yield (() => {
            while (quota--) {
                var item = items[index++];
                if (index > total) return;

                job(item, (err, result) => {
                    if (total == -1) return;
                    if (kill && err) {
                        total = -1;
                        return done(err);
                    }
                    if (err) errors.push(err);
                    results.push(result||null);

                    if (total == ++finished)
                        return done((errors.length ? errors : null), results);

                    quota++;
                    setTimeout(() => it.next(), 0);
                });
            }
        })();
        yield* iterator();
    }
}


function parallel (jobs, done, kill=false) {
    var results = {}, errors = {};
    var total = Object.keys(jobs).length, finished = 0;

    var it = iterator();
    it.next();

    function* iterator () {
        for (let job in jobs) {
            yield (() => {
                jobs[job](((job) => ((err, result) => {
                    if (total == -1) return;
                    if (kill && err) {
                        total = -1;
                        return done(err);
                    }
                    if (err) errors[job] = err;
                    results[job] = result||null;
                    
                    if (total == ++finished)
                        done((Object.keys(errors).length ? errors : null), results);
                }))(job));
                setTimeout(() => it.next(), 0);
            })();
        }
    }
}


function parallelLimit (limit, jobs, done, kill=false) {
    var results = {}, errors = {};
    var total = Object.keys(jobs).length, finished = 0;
    var keys = Object.keys(jobs), index = 0, quota = limit;

    var it = iterator();
    it.next();
    
    function* iterator () {
        yield (() => {
            while (quota--) {
                var job = keys[index++];
                if (index > total) return;

                jobs[job](((job) => ((err, result) => {
                    if (total == -1) return;
                    if (kill && err) {
                        total = -1;
                        return done(err);
                    }
                    if (err) errors[job] = err;
                    results[job] = result||null;
                    
                    if (total == ++finished)
                        return done((Object.keys(errors).length ? errors : null), results);

                    quota++;
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
