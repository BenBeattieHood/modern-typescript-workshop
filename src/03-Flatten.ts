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

// Eww, ⬇︎ this is also type-unsafe - it's an 'unknown[]'
const exercise_flattenedArray = flatten_exercise([1, 2, [3, [4], 5], 6]);






//#region Exercise: Implement the Flatten<T> type



// type Flatten<T extends unknown[]> = /* our code here */;
// type Result = Flatten<[1, 2, [3, [4], 5], 6]>;
// We want 'Result' to be [1, 2, 3, 4, 5, 6]


//#region If you did this in JavaScript, how would you do it?

//#region We can't do loops in types, but we can do recursion

type Flatten_v0<T extends unknown[]> =
    T extends [unknown, ...unknown[]]
    ? // Do something
    : T; // T is an empty array, so just return it as-is





//#region Tool 1: How do we infer the type of the first item?

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
type Flatten<T extends unknown[]> =
    T extends [infer Head, ...infer Rest]
    ? [...(Head extends unknown[]
        ? Flatten<Head>
        : [Head]), ...Flatten<Rest>]
    : [];
//#endregion

type Result = Flatten<[1, 2, [3, [4], 5], 6]>;

function flatten<const T extends unknown[]>(values: T): Flatten<T> {
    //#region Code
    return values as any;
    //#endregion
}
const flattenedArray = flatten([1, 2, [3, [4], 5], 6]);



//#endregion
//#endregion
//#endregion


//#endregion
//#endregion



