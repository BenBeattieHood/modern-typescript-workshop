// We'll cover:
// types vs interfaces *
// minimum contract
// union types and intersection types
// index signatures
// function signatures
// overloads
// classes are not types *
// satisfies
// generic constraints
// const generics *
// Exhaustivity checking using never *
// Type guards *
// conditional types *
// distributivity *


//#region Types vs Interfaces
interface Person {
    name: string;
    age: number;
}
//#endregion







//#region Classes are not type constraints - TS just derives an in-memory type from the class's shape
function validateEmail(email: string) {
    if (/^\S+@\S+\.\S+$/.test(email) === false) {
        throw new Error("Invalid email");
    }
}
class User {
    constructor(public email: string) {
        validateEmail(email);
    }
}
function myFunctionAssumingEmailIsValidated(user: User) {
    sns.sendEmail({
        to: user.email,
        subject: "Hello",
        body: "World",
    }); // Assuming a certain behaviour because of the class parameter type
}

//#region Proof
myFunctionAssumingEmailIsValidated({
    email: "nothing", //oh no :'(
}) // Same shape as the class, so it's allowed

//#region A better approach is using a branded type
type Email = string & { __email: never };
function createEmail(email: string): Email {
    validateEmail(email);
    return email as Email;
}
function myFunctionAssumingEmailIsValidated_v2(email: Email) {
    // ...
}
const notAnEmail = "nothing";
const anEmail = createEmail("bbeattiehood@atlassian.com");
console.log(notAnEmail, anEmail); // prints: "nothing" "bbeattiehood@atlassian.com" because they're both still strings
myFunctionAssumingEmailIsValidated_v2(notAnEmail); // Error: prevents unvalidated string
myFunctionAssumingEmailIsValidated_v2(anEmail); // OK: because it's a validated string
//#endregion


//#endregion
//#endregion






//#region 'const' generics
const myFunc = <T>(t: T): T => t;
const result = myFunc({
    name: "Jess",
    age: 30,
});
//#endregion



//#region Exhaustivity checking using never
type Color = "red" | "green" | "blue";
function toHex(color: Color): string {
    switch (color) {
        case "red": return "#ff0000";
        case "green": return "#00ff00";
        default: return "#0000ff";
    }
}
//#endregion



//#region Type guards
function isColor(s: any): s is Color {
    return s === "red" || s === "green" || s === "blue";
}
function toHex_v2(color: any): string {
    if (isColor(color)) {
        return toHex(color);
    }
    throw new Error("Invalid color parameter");
}
//#endregion


//#region Conditional types
type HexOf<C extends Color> =
    C extends "red" ? "#ff0000"
    : C extends "green" ? "#00ff00"
    : "#0000ff";
function toHex_v3<C extends Color>(color: C): HexOf<C> {
    //#region Code
    return toHex(color) as any;
    //#endregion
}
const redHex = toHex_v3("red");
//#endregion



//#region Distributivity

type Hex = HexOf<Color>;
//#endregion






/* Intro to next sections:
Next we'll go through more advanced examples, moving through piece by piece so you will see what's 
going on. But they're just to show you how to use the types. And in doing this I'm going to show 
you a set of tools in code, that help you construct types- that make things easier to do more 
complex things.

What I want out of this is that next time you're thinking of setting a parameter's type as 
'any' or 'record', you perhaps give one of the following techniques or tools we use here a try 
first, and see if you can make the type be a bit tighter.
*/