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

/* Presets */
const $operatorOptions = $('<select>').html([
    $('<option>').attr('value', '<=').text('<='),
    $('<option>').attr('value', '=').text('='),
    $('<option>').attr('value', '>=').text('>=')])

/* Builders */
function objFuncInput(i) {
    return $('<input>').attr('id', `objF-${i}`).attr('type', 'number').attr('value', '0')
}

function makeObjectiveFunction(nVar) {
    let result = Array(nVar);

    for (let i = 0; i < nVar; i++)
        result[i] = objFuncInput(i);

    return result;
}

$(document).ready(function () {

    $('.modal').modal();
    $('select').formSelect();

    $('#numberOfVariables').on('change', (event) => generateTable());
    $('#numberOfConstraints').on('change', (event) => generateTable());

    generateTable();

});

function generateTable() {
    let numberOfVariables = $('#numberOfVariables').val();
    let numberOfConstraints = $('#numberOfConstraints').val();

    let $objectiveFunction = $('#objectiveFunction');
    let $constraints = $('#constraints');

    $objectiveFunction.html('');
    $constraints.html('');

    $objectiveFunction.append(makeObjectiveFunction(numberOfVariables));

    for (let i = 0; i < numberOfConstraints; i++) {
        let $rows = Array(numberOfVariables + 2);

        let opOps = $operatorOptions.clone();
        opOps.attr('id', `op-${i}`);

        let b = $('<input>').attr('id', `b-${i}`).attr('type', 'number').attr('value', '0');

        let j = 0;
        for (; j < numberOfVariables; j++) {
            $rows[j] = ($('<input>').attr('id', `c-${i}-${j}`).attr('type', 'number').attr('value', '0'));
        }

        $rows[j + 1] = opOps;
        $rows[j + 2] = b;

        $constraints.append($(`<div>`).addClass('flex-spacing').html($rows));
    }

    $('select').formSelect();
}
