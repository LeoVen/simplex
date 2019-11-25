// WIP

// Main class containing the simplex logic
//      Step 0 - Show initial table
//      Step 1 - Show normalized table
//      Step 2 - Show pivoting while not done
//      Step 3 - Show final result
var Simplex = {}

Simplex.assertDataIsCorrect = function (data) {
    if (typeof data === 'undefined'
        || typeof data.type === 'undefined'
        || typeof data.objectiveFunction === 'undefined'
        || typeof data.constraints === 'undefined'
        || typeof data.operators === 'undefined'
        || typeof data.b === 'undefined'
        || typeof data.columns === 'undefined') {
        console.error('Error, data input to simplex equals:');
        console.log(data);
        throw new Error("Not all data parameters were found");
    }
}

// Main function to calculate simplex with already normalized data
Simplex.simplex = function (data) {
    Simplex.assertDataIsCorrect(data);

    return Simplex.normalize(data);
}

// Convert the linear program to standard form
Simplex.normalize = function (data) {

    data.numberOfVariables = data.objectiveFunction.length;
    data.numberOfConstraints = data.constraints.length;

    data.slack = Array();
    data.surplus = Array();

    // For each <= constraint we add a   slack variable
    // For each >= constraint we add a surplus variable
    for (let i = 0; i < data.numberOfConstraints; i++) {
        if (data.operators[i] === '<=') {
            // Add   slack variable
            this.addSlack(data, i);
        } else if (data.operators[i] === '>=') {
            // Add surplus variable
            this.addSurplus(data, i);
        }
    }

    let columnsToAdd = [...data.slack, ...data.surplus];

    data.matrix = Array(data.constraints.length + columnsToAdd.length);

    // Append columns

    for (let i = 0; i < data.matrix.length - columnsToAdd.length; i++) {
        data.matrix[i] = data.constraints[i].slice();
    }

    data.matrix = Simplex.transpose(data.matrix);

    for (let i = 0; i < columnsToAdd.length; i++) {
        data.matrix.push(columnsToAdd[i].slice());
    }

    data.matrix = Simplex.transpose(data.matrix);

    // Not sure why but the length of the matrix doesn't match up anymore
    data.matrix.length = data.constraints.length;

    console.table(data.matrix);

    return data;
}

// i = ith constraint
Simplex.addSlack = function (data, i) {
    // numberOfConstraints since we are creating a column
    let result = Array(data.numberOfConstraints).fill(0);

    result[i] = 1;

    data.columns.push(`Sl${data.slack.length}`);
    data.slack.push(result);
}

// i = ith constraint
Simplex.addSurplus = function (data, i) {
    // numberOfConstraints since we are creating a column
    let result = Array(data.numberOfConstraints).fill(0);

    result[i] = - 1;

    data.columns.push(`Sp${data.surplus.length}`);
    data.surplus.push(result);
}

// Transposes a 2D matrix
Simplex.transpose = function (array) {
    return array[0].map((col, i) => array.map(row => row[i]));
}
