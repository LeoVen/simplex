/*
 * The MIT License
 *
 * Copyright 2019 Leonardo Vencovsky (https://github.com/LeoVen/).
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

if (!M) {
    throw new Error("materialize.js is required");
}

// Operates the simplex table form
var SimplexTable = {}

SimplexTable.operatorOptions = $('<select>').html([
    $('<option>').attr('value', '<=').text('<='),
    $('<option>').attr('value', '=').text('='),
    $('<option>').attr('value', '>=').text('>=')]);

// Builds the nth input of the objective function
SimplexTable.makeObjFunInput = function (i) {
    return $('<div>')
        .addClass('valign-wrapper')
        .addClass('margin-right')
        .html([
            $('<input>')
                .attr('id', `objF-${i}`)
                .attr('type', 'number')
                .attr('value', '0'),
            $('<p>').html(`X<sub>${i}</sub>`)
        ]);
}

// Builds the constraint input of constraint i of variable j
SimplexTable.makeConstraintInput = function (i, j) {
    return $('<div>')
        .addClass('valign-wrapper')
        .addClass('margin-right')
        .html([
            $('<input>')
                .attr('id', `c-${i}-${j}`)
                .attr('type', 'number')
                .attr('value', '0'),
            $('<p>').html(`X<sub>${j}</sub>`)
        ]);
}

// Builds an entire constraint with operator options and b
SimplexTable.makeConstraint = function (i, nVar) {
    let result = Array(nVar + 2);

    let j = 0;
    for (; j < nVar; j++) {
        result[j] = SimplexTable.makeConstraintInput(i, j);
    }

    result[j + 1] = SimplexTable.operatorOptions.clone().attr('id', `op-${i}`);
    result[j + 2] = $('<input>').attr('id', `b-${i}`).attr('type', 'number').attr('value', '0');

    return $(`<div>`).addClass('flex-spacing').addClass('constraint').html(result);
}

// Changes the amount of columns
SimplexTable.changeVariables = function () {
    let numberOfVariables = $('#numberOfVariables').val() * 1;
    let numberOfConstraints = $('#numberOfConstraints').val() * 1;

    let $objectiveFunction = $('#objectiveFunction');
    let objectiveFunctionChildren = $objectiveFunction.children();

    // Change objective function
    if (objectiveFunctionChildren.length > numberOfVariables) {
        for (let i = 0; i < objectiveFunctionChildren.length - numberOfVariables; i++) {
            objectiveFunctionChildren.eq(objectiveFunctionChildren.length - 1).remove();
        }
    } else {
        for (let i = 0; i < numberOfVariables - objectiveFunctionChildren.length; i++) {
            $objectiveFunction.append(SimplexTable.makeObjFunInput(objectiveFunctionChildren.length + i));
        }
    }

    // Change each constraint
    let $constraints = $('#constraints .constraint');

    let totalVariables = $constraints.eq(0).children().length - 2;

    if (totalVariables > numberOfVariables) {
        // For each constraint, remove input variables from the end
        $constraints.each(function (index) {
            for (let j = 0; j < (totalVariables - numberOfVariables); j++) {
                $(this).children().eq($(this).children().length - 3).remove();
            }
        });
    } else {
        // For each constraint, add input variables
        $constraints.each(function (i) {
            for (let j = 0; j < (numberOfVariables - totalVariables); j++) {
                let lastInput = $(this).children().eq($(this).children().length - 3);
                lastInput.after(SimplexTable.makeConstraintInput(i, numberOfVariables + j - 1));
            }
        });
    }

    // Materialize
    $('select').formSelect();
}

// Changes the amount of rows
SimplexTable.changeConstraints = function () {
    let numberOfVariables = $('#numberOfVariables').val() * 1;
    let numberOfConstraints = $('#numberOfConstraints').val() * 1;

    let $constraints = $('#constraints');
    let $constraintsChildren = $constraints.children();

    if ($constraintsChildren.length > numberOfConstraints) {
        for (let i = 0; i < ($constraintsChildren.length - numberOfConstraints); i++) {
            $constraintsChildren.last().remove();
        }
    } else {
        for (let i = 0; i < (numberOfConstraints - $constraintsChildren.length); i++) {
            $constraints.append(SimplexTable.makeConstraint(numberOfConstraints + i - 1, numberOfVariables));
        }
    }

    // Materialize
    $('select').formSelect();
}

SimplexTable.getSimplexTable = function () {
    /**
     * Inputs have the following IDs:
     * - c-i-j  : constraint value of matrix [m x n] at i,j
     * - b-i    : b of a constraint
     * - op-i   : operator of a constraint (<=, =, >=)
     * - objF-i : the ith variable
     */

    let numberOfVariables = $('#numberOfVariables').val() * 1;
    let numberOfConstraints = $('#numberOfConstraints').val() * 1;

    /**
     * [m] array where
     * m = number of variables
     */
    let objectiveFunction = Array(numberOfVariables).fill(0);

    for (let i = 0; i < numberOfVariables; i++) {
        objectiveFunction[i] = $(`#objF-${i}`).val() * 1;
    }

    if (objectiveFunction.includes(undefined)) {
        alert('Could not retrieve all variables from objective function');
        return;
    }

    /**
     * [n x m] matrix where
     * n = number of constraints
     * m = number of variables
     */
    let constraints = Array(numberOfConstraints).fill(undefined);

    for (let i = 0; i < constraints.length; i++) {
        constraints[i] = Array(numberOfVariables).fill(0).slice();
    }

    for (let i = 0; i < numberOfConstraints; i++) {
        for (let j = 0; j < numberOfVariables; j++) {
            constraints[i][j] = $(`#c-${i}-${j}`).val() * 1;
        }
    }

    /**
     * b is the value after the <=, = or >= sign
     */
    let b = Array(numberOfConstraints).fill(0);

    for (let i = 0; i < numberOfConstraints; i++) {
        b[i] = $(`#b-${i}`).val() * 1;
    }

    /**
     * Operator of the constraint (can either be <=, =, >=)
     */
    let operators = Array(numberOfConstraints).fill('<=');

    for (let i = 0; i < numberOfConstraints; i++) {
        operators[i] = $(`#op-${i}`).val();
    }

    let columns = Array(numberOfVariables);

    for (let i = 0; i < numberOfVariables; i++) {
        columns[i] = `X<sub>${i}</sub>`;
    }

    let type = $('#simplexType').val();

    return {
        type: type,
        objectiveFunction: objectiveFunction,
        constraints: constraints,
        operators: operators,
        b: b,
        columns: columns
    };
}

