export function interpolateUrl<Url extends string>(
    url: Url,
    parameters: any, // What should this parameter's type be?
) {
    // ...
}

// Exercise: Implement the interpolateUrl function's 'parameters' argument's type

//#region Tool 1: 'never's are removed from unions - so we can map non-parameters to never
type Example_v1 = never | string | boolean; // string | boolean

//#region Tool 2: infer works inside template literals too
//#region Example
type SplitUrl_v2_Example<Url extends string> =
    Url extends `${infer Head}/${infer Rest}` ? Head | SplitUrl_v2_Example<Rest>
    : Url extends "" ? never
    : Url;
type Result_v2_Example =
    SplitUrl_v2_Example<"api/person/:personId/address/:addressId">;
//#endregion

//#region Tool 3: When you apply a conditional type to a union, it distributes over the union

// So let's build a type that returns never if a string param doesn't start with a colon

//#region Example
type ExtractParams<Param extends string> = Param extends `:${string}`
    ? Param
    : never;
type Result_v3_Example = Extract<
    SplitUrl_v2_Example<"api/person/:personId/address/:addressId">,
    `:${string}`
>;
//#endregion

// Now we can use the keys returned to create a Record type
//#endregion

//#endregion

function interpolateUrl_TypeSafe<Url extends string>(
    url: Url,
    parameters: Record</* ParamsOf<Url> */, string>,
) {
    // ...
}

interpolateUrl_TypeSafe("api/person/:personId/address/:addressId", {
    // Let's test our type here
});
