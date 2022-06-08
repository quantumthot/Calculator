//Creates an object to keep track of values.
const Calculator = {
    //This displays 0 on the screen.
    Display_Value: '0',
    //This will hold the first operand for any expressions, we set it up to null for now
    First_Operand: null,
    //This checks weather or not the second operand has been input.
    Wait_Second_Operand: false,
    //This will hold the operator, we set it to null for now.
    operator: null,
};

//This modifies the values each time a button is clicked.
function Input_Digit(digit) {
    const { Display_Value, Wait_Second_Operand} = Calculator;
    // We are checking to see if Wait_Second_Operand is true and set
    // Display_Value to the key that was clicked.
    if (Wait_Second_Operand === true) {
        Calculator.Display_Value = digit;
        Calculator.Wait_Second_Operand = false;
    }   else    {
        // This overwrites the Display_Value if the currrent value is 0
        // otherwise it adds onto it.
        Calculator.Display_Value = Display_Value === '0' ? digit : Display_Value + digit;
    }
}
// THis section handles decimal points 
function Input_Decimal(dot) {
    // This ensures that accidental clicking of decimal point doesn't cause bugs.
    if (Calculator.Wait_Second_Operand === true) return;
    if (!Calculator.Display_Value.includes(dot)) {
        // we are saying if the Display_Value does not contain a decimal,
        //we want to add a decimal point
        Calculator.Display_Value += dot;
    }
}
// This seection handles operators
function Handle_Operator(Next_Operator) {
    const { First_Operand, Display_Value, operator } = Calculator
    //When an operator key is pressed, we convert the current number
    //displayed on the screen to a number and then store the result in
    //Calculator.First_Operand if it doesn't already exist
    const Value_Of_Input = parseFloat(Display_Value);
    // Checks if an operator already exists and if Wait_Second_Operand is true,
    // Then updates the operator and exits from the function
    if (operator && Calculator.Wait_Second_Operand) {
        Calculator.operator = Next_Operator;
        return;
    }
    if (First_Operand == null) {
        Calculator.First_Operand = Value_Of_Input;
    } else if (operator) {//Checks to see if operator already exists.
        const Value_Now = First_Operand || 0;
        // If operator exists, property lookup is performed for the operator
        // in the Perform_Calculation object and the function that matches the
        // operator is executed.
        let result = Perform_Calculation[operator](Value_Now, Value_Of_Input);
        // Here we add a fixed amount of numbers after the decimal.
        result = (result * 1).toString()
        Calculator.Display_Value = parseFloat(result);
        Calculator.First_Operand = parseFloat(result);
    }
    Calculator.Wait_Second_Operand = true;
    Calculator.operator = Next_Operator;
}
const Perform_Calculation = {
    '/': (First_Operand, Second_Operand) => First_Operand / Second_Operand,
    '*': (First_Operand, Second_Operand) => First_Operand * Second_Operand,
    '+': (First_Operand, Second_Operand) => First_Operand + Second_Operand,
    '-': (First_Operand, Second_Operand) => First_Operand - Second_Operand,
    '=': (First_Operand, Second_Operand) => Second_Operand
};

function Calculator_Reset() {
    Calculator.Display_Value = '0';
    Calculator.First_Operand = null;
    Calculator.Wait_Second_Operand = false;
    Calculator.operator = null;
}
// This funxtion updates the screen with the contents of Display_Value
function Update_Display() {
    const display = document.querySelector('.calculator-screen');
    display.value = Calculator.Display_Value;
}
Update_Display() ;
// This section monitors the button clicks
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    // The target variable is an object that represents the element that was clicked.
    const { target } = event;
    //If the element that was clicked on is not a button, exit the function
    if(!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        Handle_Operator(target.value);
        Update_Display();
        return;
    }

    if (target.classList.contains('decimal')) {
        Input_Decimal(target.value);
        Update_Display();
            return;
    }
    // Ensuresthat AC clears the numbers.
    if (target.classList.contains('all-clear')) {
        Calculator_Reset();
        Update_Display();
        return;
    }

    Input_Digit(target.value);
    Update_Display();
})
