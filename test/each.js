

describe('eachSeries', function () {
    'use strict';
    
    it('return result when done', (done) => {
        async.eachSeries([0,1], (item, done) => {
            done(null, 'result'+item);
        }, (err, result) => {
            if (err) return done(err);
            result.should.deep.equal(['result0', 'result1']);
            done();
        });
    });
    it('stop on first error received', (done) => {
        async.eachSeries([0,1], (item, done) => {
            done(new Error('error'+item));
        }, (err, result) => {
            err.message.should.equal('error0');
            done();
        });
    });
    it('pass on errors and store them', (done) => {
        async.eachSeries([0,1], (item, done) => {
            done(new Error('error'+item), 'result'+item);
        }, (err, result) => {
            err[0].message.should.equal('error0');
            err[1].message.should.equal('error1');
            result.should.deep.equal(['result0', 'result1']);
            done();
        }, false);
    });
});

describe('each', function () {
    'use strict';
    
    it('return result when done', (done) => {
        async.each([0,1], (item, done) => {
            done(null, 'result'+item);
        }, (err, result) => {
            if (err) return done(err);
            result.should.deep.equal(['result0', 'result1']);
            done();
        });
    });
    it('stop on first error received', (done) => {
        async.each([0,1], (item, done) => {
            done(new Error('error'+item));
        }, (err, result) => {
            err.message.should.equal('error0');
            done();
        }, true);
    });
    it('pass on errors and store them', (done) => {
        async.each([0,1], (item, done) => {
            done(new Error('error'+item), 'result'+item);
        }, (err, result) => {
            err[0].message.should.equal('error0');
            err[1].message.should.equal('error1');
            result.should.deep.equal(['result0', 'result1']);
            done();
        });
    });
});

describe('eachLimit', function () {
    'use strict';
    
    it('return result when done', (done) => {
        async.eachLimit(2, [0,1,2], (item, done) => {
            done(null, 'result'+item);
        }, (err, result) => {
            if (err) return done(err);
            result.should.deep.equal(['result0', 'result1', 'result2']);
            done();
        });
    });
    it('stop on first error received', (done) => {
        async.eachLimit(2, [0,1], (item, done) => {
            done(new Error('error'+item));
        }, (err, result) => {
            err.message.should.equal('error0');
            done();
        }, true);
    });
    it('pass on errors and store them', (done) => {
        async.eachLimit(2, [0,1,2], (item, done) => {
            done(new Error('error'+item), 'result'+item);
        }, (err, result) => {
            err[0].message.should.equal('error0');
            err[1].message.should.equal('error1');
            err[2].message.should.equal('error2');
            result.should.deep.equal(['result0', 'result1', 'result2']);
            done();
        });
    });
});
