function sum() {
  console.log(1);
  return [].reduce.call(arguments, (acc, el) => acc+=el);
}

const prom = x => new Promise(res => {
  console.log(2);
  setTimeout(res,2000,x);
})

function pow() {
  console.log(3);
  return [].reduce.call(arguments, (acc, el) => acc*=el);
}

const arr = [1,2,3,4]

function *gen() {
  const a = yield sum.bind(null, ...arr);
  const b = yield prom(a);
  const c = yield pow.bind(null, ...arr);
  const d = yield arr;
  yield a + b + c + d;
}

const iterator = gen();

function runner(iterator) {
  const resultArr = [];

  return new Promise( (resolve) => {

    function executer(generator, yieldValue){

      let next = generator.next(yieldValue);
      let { value, done } = next;
      
      if (done) {
        return resolve(resultArr);
      }

      if (value instanceof Promise) {
          return value.then( result => {
            resultArr.push(result);
            executer(generator, result);
          }
        );
      } else if ( typeof value === 'function') {
        resultArr.push(value());
        return executer(generator, value())
      } 

      resultArr.push(value);
      executer(generator, value);
    }

    executer(iterator)
  });
}

runner(gen()).then(data => console.log(data.pop() === '441,2,3,4' ? "Good Job" : "You are fail this task"))
