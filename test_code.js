// A simple calculator function with some issues
function calculator(a, b, operation) {
  if (operation == 'add') {
    return a + b;
  } else if (operation == 'subtract') {
    return a - b;
  } else if (operation == 'multiply') {
    return a * b;
  } else if (operation == 'divide') {
    return a / b;
  }
}

// Example usage
var result = calculator(10, 5, 'add');
console.log('Result: ' + result);

// Another example with potential issue
var divideByZero = calculator(10, 0, 'divide');
console.log('Divide by zero: ' + divideByZero);
