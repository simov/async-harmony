

describe('parallel', function () {
    'use strict';
    
    it('return result when done', (done) => {
        var obj = {
            job1: (done) => {
                done(null, 'result1');
            },
            job2: (done) => {
                done(null, 'result2');
            }
        };
        var arr = [
            (done) => {
                done(null, 'result1');
            },
            (done) => {
                done(null, 'result2');
            }
        ];
        async.parallel(obj, (err, result) => {
            if (err) return done(err);
            result.should.deep.equal({job1:'result1', job2:'result2'});

            async.parallel(arr, (err, result) => {
                if (err) return done(err);
                result.should.deep.equal({0:'result1', 1:'result2'});
                done();
            });
        });
    });
    it('stop on first error received', (done) => {
        async.parallel({
            job1: (done) => {
                done(new Error('error1'));
            },
            job2: (done) => {
                done(new Error('error2'));
            }
        }, (err, result) => {
            err.message.should.equal('error1');
            done();
        }, true);
    });
    it('pass on errors and store them', (done) => {
        var obj = {
            job1: (done) => {
                done(new Error('error1'), 'result1');
            },
            job2: (done) => {
                done(new Error('error2'), 'result2');
            }
        };
        var arr = [
            (done) => {
                done(new Error('error1'), 'result1');
            },
            (done) => {
                done(new Error('error2'), 'result2');
            }
        ];
        async.parallel(obj, (err, result) => {
            err.job1.message.should.equal('error1');
            err.job2.message.should.equal('error2');
            result.should.deep.equal({job1:'result1', job2:'result2'});

            async.parallel(arr, (err, result) => {
                err[0].message.should.equal('error1');
                err[1].message.should.equal('error2');
                result.should.deep.equal({0:'result1', 1:'result2'});
                done();
            });
        });
    });
});

describe('parallelLimit', function () {
    'use strict';
    
    it('return result when done', (done) => {
        async.parallelLimit(2, {
            job1: (done) => {
                done(null, 'result1');
            },
            job2: (done) => {
                done(null, 'result2');
            },
            job3: (done) => {
                done(null, 'result3');
            }
        }, (err, result) => {
            if (err) return done(err);
            result.should.deep.equal({job1:'result1', job2:'result2', job3:'result3'});
            done();
        });
    });
    it('stop on first error received', (done) => {
        async.parallelLimit(2, {
            job1: (done) => {
                done(new Error('error1'));
            },
            job2: (done) => {
                done(new Error('error2'));
            }
        }, (err, result) => {
            err.message.should.equal('error1');
            done();
        }, true);
    });
    it('pass on errors and store them', (done) => {
        async.parallelLimit(2, {
            job1: (done) => {
                done(new Error('error1'), 'result1');
            },
            job2: (done) => {
                done(new Error('error2'), 'result2');
            },
            job3: (done) => {
                done(new Error('error3'), 'result3');
            }
        }, (err, result) => {
            err.job1.message.should.equal('error1');
            err.job2.message.should.equal('error2');
            err.job3.message.should.equal('error3');
            result.should.deep.equal({job1:'result1', job2:'result2', job3:'result3'});
            done();
        });
    });
});
