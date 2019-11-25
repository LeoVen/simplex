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

// Shows the simplex result
var SimplexResult = {}

$(document).ready(function () {
    SimplexResult.output = $('#resultModal .modal-content');
});

SimplexResult.show = function (data) {
    console.log(data);
    SimplexResult.output.html('<h4>Result</h4>');

    SimplexResult.showInitialLinearProgram(data);
    SimplexResult.showResults(data);
    SimplexResult.showFinalResult(data);
}

SimplexResult.showInitialLinearProgram = function (data) {

    let objFunction = $('<p>').html([
        data.type === 'max' ? 'Maximize Z = ' : 'Minimize Z = ',
        data.objectiveFunction.map((val, i) => `${val} * X${i}`).join(' + ')
    ]);

    let constraintsText = $('<div>').html(() =>
        data.constraints.map((c, ci) => $('<p>').html([
            c.map((val, i) => `${val} * X${i}`).join(' + '),
            " ",
            data.operators[ci],
            " ",
            data.b[ci]
        ]))
    );

    SimplexResult.output.append(
        $('<div>').html([
            $('<p>').text('Initial Linear Program'),
            objFunction,
            constraintsText
        ])
    );
}

SimplexResult.showResults = function (data) {
    let result = Array();

    // Skip the initial linear program up to the penultimate result
    for (let i = 1; i < data.steps.length - 1; i++) {
        // Add title
        result.push($('<hr>'));
        result.push($('<h5>').text(`Pivot ${i}`));

        let pInfo = data.steps[i].pivotInfo;
        let table = SimplexResult.transformMatrixToTable(data.columns,
            data.steps[i].matrix,
            pInfo.pivotRowIndex,
            pInfo.pivotColIndex,
            true);

        console.log(pInfo);

        result.push(table);
    }

    SimplexResult.output.append(result);
}

SimplexResult.showFinalResult = function (data) {
    let result = Array();

    result.push($('<hr>'));
    result.push($('<h5>').text('Final Table'));

    let lastResult = data.steps[data.steps.length - 1];

    let table = SimplexResult.transformMatrixToTable(data.columns, lastResult.matrix, 0, 0, false);

    result.push(table);

    SimplexResult.output.append(result);
}

SimplexResult.transformMatrixToTable = function (columns, matrix, pivotRow, pivotCol, color) {
    let table = $('<table>').addClass('striped');
    let tableHead = $('<thead>');
    let tableBody = $('<tbody>');

    tableHead.append($('<tr>').html(
        columns.map((colName) => $('<th>').html(colName))
    ));

    table.append(tableHead);

    tableBody.html(matrix.map(
        (c, i) => $('<tr>').html(
            c.map((val, j) => $('<td>')
                .addClass(SimplexResult.getColorClass(i, j, pivotRow, pivotCol, color))
                .html(val.toFixed(2)))
        ))
    );

    table.append(tableBody);

    return table;
}

SimplexResult.getColorClass = function (row, col, pivotRow, pivotCol, color) {
    if (!color) {
        return '';
    }

    if (row === pivotRow && col === pivotCol) {
        return 'purple lighten-1';
    }

    if (row === pivotRow) {
        return 'red lighten-2';
    }

    if (col === pivotCol) {
        return 'blue lighten-2';
    }

    return '';
}

// Build basic and non basic variables and Z value
SimplexResult.getVariables = function (data) {

}
