// WIP

// Main class containing the simplex logic
var Simplex = {}

Simplex.init = function (tab) {
    if (tab.objectiveFunction == undefined
        || tab.constraints == undefined
        || tab.operators == undefined
        || tab.b == undefined) {
        throw Exception("Not all input requirements are met when creating Simplex object");
    }

    Simplex.objectiveFunction = objectiveFunction;
    Simplex.constraints = constraints;
    Simplex.operators = operators;
    Simplex.b = b;

    // For each <= constraint we add a   slack variable
    // For each >= constraint we add a surplus variable
}

Simplex.normalize = function () {

}

Simplex.simplex = function () {
    // Get variables from SimplexTable
    let table = SimplexTable.getSimplexTable();
}
