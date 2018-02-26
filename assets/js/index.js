var  numbers              = document.querySelectorAll('.number');
var operations_number     = document.querySelectorAll('.operation');
var clearBtns             = document.querySelectorAll('clearBtn');
var decimalBtn            = document.getElementById('decimal');
var resultBtn             = document.getElementById('result');
var display               = document.getElementById('display');
var MemoryCurentNumber    = 0;
var MemoryNewNumber       = false;
var MemoryPaydinOperation = '';


for (var i=0; i<numbers.length; i++) {
  var namber = numbers[i];
  namber.addEventListener('click', function (e) {
      namberPress(e.target.textContent);
  });
};
for (var i=0; i<operations_number.length; i++) {
  var operation_numberbtn  = operations_number[i];
  operation_numberbtn.addEventListener('click', function (e) {
    operation_number(e.target.textContent);

  });
};
for (var i=0; i<clearBtns.length; i++) {
  var clearBtn  = clearBtns[i];
  clearBtn.addEventListener('click', function (e) {
    clear(e.srcElement.id)
  });
};

resultBtn.addEventListener('click', result);
decimalBtn.addEventListener('click', desimal );


function namberPress(number) {
  if (MemoryNewNumber) {
    display.value = number;
    MemoryNewNumber = false;
  }else {
    if (display.value === '0') {
      display.value = number;
    }else {
      display.value += number;
    };
  };
    console.log('клик по кнопке ' + number + '!');
};
function operation_number(op) {
  var localOperationMemory = display.value;

    if (MemoryNewNumber && MemoryPaydinOperation !== '=') {
      display.value = MemoryCurentNumber;
    }else {
      MemoryNewNumber = true;
      if (MemoryPaydinOperation ==='+') {
        MemoryCurentNumber            += parseFloat(localOperationMemory);
      }else if (MemoryPaydinOperation ==='-') {
          MemoryCurentNumber          -= parseFloat(localOperationMemory);
      }else if (MemoryPaydinOperation ==='*') {
          MemoryCurentNumber          *= parseFloat(localOperationMemory);
      }else if (MemoryPaydinOperation ==='/') {
          MemoryCurentNumber          /= parseFloat(localOperationMemory);
      }else if (MemoryPaydinOperation ==='%') {
          MemoryCurentNumber          %= parseFloat(localOperationMemory);
      }else {
        MemoryCurentNumber            = parseFloat(localOperationMemory);;
      };
      display.value = MemoryCurentNumber;
      MemoryPaydinOperation         = op;
    };
      console.log('клик по кнопке ' + op + '!');
};
function desimal() {
  var LocalDesimalmemory = display.value;
  if (MemoryNewNumber) {
    LocalDesimalmemory = '0.';
      MemoryNewNumber = false;
  }else {
    if (LocalDesimalmemory.indexOf('.')===-1) {
      LocalDesimalmemory += '.';
    };
  };
      display.value = LocalDesimalmemory;
};
function clear(id) {
  if (id === 'ce') {
    display.value = '0';
    MemoryNewNumber = true;
  }else if (id === 'c') {
    display.value = '0';
    MemoryNewNumber = true;
    MemoryCurentNumber    = 0;
   MemoryPaydinOperation = '';
  };
};
