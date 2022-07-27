
const operations = {
    'add': "+",
    'eq': "=",
    'mult': '*',
    'div': '/',
    'sub': '-',
    'mod': '%',
    "sqrt": "√",
    'power' : '^',
    'inv' : '^(-1)'
};

class Model {
    constructor() {
        this.operation = "";
        this.operand1 = "";
        this.operand2 = "";
        this.result = 0;
        this.isResult = false;
        this.resultString = "";
    }

    setChar(char) {
        console.log("isRes" + this.isResult);
        if (this.isResult) {
            this.reset();
        }
        if (this.operation === "") {
            if (char === '.' && this.operand1.includes('.')) return
            this.operand1 += char;
        } else {
            if(this.operand2==undefined){
              this.operand2="";
            }
            if (char === '.' && this.operand2.includes('.')) return
            this.operand2 += char;
        }
        this.resultString += char;
        console.log(`operand1 = ${this.operand1}`);
        console.log(`operand2 = ${this.operand2}`);
        console.log(` ${this.operation}`);
        console.log(this.resultString);
    }

    delete() {
      this.resultString = this.resultString.toString().slice(0, -1);
      if(this.opertion!=""){
        console.log("thisoperation: "+this.operation);
        this.operand1=this.resultString.split(operations[this.operation])[0];
        this.operand2=this.resultString.split(operations[this.operation])[1];
        console.log("change oper1:"+this.operand1);
        console.log("change oper2:" +this.operand2)
      } else{
        this.operation="";
        this.operand2="";
        this.operand1=this.resultString;
        console.log("change in operand1:"+this.operand1);
      }

      this.isResult = false;
    }
    reset() {
        this.operation = "";
        this.operand1 = "";
        this.operand2 = "";
        this.result = 0;
        this.isResult = false;
        this.resultString = "";
    }

    getResultString() {
        return this.resultString;
    }

    setOperation(operation) {
        if (this.operand1 === "" && this.operand2 === "") {
            this.operand1 = 0;
            this.operation = operation;
            this.resultString = "0" + operations[this.operation];
            let tempString = this.resultString;
            if(this.operation==="sqrt"){
              this.operand1=1;
              this.resultString =   operations[this.operation] + tempString.substring(0, tempString.length - 2);
            }
        } else if (this.isResult) {
            this.operation = operation;
            this.operand1 = this.result;
            this.operand2 = "";
            this.isResult = false;
            this.resultString += operations[this.operation];
        } else if (this.operation === "") {
            this.operation = operation;
            this.resultString += operations[this.operation];
        } else if (this.operand1 !== "" && this.operand2 === "") {
            this.operation = operation;
            let tempString = this.resultString;
            this.resultString = tempString.substring(0, tempString.length - 1) + operations[this.operation];
          //  console.log(" resultstringlength:" +this.resultString.substring(0,tempString.length-5));
        } else if (this.operand1 !== "" && this.operand2 !== "") {
            this.performExpression();
        }
    }



    performExpression() {
      var val1=parseFloat(this.operand1), val2=parseFloat(this.operand2);
            switch (this.operation) {
                case 'add':
                    this.result = val1 + val2;
                    break;
                case 'mult':
                    this.result = val1 * val2;
                    break;
                case 'sub':
                    this.result = val1 - val2;
                    break;
                case 'div':
                    this.result = val1 / val2;
                    break;
                case 'mod':
                    this.result = val1 % val2;
                    break;
                case 'sqrt':
                    this.result = val1 * Math.sqrt(val2);
                    break;
                case 'power':
                    this.result=Math.pow(val1,val2);
                    break;
                case 'inv':
                    this.result=Math.pow(val1,-1);
                    break;
                default:
                    this.result = this.operand1;
            }
        this.isResult = true;
        this.resultString = this.result.toPrecision(5);
        this.operand1=this.resultString;
        this.operation="";
        this.operand2="";
    }
}


class View {
    constructor() {
        this.screen = document.getElementById('display');
        this.screen.value = "0";
        this.operations = document.querySelectorAll('.operation');
        this.clearBtn = document.getElementById('CE');
        this.keys = document.querySelectorAll('.key');
        this.equal = document.getElementById('eq');
        this.deletebtn = document.getElementById('del');
    }

    displayResult(value) {
        this.screen.value = value;
    }

    clearScreen() {
        this.screen.value = "0";
    }

    getDisplayResult() {
        return this.screen.value;
    }

    deleteele(value){
    this.screen.value=value;
    }
}

class Controller {

    constructor(Model, View) {
        this.model = new Model();
        this.view = new View();
    }
      //HELPER CLASS

    keysListener() {
        console.log(this.view.keys);
        this.view.keys.forEach((e) => e.addEventListener('click', () => {
            this.model.setChar(e.getAttribute('data-key'));
            this.view.displayResult(this.model.getResultString());
        }));
    }

    operationsListener() {
        this.view.operations.forEach((e) => e.addEventListener('click', () => {
            let displayString = this.view.getDisplayResult();
            this.model.setOperation(e.getAttribute('data-op'));
            this.view.displayResult(this.model.getResultString());
        }));
    }

    equationListener() {
        this.view.equal.addEventListener('click', () => {
            this.model.performExpression();
            this.view.displayResult(this.model.getResultString());
        });
    }

    clearListener() {
        this.view.clearBtn.addEventListener('click', () => {
            this.model.reset();
            this.view.clearScreen();
        })
    }
    deleteListener(){
        this.view.deletebtn.addEventListener('click', () =>{
            this.model.delete();
            this.view.deleteele(this.model.getResultString());
        });
    }
}

class Calculator {
    constructor(Controller, Model, View) {
        this.controller = new Controller(Model, View);
    }

    init() {
        this.controller.keysListener();
        this.controller.clearListener();
        this.controller.equationListener();
        this.controller.operationsListener();
        this.controller.deleteListener();
    }
}

const calculator = new Calculator(Controller, Model, View);
calculator.init();
