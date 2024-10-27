export const deepMergeRecords_untyped = (...args: any[]): any => {
    //#region Code
    const isMergableRecord = (o: any): o is Record<keyof any, any> =>
        typeof o === "object" &&
        Object.getPrototypeOf(o).constructor.name === "Object";
    // _reversing_ through the params, and through each of their respective fields, allows us to emulate overloading while merging
    const reversedResult = args.reduceRight<Record<keyof any, any>>(
        (result, arg) => {
            Object.entries(arg)
                .reverse()
                .forEach(([fieldName, a]) => {
                    if (fieldName in result) {
                        if (isMergableRecord(a)) {
                            const b = result[fieldName];
                            if (isMergableRecord(b)) {
                                const merged = deepMergeRecords(a, b);
                                result[fieldName] = merged;
                            }
                        }
                    } else {
                        result[fieldName] = a;
                    }
                });
            return result;
        },
        {},
    );

    // reverse the reversed keyvalues, so that they come out in the same order that they were originally
    return Object.fromEntries(Object.entries(reversedResult).reverse()) as any;
    //#endregion
};

const result_example = deepMergeRecords_untyped(
    {
        backgroundColor: "#CD2E96",
        color: "white",
        ":hover": {
            backgroundColor: "#A40061",
        },
    },
    {
        fontWeight: "bold",
        fontFamily: "monospace",
    },
    {
        fontFamily: '"Fira Code"',
        ":hover": {
            outline: "solid 1px white",
        },
    },
);

/*
Output should be:
const result: {
  backgroundColor: '#CD2E96',
  color: 'white',
  fontWeight: 'bold',
  fontFamily: '"Fira Code"',
  ':hover': {
    backgroundColor: '#A40061',
    outline: 'solid 1px white'
  }
}
*/

//#region First, let's merge two records
//#region Example
type AnyRecord_Example = Record<keyof any, unknown>;

type DeepMergeTwoRecords_Example<
    A extends AnyRecord_Example,
    B extends AnyRecord_Example,
> = [A, B] extends [Record<infer AKey, unknown>, Record<infer BKey, unknown>]
    ? {
          [K in AKey | BKey]: K extends AKey
              ? K extends BKey
                  ? A[K] extends AnyRecord_Example
                      ? B[K] extends AnyRecord_Example
                          ? DeepMergeTwoRecords_Example<A[K], B[K]>
                          : B[K]
                      : B[K]
                  : A[K]
              : K extends BKey
                ? B[K]
                : never;
      }
    : never;
//#endregion

const deepMergeTwoRecords = <
    A extends AnyRecord_Example,
    B extends AnyRecord_Example,
>(
    a: A,
    b: B,
): DeepMergeTwoRecords<A, B> => {};

const testOfMergingTwoRecords = deepMergeTwoRecords(
    {
        backgroundColor: "#CD2E96",
        color: "white",
        ":hover": {
            backgroundColor: "#A40061",
        },
    },
    {
        fontWeight: "bold",
        fontFamily: "monospace",
    },
);

//#region Now, let's merge N records
//#region Example
export type DeepMergeMultipleRecords<Records extends AnyRecord_Example[]> =
    Records extends []
        ? never
        : Records extends [infer A extends AnyRecord_Example]
          ? A
          : Records extends [
                  infer A extends AnyRecord_Example,
                  infer B extends AnyRecord_Example,
              ]
            ? DeepMergeTwoRecords_Example<A, B>
            : Records extends [
                    infer A extends AnyRecord_Example,
                    infer B extends AnyRecord_Example,
                    ...infer Rest extends AnyRecord_Example[],
                ]
              ? DeepMergeTwoRecords_Example<
                    A,
                    DeepMergeMultipleRecords<[B, ...Rest]>
                >
              : never;
//#endregion

const deepMergeRecords = <const Records extends AnyRecord_Example[]>(
    ...args: Records
): DeepMergeMultipleRecords<Records> => {};

const testOfMergingMultipleRecords = deepMergeRecords(
    {
        backgroundColor: "#CD2E96",
        color: "white",
        ":hover": {
            backgroundColor: "#A40061",
        },
    },
    {
        fontWeight: "bold",
        fontFamily: "monospace",
    },
    {
        fontFamily: '"Fira Code"',
        ":hover": {
            outline: "solid 1px white",
        },
    },
);
//#endregion
//#endregion
