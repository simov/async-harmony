
# Async Harmony
**async-harmony** is a module for managing asynchronous control flow using Generators


## Status
> As of _15 May 2014_ this module is tested only in _Firefox 29_ running on _Ubuntu_


## Harmony Syntax Features Used
> `Generators (yield)`, `arrow functions`, `let`, `default function params`, `For..of loops`

Take a look at the [ECMAScript 6 compatibility table][0]


## Install
```bash
$ npm install async-harmony
```
You can also use this module as an _amd_ module or a global object in the browser


## Tests
[Tests][5]


## Examples
[Examples][6]


## Methods
## series(jobs, done, kill=true)
> _Process a list of tasks sequentially_

- _**jobs**_ - `[]` or `{}` of jobs to execute
	- each job is `function(args, done)` where
	- `args` - contains the results from all previous jobs, and intermediate results passed between the jobs
	- `done(err, result)` - return error and result
- _**done(err, result)**_ - callback to execute once all jobs are done
- _**kill**_ - `true` or `false` - determines whether to stop the job queue on first error received or not

```js
async.series({
	job1: (args, done) => {
		done(null, 'result1');
	},
	job2: (args, done) => {
		done(null, 'result2');
	}
}, (err, result) => {
	result == {job1:'result1', job2:'result2'}
});
```
[examples][1]


## eachSeries (items, job, done, kill=true)
> _Process a list of items sequentially_

- _**items**_ - `[]` of items to process
- _**job**_ - `function(err, done)` to execute for each item
	- `done(err, result)` - return error and result
- _**done(err, result)**_ - callback to execute once all items are processed
- _**kill**_ - `true` or `false` - determines whether to stop the job queue on first error received or not

```js
async.eachSeries([0,1], (item, done) => {
	done(null, 'result'+item);
}, (err, result) => {
	result == ['result0', 'result1']
});
```
[examples][2]


## each (items, job, done, kill=false)
> _Process a list of items in parallel_

- _**items**_ - `[]` of items to process
- _**job**_ - `function(err, done)` to execute for each item
	- `done(err, result)` - return error and result
- _**done(err, result)**_ - callback to execute once all items are processed
- _**kill**_ - `true` or `false` - determines whether to stop the job queue on first error received or not

```js
async.each([0,1], (item, done) => {
	done(null, 'result'+item);
}, (err, result) => {
	result == ['result0', 'result1']
});
```
[examples][2]


## eachLimit (limit, items, job, done, kill=false)
> _Process a list of items in parallel, limiting the number of items to process simultaneously_

- _**limit**_ - number of items to process simultaneously
- _**items**_ - `[]` of items to process
- _**job**_ - `function(err, done)` to execute for each item
	- `done(err, result)` - return error and result
- _**done(err, result)**_ - callback to execute once all items are processed
- _**kill**_ - `true` or `false` - determines whether to stop the job queue on first error received or not

```js
async.eachLimit(2, [0,1,2], (item, done) => {
	done(null, 'result'+item);
}, (err, result) => {
	result == ['result0', 'result1', 'result2']
});
```
[examples][2]


## parallel (jobs, done, kill=false)
> _Process a list of tasks in parallel_

- _**jobs**_ - `[]` or `{}` of jobs to execute
	- each job is `function(done)` where
	- `done(err, result)` - return error and result
- _**done(err, result)**_ - callback to execute once all jobs are done
- _**kill**_ - `true` or `false` - determines whether to stop the job queue on first error received or not

```js
async.parallel({
	job1: (done) => {
		done(null, 'result1');
	},
	job2: (done) => {
		done(null, 'result2');
	}
}, (err, result) => {
	result == {job1:'result1', job2:'result2'}
});
```
[examples][3]


## parallelLimit (limit, jobs, done, kill=false)
> _Process a list of tasks in parallel, limiting the number of tasks to process simultaneously_

- _**limit**_ - number of jobs to process simultaneously
- _**jobs**_ - `[]` or `{}` of jobs to execute
	- each job is `function(done)` where
	- `done(err, result)` - return error and result
- _**done(err, result)**_ - callback to execute once all jobs are done
- _**kill**_ - `true` or `false` - determines whether to stop the job queue on first error received or not

```js
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
	result == {job1:'result1', job2:'result2', job2:'result3'}
});
```
[examples][3]


## forever (job, done)
> _Execute a task indefinitely (or until an error occur)_

- _**job**_ - task to execute
	- job is `function(done)` where
	- `done(err)` - return error
- _**done(err)**_ - callback to execute if an error occur

```js
var b = false;
async.forever((done) => {
	setTimeout(() => {
		b = !b;
		console.log(b ? 'tik' : 'tak');
		done();
	}, 1000);
}, (err) => {
	if (err) console.log('Clock stopped!');
});
```
[examples][4]


## until (test, job, done)
> _Execute a task until test condition becomes true_

- _**test**_ - test to execute for each iteration
- _**job**_ - task to execute
	- job is `function(done)` where
	- `done(err)` - return error
- _**done(err)**_ - callback to execute when the test condition is met or if an error occur

```js
var count = 0;
async.until(
	() => (count == 5),
	(done) => {
		setTimeout(() => {
			console.log(++count, 'seconds passed!');
			done();
		}, 1000);
	},
	(err) => {
		if (err) console.log('Counter broke!');
		else console.log('Done: 5 seconds passed!');
	}
);
```
[examples][4]


## whilst (test, job, done)
> _Execute a task while test condition is true_

- _**test**_ - test to execute for each iteration
- _**job**_ - task to execute
	- job is `function(done)` where
	- `done(err)` - return error
- _**done(err)**_ - callback to execute when the test condition becomes false or if an error occur

```js
var count = 0;
async.whilst(
	() => (count < 5),
	(done) => {
		setTimeout(() => {
			console.log(++count, 'seconds passed!');
			done();
		}, 1000);
	},
	(err) => {
		if (err) console.log('Counter broke!');
		else console.log('Done: 5 seconds passed!');
	}
);
```
[examples][4]


## License
(The MIT License)

Copyright (c) 2014 simov &lt;simeonvelichkov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


  [0]: http://kangax.github.io/compat-table/es6/
  [1]: https://github.com/simov/async-harmony/blob/master/test/series.js
  [2]: https://github.com/simov/async-harmony/blob/master/test/each.js
  [3]: https://github.com/simov/async-harmony/blob/master/test/parallel.js
  [4]: https://github.com/simov/async-harmony/blob/master/test/while.js
  [5]: http://simov.github.io/async-harmony/test/
  [6]: http://simov.github.io/async-harmony/test/examples.html
