

describe('series', function () {
  'use strict';
  // args - callback args
  // result - final callback result
  // job - callback job
  // job result - done(null, 'job result', true)//quit flag

  it('pass job result to args', (done) => {
    async.series({
      job1: (args, done) => {
        done(null, 'result1');
      },
      job2: (args, done) => {
        args.job1.should.equal('result1');
        done();
      }
    }, (err, result) => {
      done(err);
    });
  });
  it('pass custom data to args', (done) => {
    async.series({
      job1: (args, done) => {
        args.data = 'job1';
        done(null, 'result1');
      },
      job2: (args, done) => {
        args.data.should.equal('job1');
        done();
      }
    }, (err, result) => {
      done(err);
    });
  });
  it('job keys are overriden in args', (done) => {
    async.series({
      job1: (args, done) => {
        args.job1 = 'job1';
        done(null, 'result1');
      },
      job2: (args, done) => {
        args.job1.should.equal('result1');
        done();
      }
    }, (err, result) => {
      done(err);
    });
  });
  it('job result in args is a shallow copy', (done) => {
    async.series({
      job1: (args, done) => {
        done(null, {data:'result1'});
      },
      job2: (args, done) => {
        args.job1.data = 'result2';
        done();
      }
    }, (err, result) => {
      if (err) return done(err);
      result.job1.data.should.equal('result2');
      done();
    });
  });

  it('return only result when done', (done) => {
    var obj = {
      job1: (args, done) => {
        args.data1 = 'job1';
        done(null, 'result1');
      },
      job2: (args, done) => {
        args.data2 = 'job2';
        done(null, 'result2');
      }
    };
    var arr = [
      (args, done) => {
        args.data1 = 'job1';
        done(null, 'result1');
      },
      (args, done) => {
        args.data2 = 'job2';
        done(null, 'result2');
      }
    ];
    async.series(obj, (err, result) => {
      if (err) return done(err);
      result.should.deep.equal({job1:'result1', job2:'result2'});
      
      async.series(arr, (err, result) => {
        if (err) return done(err);
        result.should.deep.equal({0:'result1', 1:'result2'});
        done();
      });
    });
  });
  it('stop on first error received', (done) => {
    async.series({
      job1: (args, done) => {
        done(new Error('error1'));
      },
      job2: (args, done) => {
        done(new Error('error2'));
      }
    }, (err, result) => {
      err.message.should.equal('error1');
      done();
    });
  });
  it('pass on errors and store them', (done) => {
    var obj = {
      job1: (args, done) => {
        done(new Error('error1'), 'result1');
      },
      job2: (args, done) => {
        done(new Error('error2'), 'result2');
      }
    };
    var arr = [
      (args, done) => {
        done(new Error('error1'), 'result1');
      },
      (args, done) => {
        done(new Error('error2'), 'result2');
      }
    ];
    async.series(obj, (err, result) => {
      err.job1.message.should.equal('error1');
      err.job2.message.should.equal('error2');
      result.should.deep.equal({job1:'result1', job2:'result2'});
      
      async.series(arr, (err, result) => {
        err[0].message.should.equal('error1');
        err[1].message.should.equal('error2');
        result.should.deep.equal({0:'result1', 1:'result2'});
        done();
      }, false);
    }, false);
  });
});
