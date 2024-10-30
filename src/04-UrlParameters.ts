export function interpolateUrl<Url extends string>(
    url: Url,
    parameters: any, // What should this parameter's type be?
) {
    // ...
}








// Exercise: Implement the interpolateUrl function's 'parameters' argument's type





//#region Tool 1: infer works inside template literals too
//#region Example
type SplitUrl_v1_Example<Url extends string> =
    Url extends `${infer Head}/${infer Rest}`
    ? Head | SplitUrl_v1_Example<Rest>
    : Url extends ""
    ? never
    : Url;
type Result_v1_Example =
    SplitUrl_v1_Example<"api/person/:personId/address/:addressId">;
//#endregion

// type SplitUrl<Url extends string> =
//     Url extends `${infer Head}/${infer Rest}`

//#region Tool 2: Remember, 'never's are removed from unions - and we can remove these using the 'Exclude' utility type (see inside the utility type to see how it works)
type ExampleWithoutBoolean = Exclude<number | string | boolean | Date, boolean>; // string | boolean

//#region Join these tools together - let's build a type that returns never if a string param doesn't start with a colon

//#region Example
type ExtractParams<Param extends string> = Param extends `:${string}`
    ? Param
    : never;
type Result_v3_Example = ExtractParams<
    SplitUrl_v1_Example<"api/person/:personId/address/:addressId">
>;
//#endregion

// Now we can use the keys returned to create a Record type
//#endregion



function interpolateUrl_TypeSafe<Url extends string>(
    url: Url,
    parameters: Record</* ParamsOf<Url> */, string>,
) {
    // ...
}

interpolateUrl_TypeSafe("api/person/:personId/address/:addressId", {
},);

//#endregion