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

if (typeof SimplexTable === 'undefined') {
    throw new Error("SimplexTable.js is missing");
}

if (typeof Simplex === 'undefined') {
    throw new Error("Simplex.js is missing");
}

if (typeof SimplexResult === 'undefined') {
    throw new Error("SimplexResult.js is missing");
}

if (typeof SimplexUtil === 'undefined') {
    throw new Error("SimplexResult.js is missing");
}

$(document).ready(function () {

    $('.modal').modal();
    $('select').formSelect();

    $('#numberOfVariables').on('change', SimplexTable.changeVariables);
    $('#numberOfConstraints').on('change', SimplexTable.changeConstraints);
    $('#calculate').on('click', calculateSimplex);
    $('#reset').on('click', SimplexTable.resetTable);
    $('#clear').on('click', SimplexTable.clearTable);
    $('#save').on('click', SimplexTable.saveTable);
    $('#load').on('click', SimplexTable.loadTable);

    SimplexTable.changeConstraints();
    SimplexTable.changeVariables();

});

function add(quantity, variable) {
    if (variable === 'variable') {
        let numberOfVariables = $('#numberOfVariables').val() * 1;

        if (numberOfVariables === 1 && quantity < 0) {
            return;
        }

        numberOfVariables += quantity > 0 ? 1 : - 1;

        $('#numberOfVariables').val(numberOfVariables);

        SimplexTable.changeVariables();

    } else if (variable === 'constraint') {
        let numberOfConstraints = $('#numberOfConstraints').val() * 1;

        if (numberOfConstraints === 1 && quantity < 0) {
            return;
        }

        numberOfConstraints += quantity > 0 ? 1 : - 1;

        $('#numberOfConstraints').val(numberOfConstraints);

        SimplexTable.changeConstraints();
    }
}

function calculateSimplex() {
    SimplexResult.show(Simplex.simplex(SimplexTable.getSimplexTable()));
}
