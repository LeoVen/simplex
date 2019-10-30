/**
 * simplex.c
 *
 * Creation Date: 29/10/2019
 *
 */

/**
 * Steps
 *
 * Linear Program -> Standard Form -> Slack Form -> Simplex Algorithm -> Solution
 *
 * Conversion to Standard Form
 *
 * 1. If objective function is minimise -> maximize
 *      a. multiply by (-1) to assert that it is in a maximize form
 *      b. [ minimise ax + by + cz ] -> [ maximize -ax -by - cz ]
 * 2. Variable does not have non negativity constraint -> 2 variables with non
 *    negativity constraints
 *      a. x = x' - x''
 *      b. x', x'' >= 0
 *      c. Replace x by x' - x''
 * 3. Equality -> 2 Inequalities
 *      a. [ ax + by = c ] -> [ ax + by >= c ] and [ ax + by <= c ]
 * 4. Inequalities in correct form (ax + by <= c)
 *      a. [ ax + by >= c ] -> [ -ax -by <= -c ]
 *
 * Conversion to Slack Form
 *
 */

#include "core.h"
#include "collect.h"

int main(int argc, char const *argv[])
{
    if (argc != 2)
    {
        fprintf(stderr,
                "How to use:\n"
                " %s path/to/file.txt\n\n"
                "Where in the file there must be:\n"
                "    - The objective function\n"
                "    - The constraints\n", argv[0]);
        return 1;
    }

    return 0;
}
