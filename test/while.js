

describe('forever', function () {
  it('process until error occures', (done) => {
    var result = [], count = 0;
    async.forever((done) => {
      if (count == 2) return done(new Error('error'));
      result.push(++count);
      done();
    }, (err) => {
      err.message.should.equal('error');
      result.length.should.equal(2);
      done();
    });
  });
});

describe('until', function () {
  it('process until test condition is met', (done) => {
    var result = [], count = 0;
    async.until(
      () => (count == 5),
      (done) => {
        result.push(++count);
        done();
      },
      (err) => {
        if (err) return done(err);
        result.length.should.equal(5);
        done();
      }
    );
  });
  it('process until error occures', (done) => {
    var result = [], count = 0;
    async.until(
      () => (count == 5),
      (done) => {
        if (count == 2) return done(new Error('error'));
        result.push(++count);
        done();
      },
      (err) => {
        err.message.should.equal('error');
        result.length.should.equal(2);
        done();
      }
    );
  });
});

describe('whilst', function () {
  it('process while test condition is true', (done) => {
    var result = [], count = 0;
    async.whilst(
      () => (count < 5),
      (done) => {
        result.push(++count);
        done();
      },
      (err) => {
        if (err) return done(err);
        result.length.should.equal(5);
        done();
      }
    );
  });
  it('process until error occures', (done) => {
    var result = [], count = 0;
    async.whilst(
      () => (count < 5),
      (done) => {
        if (count == 2) return done(new Error('error'));
        result.push(++count);
        done();
      },
      (err) => {
        err.message.should.equal('error');
        result.length.should.equal(2);
        done();
      }
    );
  });
});
