
describe('common', () => {
  'use strict';
  
  it('throw exception', (done) => {
    try {
      async.series([
        (args, done) => {
          throw new Error('Exception thrown');
        }
      ], (err, results) => done());
    } catch (err) {
      err.message.should.equal('Exception thrown');
      done();
    }
  });
});
