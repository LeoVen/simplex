/**
 * collect.h
 *
 * Creation Date: 30/10/2019
 *
 */
#pragma once

#include "macro_collections.h"

CMC_COLLECTION_GENERATE_HEADER(LIST, arr, array, , double);
CMC_COLLECTION_GENERATE_HEADER(LIST, mat, matrix, , struct array);

/* Extra matrix functions */
double matrix_get(struct matrix *mat, int row, int col);
bool matrix_set(struct matrix *mat, int row, int col, double value);