SimplexTable.resetTable = function () {
    $('#numberOfVariables').val('1');
    $('#numberOfConstraints').val('1');

    $('#objectiveFunction').html(SimplexTable.makeObjFunInput(0));
    $('#constraints').html(SimplexTable.makeConstraint(0, 1));
}

SimplexTable.clearTable = function () {
    let numberOfVariables = $('#numberOfVariables').val() * 1;
    let numberOfConstraints = $('#numberOfConstraints').val() * 1;

    for (let i = 0; i < numberOfConstraints; i++) {
        $(`#b-${i}`).val('0');
        $(`#objF-${i}`).val('0');
        for (let j = 0; j < numberOfVariables; j++) {
            $(`#c-${i}-${j}`).val('0');
        }
    }
}

SimplexTable.loadTable = function () {
    let stringResult = window.prompt("Load Simplex Table");
    let result = undefined;

    try {
        result = JSON.parse(stringResult);
    } catch (err) {
        alert('Could not parse input string. Check console for more detail.');
        console.log(err);
    }

    if (!result)
        return;

    SimplexTable.resetTable();

    let numberOfConstraints = result.constraints.length;
    let numberOfVariables = result.objectiveFunction.length;

    let $numberOfConstraints = $('#numberOfConstraints');
    let $numberOfVariables = $('#numberOfVariables');

    for (let i = 1; i < numberOfConstraints; i++) {
        $numberOfConstraints.val($numberOfConstraints.val() * 1 + 1);
        SimplexTable.changeConstraints();
    }

    for (let i = 1; i < numberOfVariables; i++) {
        $numberOfVariables.val($numberOfVariables.val() * 1 + 1);
        SimplexTable.changeVariables();
    }

    for (let i = 0; i < numberOfConstraints; i++) {
        $(`#b-${i}`).val(result.b[i]);
        $(`#objF-${i}`).val(result.objectiveFunction[i]);
        $(`#op-${i}`).val(result.operators[i]);
        for (let j = 0; j < numberOfVariables; j++) {
            $(`#c-${i}-${j}`).val(result.constraints[i][j]);
        }
    }

    $('#simplexType').val(result.type);

    // Materialize
    $('select').formSelect();
}

SimplexTable.saveTable = function () {
    window.prompt("Save Simplex Table", JSON.stringify(SimplexTable.getSimplexTable()));
}

// EXAMPLES
// {"type":"max","objectiveFunction":[1,1],"constraints":[[2,1],[1,2]],"operators":["<=","<="],"b":[4,3],"columns":["X0","X1"]}
// {"type":"max","objectiveFunction":[4,1],"constraints":[[2,3],[2,1]],"operators":["<=","<="],"b":[12,8],"columns":["X0","X1"]}
// {"type":"max","objectiveFunction":[4,6],"constraints":[[-1,1],[1,1],[2,5]],"operators":["<=","<=","<="],"b":[11,27,90],"columns":["X0","X1"]}
