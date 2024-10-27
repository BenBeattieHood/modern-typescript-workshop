export function jsonOf_exercise(
    data: any,
) /* what type should be returned here? */ {
    return JSON.parse(JSON.stringify(data));
}
const someJsonValue = jsonOf_exercise({
    name: "John",
    age: 30,
    dateOfBirth: new Date(),
});

// Exercise:

// Person type
interface Person {
    id: number;
    name: string;
    dateOfBirth: Date;
    address: {
        street: string;
        postcode: string;
        movedInOn: Date;
    };
}

// Target JSON type
// type Example = {
// 	id: number;
// 	name: string;
// 	dateOfBirth: string; // Date -> string
// 	address: {
// 		street: string;
// 		postcode: string;
// 		movedInOn: string; // Date -> string
// 	};
// };

//#region: First try, mapping the fields
//#region Example
type JsonOf_v1_Example<T> = {
    [K in keyof T]: T[K] extends Date ? string : T[K];
};
type Test_v1 = JsonOf_v1_Example<Person>; // Nested objects are not converted
//#endregion

//#region: Second try, nested objects are converted
//#region Example
type JsonOf_v2_Example<T> = {
    [K in keyof T]: T[K] extends Date
        ? string
        : T[K] extends object
          ? JsonOf_v2_Example<T[K]>
          : T[K];
};
type Test_v2 = JsonOf_v2_Example<Person>; // Hmm...we can't see - use TypeScript Explorer extension for easier view
//#endregion

//#region: Third try - catering for functions

interface Person {
    id: number;
    name: string;
    dateOfBirth: Date;
    address: {
        street: string;
        postcode: string;
        movedInOn: Date;
    };
    move: (newAddress: {
        street: string;
        postcode: string;
        movedInOn: Date;
    }) => void;
}

//#region: Tool #1: you can't union against never (Example)
type X = string | number | boolean | never;
//#endregion

//#region: Tool #2: you can combine string types into a template literal (Example)
type Animal = "dog" | "cat" | "bird";
type MyDaughterSays = `I only love ${Animal}s! ❤️`;

const myDaughterSays: MyDaughterSays = "I only love dogs! ❤️"; // Yep
const myDaughterDoesntSay: MyDaughterSays = "I only love cauliflour! ❤️"; // Nope
//#endregion

//#region: Tool #3: you can cast keys when mapping over them (Example)
type SomethingPerson = {
    [K in keyof Person as `Something${K}`]: Person[K];
};
type SomethingGeneric<T extends Record<string, unknown>> = {
    // Error:
    [K in keyof T as `Something${K}`]: T[K]; // Oh no
    // Fix:
    //[K in Extract<keyof T, string> as `Something${K}`]: T[K];  // Oh yeah
};
//#endregion

//#region: Combine them: map field keys that have function values to never (Example)
type Lambda = (...args: any[]) => any;
type NoFunctions<T> = {
    [K in keyof T as T[K] extends Lambda ? never : K]: T[K];
};
//#endregion

//#endregion
//#endregion
//#endregion
