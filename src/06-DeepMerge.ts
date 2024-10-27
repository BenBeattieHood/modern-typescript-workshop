const deepMergeRecords_untyped = (...args: any[]): any => {
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

const result = deepMergeRecords_untyped(
    {
        componentType: "primary-pressable",
        style: {
            backgroundColor: "#CD2E96",
            color: "white",
        }
    },
    {
        componentType: "dev-pressable",
        style: {
            fontWeight: 'bold',
            fontFamily: 'monospace',
        },
        behaviour: {
            onPress: () => console.log("Pressed"),
        }
    },
    {
        componentType: "dev-theme",
        style: {
            fontFamily: 'monospace',
        },
    }
);





export type DeepMergeTwoRecords<
    A extends Record<keyof any, any>,
    B extends Record<keyof any, any>,
> = A extends object
    ? B extends object
    ? {
        [K in keyof A | keyof B]: K extends keyof A
        ? K extends keyof B
        ? A[K] extends object
        ? B[K] extends object
        ? DeepMergeTwoRecords<A[K], B[K]>
        : B[K]
        : B[K]
        : A[K]
        : // this latter part shouldn't really be needed, but
        // TS is having difficulty inferring here that K must
        // always be a keyof B 🤷‍♂️
        K extends keyof B
        ? B[K]
        : never;
    }
    : B
    : B;

export type DeepMergeMultipleRecords<
    A extends Record<keyof any, any>,
    Tail extends [...any[]],
> = Tail extends [infer B extends Record<keyof any, any>]
    ? DeepMergeTwoRecords<A, B>
    : Tail extends [infer B extends Record<keyof any, any>, ...infer NextTail]
    ? DeepMergeTwoRecords<A, DeepMergeMultipleRecords<B, NextTail>>
    : A;

const deepMergeRecords = <
    A extends Record<keyof any, any>,
    B extends [A, ...any[]],
>(
    ...args: B
): DeepMergeMultipleRecords<A, B> => { };
