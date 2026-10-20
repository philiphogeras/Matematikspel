export class AdditionEngine {
  generateQuestion(category = 'ental', tier = 'brons') {
    let num1 = 0;
    let num2 = 0;

    if (category === 'ental') {
      num1 = Math.floor(Math.random() * 10);
      num2 = Math.floor(Math.random() * 10);
    } else if (category === 'tiotal') {
      num1 = Math.floor(Math.random() * 90) + 10;
      num2 = Math.floor(Math.random() * 90) + 10;
    } else if (category === 'hundratal') {
      num1 = Math.floor(Math.random() * 900) + 100;
      num2 = Math.floor(Math.random() * 900) + 100;
    } else {
      num1 = Math.floor(Math.random() * 10);
      num2 = Math.floor(Math.random() * 10);
    }

    return {
      domain: 'arithmetic',
      operation: 'addition',
      category,
      tier,
      num1,
      num2,
      operator: '+',
      correctAnswer: (num1 + num2).toString(),
      text: `${num1} + ${num2} = ?`
    };
  }
}