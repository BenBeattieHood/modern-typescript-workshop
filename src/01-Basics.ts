// types vs interfaces
// minimum contract
// union types and distribution
// index signatures
// function signatures
// overloads
// classes are not types
// constructor signatures
// satisfies
// const generics
// generic constraints
// Exhaustivity checking using never
// Type guards



//#region Type Aliases

interface Person {
    name: string;
    age: number;
}

type PersonTypeRef = {
    name: string;
    age: number;
};

//#endregion

//#region Structural Typing

// In structural typing, types are minimum contracts for the data that is being passed around

//#region Bad:
interface Person {
    name: string;
    age: number;
}
function sayHello_Bad(person: Person) {
    return `Hello, ${person.name}`;
}

// Q: What's wrong with this approach?

//#endregion

//#region Good:
function sayHello(greetable: { name: string }) {
    return `Hello, ${greetable.name}`;
}

// A: Only expose the properties that the function requires to do its job

//#region Usage:
const ashley = {
    name: "Ashley",
    age: 30,
};
const ashleyGreeting = sayHello(ashley); // No error, because ashley has the required properties of Person

const cat = {
    name: "Whiskers",
    favouriteFood: "Tuna",
};
const catGreeting = sayHello(cat); // No error, because cat has the required properties of Person
//#endregion

//#endregion

//#endregion

//#region Literals

const one = 1;
let two = 2;

const name = "Jess"; // literal
const jess = {
    name: "Jess", // not a literal - why?
};

//#endregion

//#region Union Types

type Color = "red" | "blue" | "green";
let color: Color = "red"; // only these values are allowed
color = "blue";
color = "baked beans"; // Error: Type '"baked beans"' is not assignable to type 'Color'.

//#endregion

//#region References

// In JS, think of things as references as returning an anonymous or named value

const someValue = {
    name: "Blake",
}; // Anonymous value, assigned to a reference

const anotherValue = someValue; // Value from the reference is copied to another reference

//#region What's the type of the anonymous value?
type SomeValue = {
    name: string;
};
// Prove it:
const x: SomeValue = someValue;
//#endregion

//#region Parameterized references

// Some references you can pass parameters to in order to get a different value

const add = (a: number, b: number) => a + b;

const yetAnotherValue = add;

const a = yetAnotherValue;
const b = yetAnotherValue(1, 2);

//#region What's the type of this anonymous value?
type Add = {
    (a: number, b: number): number;
};
//#endregion

function add2(a: number, b: number): number;
function add2(a: string, b: string): string;
function add2(a: any, b: any): any {
    return a + b;
}

//#endregion

//#region Isolate
export const __nothing = "";
//#endregion
