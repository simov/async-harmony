
describe('common', function () {
  'use strict';
  
  it('throw exception', (done) => {
    try {
      async.series([
        (args, done) => {
          throw new Error('Exception thrown');
        }
      ], (err, results) => {
        if (err) return done(err);
        results.should.deep.equal(['result0', 'result1']);
        done();
      });
    } catch (err) {
      err.message.should.equal('Exception thrown');
      done();
    }
  });
});
