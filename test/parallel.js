

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
    
    it('limit', (done) => {
        var items = [1,2,3,4,5,6,7,8],
            time  = [25,100,50,50,25,50,100,25],
            index = 0;

        async.parallelLimit(3, {
            job1: (done) => {setTimeout(() => done(null, 'result1'), time[index++])},
            job2: (done) => {setTimeout(() => done(null, 'result2'), time[index++])},
            job3: (done) => {setTimeout(() => done(null, 'result3'), time[index++])},
            job4: (done) => {setTimeout(() => done(null, 'result4'), time[index++])},
            job5: (done) => {setTimeout(() => done(null, 'result5'), time[index++])},
            job6: (done) => {setTimeout(() => done(null, 'result6'), time[index++])},
            job7: (done) => {setTimeout(() => done(null, 'result7'), time[index++])},
            job8: (done) => {setTimeout(() => done(null, 'result8'), time[index++])}
        }, (err, result) => {
            if (err) return done(err);
            if (Object.keys(result)[2] == 'job5')
                result.should.deep.equal({
                    job1: 'result1', job3: 'result3', job5: 'result5', job4: 'result4',
                    job2: 'result2', job8: 'result8', job6: 'result6', job7: 'result7'
                });
            else
                // finish at the same time, actual order is not guaranteed
                result.should.deep.equal({
                    job1: 'result1', job3: 'result3', job4: 'result4', job5: 'result5',
                    job2: 'result2', job8: 'result8', job6: 'result6', job7: 'result7'
                });
            done();
        });
    });
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
