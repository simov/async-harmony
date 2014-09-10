
describe('series', function () {
  'use strict';

  it('pass job result to args', (done) => {
    async.series({
      job1: (args, done) => {
        done(null, 'result1');
      },
      job2: (args, done) => {
        args.job1.should.equal('result1');
        done();
      }
    }, (err, results) => {
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
    }, (err, results) => {
      done(err);
    });
  });

  it('exclude custom data from results', (done) => {
    async.series({
      job1: (args, done) => {
        args.data1 = 'job1';
        done(null, 'result1');
      },
      job2: (args, done) => {
        args.data2 = 'job2';
        done(null, 'result2');
      }
    }, (err, results) => {
      if (err) return done(err);
      results.should.deep.equal({job1:'result1', job2:'result2'}); 
      done();
    });
  });

  it('override job keys in args', (done) => {
    async.series({
      job1: (args, done) => {
        args.job1 = 'job1';
        done(null, 'result1');
      },
      job2: (args, done) => {
        args.job1.should.equal('result1');
        done();
      }
    }, (err, results) => {
      done(err);
    });
  });

  it('job result in args is shallow copy', (done) => {
    async.series({
      job1: (args, done) => {
        done(null, {data:'result1'});
      },
      job2: (args, done) => {
        args.job1.data = 'result2';
        done();
      }
    }, (err, results) => {
      if (err) return done(err);
      results.job1.data.should.equal('result2');
      done();
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
    }, (err, results) => {
      err.message.should.equal('error1');
      done();
    });
  });

  it('pass on errors and store them', (done) => {
    async.series({
      job1: (args, done) => {
        done(new Error('error1'), 'result1');
      },
      job2: (args, done) => {
        done(new Error('error2'), 'result2');
      }
    }, (err, results) => {
      err.job1.message.should.equal('error1');
      err.job2.message.should.equal('error2');
      results.should.deep.equal({job1:'result1', job2:'result2'});
      done();
    }, false);
  });

  it('accept jobs array', (done) => {
    async.series([
      (args, done) => {
        done(null, 'result1');
      },
      (args, done) => {
        done(null, 'result2');
      }
    ], (err, results) => {
      if (err) return done(err);
      results.should.deep.equal({0:'result1', 1:'result2'});
      done();
    });
  });

  it('pass on errors and store them - array', (done) => {
    async.series([
      (args, done) => {
        done(new Error('error1'), 'result1');
      },
      (args, done) => {
        done(new Error('error2'), 'result2');
      }
    ], (err, results) => {
      err[0].message.should.equal('error1');
      err[1].message.should.equal('error2');
      results.should.deep.equal({0:'result1', 1:'result2'});
      done();
    }, false);
  });

  it('terminate execution on quit flag passed', (done) => {
    async.series({
      job1: (args, done) => {
        done(null, 'result1', true);
      },
      job2: (args, done) => {
        done(null, 'result2');
        done();
      }
    }, (err, results, quit) => {
      should.equal(err, null);
      results.should.deep.equal({job1:'result1'});
      quit.should.equal(true);
      done();
    });
  });
});
