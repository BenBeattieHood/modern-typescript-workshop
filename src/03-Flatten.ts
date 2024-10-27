export function flatten_exercise<Values extends unknown[]>(
    values: Values,
) /* what should be the return type */ {
    //#region Code
    const result: unknown[] = [];
    function visit(x: unknown) {
        if (Array.isArray(x)) {
            x.forEach(visit);
        } else {
            result.push(x);
        }
    }
    values.forEach(visit);
    return result;
    //#endregion
}

const exercise_flattenedArray = flatten_exercise([1, 2, [3, [4], 5], 6]);

// Excercise: Implement the Flatten<T> type

// We can't do loops in types, but we can do recursion

//#region Recursion over an array in JS
function someLoop(values: any[]) {
    const [head, ...rest] = values;
    console.log(head);
    return someLoop(rest);
}

//#region We can do the same in types

type Flatten_v0<T extends unknown[]> =
    T extends [unknown, ...unknown[]]
        ? // Do something
        : T; // it's an empty array, so just as-is


//#region Tool 1: How do we get the type of the first item?

//#region Example
// type Flatten<T extends unknown[]> =
//     T extends [infer Head, ...infer Rest]
//         ? // Do something
//         : [];
//#endregion

//#region Tool 2: Recursion in tuples (pronounced: 'tuh-ples')

//#region Breakdown
/* Now, flatten the head
// ? [
//     ...(Head extends unknown[] ? Flatten<Head> : [Head]),
//     // something else
// ]
*/

/* and then recurse over the rest
// ? [
//     ...(Head extends unknown[] ? Flatten<Head> : [Head]),
//     ...Flatten<Rest>
// ]
*/
//#endregion

//#region Example:
type Flatten<T extends unknown[]> = T extends [infer Head, ...infer Rest]
    ? [...(Head extends unknown[] ? Flatten<Head> : [Head]), ...Flatten<Rest>]
    : [];
//#endregion

type Result = Flatten<[1, 2, [3, [4], 5], 6]>;
//#endregion
//#endregion
//#endregion
//#endregion