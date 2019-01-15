const iterator = gen();

function runner(iterator) {
  const resultArr = [];

  return new Promise( (resolve) => {
    function executer(generator, yieldValue){
      let next = generator.next(yieldValue);

      let { value, done } = next;
      
      if (!done) {
        if (value instanceof Promise) {
          value.then( result => {
              resultArr.push(result);
              executer(generator, result);
            }
          );
        } else if ( typeof value === 'function') {
          resultArr.push(value());
          executer(generator, value())
        } else {
          resultArr.push(value);
          executer(generator, value);
        }
      } else {
        resolve(resultArr);
      }
    }

    executer(iterator)
  });
}

runner(gen()).then(data => console.log(data.pop() === '441,2,3,4' ? "Good Job" : "You are fail this task"))
