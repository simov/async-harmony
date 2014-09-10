

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
    }, (err, results) => {
      err.message.should.equal('error0');
      done();
    });
  });
  it('pass on errors and store them', (done) => {
    async.eachSeries([0,1], (item, done) => {
      done(new Error('error'+item), 'result'+item);
    }, (err, results) => {
      err[0].message.should.equal('error0');
      err[1].message.should.equal('error1');
      results.should.deep.equal(['result0', 'result1']);
      done();
    }, false);
  });
  it('terminate execution on quit flag passed', (done) => {
    async.eachSeries([0,1], (item, done) => {
      done(null, 'result'+item, true);
    }, (err, results, quit) => {
      should.equal(err, null);
      results.should.deep.equal(['result0']);
      quit.should.equal(true);
      done();
    });
  });
});

describe('each', function () {
  'use strict';
  
  it('return result when done', (done) => {
    async.each([0,1], (item, done) => {
      done(null, 'result'+item);
    }, (err, results) => {
      if (err) return done(err);
      results.should.deep.equal(['result0', 'result1']);
      done();
    });
  });
  it('stop on first error received', (done) => {
    async.each([0,1], (item, done) => {
      done(new Error('error'+item));
    }, (err, results) => {
      err.message.should.equal('error0');
      done();
    }, true);
  });
  it('pass on errors and store them', (done) => {
    async.each([0,1], (item, done) => {
      done(new Error('error'+item), 'result'+item);
    }, (err, results) => {
      err[0].message.should.equal('error0');
      err[1].message.should.equal('error1');
      results.should.deep.equal(['result0', 'result1']);
      done();
    });
  });
  it('terminate execution on quit flag passed', (done) => {
    async.each([0,1], (item, done) => {
      done(null, 'result'+item, true);
    }, (err, results, quit) => {
      should.equal(err, null);
      results.should.deep.equal(['result0']);
      quit.should.equal(true);
      done();
    });
  });
});

describe('eachLimit', function () {
  'use strict';
  
  it('limit', (done) => {
    var items = [1,2,3,4,5,6,7,8],
      time  = [25,100,50,50,25,50,100,25],
      index = 0;

    async.eachLimit(3, items, (item, done) => {
      setTimeout(() => {
        done(null, 'result'+item);
      }, time[index++]);
    }, (err, results) => {
      if (err) return done(err);
      if (results[2] == 'result5')
        results.should.deep.equal([
          'result1', 'result3', 'result5', 'result4',
          'result2', 'result8', 'result6', 'result7'
        ]);
      else
        // finish at the same time, actual order is not guaranteed
        results.should.deep.equal([
          'result1', 'result3', 'result4', 'result5',
          'result2', 'result8', 'result6', 'result7'
        ]);
      done();
    });
  });
  it('return result when done', (done) => {
    async.eachLimit(2, [0,1,2], (item, done) => {
      done(null, 'result'+item);
    }, (err, results) => {
      if (err) return done(err);
      results.should.deep.equal(['result0', 'result1', 'result2']);
      done();
    });
  });
  it('stop on first error received', (done) => {
    async.eachLimit(2, [0,1], (item, done) => {
      done(new Error('error'+item));
    }, (err, results) => {
      err.message.should.equal('error0');
      done();
    }, true);
  });
  it('pass on errors and store them', (done) => {
    async.eachLimit(2, [0,1,2], (item, done) => {
      done(new Error('error'+item), 'result'+item);
    }, (err, results) => {
      err[0].message.should.equal('error0');
      err[1].message.should.equal('error1');
      err[2].message.should.equal('error2');
      results.should.deep.equal(['result0', 'result1', 'result2']);
      done();
    });
  });
  it('terminate execution on quit flag passed', (done) => {
    async.eachLimit(2, [0,1,2], (item, done) => {
      done(null, 'result'+item, true);
    }, (err, results, quit) => {
      should.equal(err, null);
      results.should.deep.equal(['result0']);
      quit.should.equal(true);
      done();
    });
  });
});
