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
    SimplexResult.output.html('<h4>Result</h4>');

    if (data.failed) {
        SimplexResult.output.append('Could not solve the Linear Program in ' + data.iter + ' iterations');
    } else {
        SimplexResult.showInitialLinearProgram(data);
        SimplexResult.showResults(data);
        SimplexResult.showFinalResult(data);
    }
}

SimplexResult.showInitialLinearProgram = function (data) {

    let result = $('<ul>').addClass('collection').addClass('with-header');

    let header = $('<li>').addClass('collection-header').html('<b>Initial Linear Program</b>');

    let objFunction = $('<li>').addClass('collection-item').html([
        data.type === 'max' ? 'Maximize Z = ' : 'Minimize Z = ',
        data.objectiveFunction.map((val, i) => `${val} * X<sub>${i}</sub>`).join(' + ')
    ]);

    let constraintsText = $('<div>').html(() =>
        [
            $('<li>').addClass('collection-item').html('Subject To:'),
            ...data.constraints.map((c, ci) => $('<li>')
                .addClass('collection-item')
                .html([
                    c.map((val, i) => `${val} * X<sub>${i}</sub>`).join(' + '),
                    " ",
                    data.operators[ci],
                    " ",
                    data.b[ci]
                ]))
        ]
    );

    result.append(header, objFunction, constraintsText);

    SimplexResult.output.append($('<div>').html([result]));
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

        result.push(table);

        result.push($('<h5>').text(`Solution ${i}`));
        result.push(SimplexResult.buildAnswer(data, i));
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

    result.push(SimplexResult.buildAnswer(data, data.steps.length - 1));

    result.push('<hr>');

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
SimplexResult.buildAnswer = function (data, nthStep) {
    let targetMatrix = data.steps[nthStep].matrix;

    let result = $('<ul>').addClass('collection');

    let valueZ = $('<li>')
        .addClass('collection-item')
        .text(`Value of Z: ${targetMatrix[0][targetMatrix[0].length - 1].toFixed(2)}`);

    let basicVar = $('<li>').addClass('collection-item').append('Basic Variables: <br>');
    let nonBasicVar = $('<li>').addClass('collection-item').append('Non-Basic Variables: <br>');

    // For each column check if they are in the basic or not
    // except for the first and last ones
    for (let i = 1; i < targetMatrix[0].length - 1; i++) {

        let col = Simplex.getColumn(targetMatrix, i);

        // Skip first row where the objective function is
        if (Simplex.isBasic(col.slice(1))) {
            basicVar.append(`${data.columns[i]} = 0 <br>`);
        } else {
            nonBasicVar.append(`${data.columns[i]} = ${Simplex.valueOfNonBasic(targetMatrix, i).toFixed(2)} <br>`);
        }
    }

    result.html([valueZ, nonBasicVar, basicVar]);

    return result;
}
