// types vs interfaces
// minimum contract
// union types
// index signatures
// function signatures
// overloads
// classes are not types
// constructor signatures
// satisfies
// const generics
// generic constraints
// Exhaustivity checking using never
// Union distributivity
// Type guards


//#region Types vs Interfaces
interface Person {
    name: string;
    age: number;
}
//#endregion


//#region Classes are not type constraints - TS just derives an in-memory type from the class's shape
class MyClass {
    constructor(public someValue: string) { }
    specialBehaviour(anotherValue: string) {
        this.someValue += " " + anotherValue;
    }
}
function someFunctionTakingAClass(myClass: MyClass) {
    myClass.specialBehaviour("world"); // Assuming a certain behaviour because of the class parameter type
}

//#region Proof
const myValue = {
    someValue: "Hello",
    specialBehaviour: () => { },
};
someFunctionTakingAClass(myValue) // If it fits, it's allowed.
//#endregion
//#endregion






//#region 'const' generics
const myFunc = <T>(t: T): T => t;
const result = myFunc({
    name: "Jess",
    age: 30,
});
//#endregion