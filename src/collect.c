/**
 * collect.c
 *
 * Creation Date: 30/10/2019
 *
 */

#include "collect.h"
#include "core.h"

CMC_COLLECTION_GENERATE_SOURCE(LIST, arr, array, , double);
CMC_COLLECTION_GENERATE_SOURCE(LIST, mat, matrix, , struct array);

double matrix_get(struct matrix *mat, int row, int col)
{
    struct array *array_r = mat_get_ref(mat, row);
    if (array_r == NULL)
    {
        cmc_log_error("Error - row: %d, col: %d", row, col);
        return NAN;
    }

    double *result = arr_get_ref(array_r, col);
    if (result == NULL)
    {
        cmc_log_error("Error - row: %d, col: %d", row, col);
        return NAN;
    }

    return *result;
}

bool matrix_set(struct matrix *mat, int row, int col, double value)
{
    struct array *array_r = mat_get_ref(mat, row);
    if (array_r == NULL)
    {
        cmc_log_error("Error - row: %d, col: %d, value: %.2lf", row, col, value);
        return false;
    }

    double *result = arr_get_ref(array_r, col);
    if (result == NULL)
    {
        cmc_log_error("Error - row: %d, col: %d, value: %.2lf", row, col, value);
        return false;
    }

    *result = value;

    return true;
}
