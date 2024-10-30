// types vs interfaces
// minimum contract
// union types
// index signatures
// function signatures
// overloads
// classes are not types *
// constructor signatures
// satisfies
// generic constraints
// const generics *
// Exhaustivity checking using never *
// Type guards *


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