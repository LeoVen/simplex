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

$(document).ready(function () {

    $('.modal').modal();
    $('select').formSelect();

    $('#numberOfVariables').on('change', (event) => changeVariables());
    $('#numberOfConstraints').on('change', (event) => changeConstraints());

    changeConstraints();
    changeVariables();

});

/* Presets */
const $operatorOptions = $('<select>').html([
    $('<option>').attr('value', '<=').text('<='),
    $('<option>').attr('value', '=').text('='),
    $('<option>').attr('value', '>=').text('>=')]);

/* Builders */
function makeObjectiveFunction(nVar) {
    let result = Array(nVar);

    for (let i = 0; i < nVar; i++)
        result[i] = $('<input>').attr('id', `objF-${i}`).attr('type', 'number').attr('value', '0');

    return result;
}

function makeConstraint(i, nVar) {
    let result = Array(nVar + 2);

    let j = 0;
    for (; j < nVar; j++) {
        result[j] = $('<input>').attr('id', `c-${i}-${j}`).attr('type', 'number').attr('value', '0');
    }

    result[j + 1] = $operatorOptions.clone().attr('id', `op-${i}`);
    result[j + 2] = $('<input>').attr('id', `b-${i}`).attr('type', 'number').attr('value', '0');

    return $(`<div>`).addClass('flex-spacing').addClass('constraint').html(result);
}

// Changes the amount of columns
function changeVariables() {
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
            $objectiveFunction.append($('<input>').attr('id', `objF-${numberOfVariables + i - 1}`).attr('type', 'number').attr('value', '0'));
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
                let lastInput = $($(this).eq(0).children()[$(this).eq(0).children().length - 3]);
                $('<input>').attr('id', `c-${i}-${numberOfVariables + j - 1}`).attr('type', 'number').attr('value', '0').insertAfter(lastInput);
            }
        });
    }

    // Materialize
    $('select').formSelect();
}

// Changes the amount of rows
function changeConstraints() {
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
            $constraints.append(makeConstraint(numberOfConstraints + i - 1, numberOfVariables));
        }
    }

    // Materialize
    $('select').formSelect();
}

function getSimplexTable() {
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
     * m = number of variables + 1 (b)
     */
    let constraints = Array(numberOfConstraints).fill(Array(numberOfVariables + 1).fill(0));

}
