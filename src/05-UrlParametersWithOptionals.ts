export type ParamsOf<Url extends string> = Extract<
    Url extends `${infer Head}/${infer Rest}` ? Head | ParamsOf<Rest>
    : Url extends "" ? never
    : Url,
    `:${string}`
>;

type Result = ParamsOf<"api/person/:personId/address/:addressId">;





//#region Going further

// What if we allowed optional parameters?

type ResultWithOptionalParameters =
    ParamsOf<"api/person/:personId(/address/:addressId)">;


// We're going to need some more tools to solve this:

//#region Tool 1: We can return multiple fields from a conditional type

type GetParts<Name> = Name extends `${infer Head} ${infer Surname}`
    ? { firstName: Head; lastName: Surname }
    : never;
type FirstName = GetParts<"John Doe">["firstName"];
type LastName = GetParts<"John Doe">["lastName"];
type NotARealName = GetParts<"Strawberry">["firstName"];

//#region Previously in UrlParameters we can concatenate UnionA | UnionB - but how do we concatenate _nested_ fields?

// Use a helper type to concatenate the two objects
type MergeParamSplits_v1<
    A extends {
        required: string;
        optional: string;
    },
    B extends {
        required: string;
        optional: string;
    },
> = {
    required: A["required"] | B["required"];
    optional: A["optional"] | B["optional"];
};

//#region Use this helper type and the nested infer extraction tool in our refined ParamsOf type
type ParamsWithOptionalOf_v1<Url extends string> =
    Url extends `${infer Head}(${infer HeadOptional})${infer Rest}`
    ? MergeParamSplits_v1<
        {
            required: ParamsOf<Head>;
            optional: ParamsOf<HeadOptional>;
        },
        ParamsWithOptionalOf_v1<Rest>
    >
    : {
        required: ParamsOf<Url>;
        optional: never;
    };

type ResultWithOptional_v1 =
    ParamsWithOptionalOf_v1<"api/person/:personId(/address/:addressId)">;

//#region Let's tighten that up by reduring the amount we write 'required' and 'optional'
//#region Example
interface RequiredAndOptional_Example<Required, Optional> {
    required: Required;
    optional: Optional;
}

type MergeParamSplits_v2_Example<
    A extends RequiredAndOptional_Example<string, string>,
    B extends RequiredAndOptional_Example<string, string>,
> = {
    required: A["required"] | B["required"];
    optional: A["optional"] | B["optional"];
};

type ParamsWithOptionalOf_v2_Example<Url extends string> =
    Url extends `${infer Head}(${infer HeadOptional})${infer Rest}`
    ? MergeParamSplits_v2_Example<
        RequiredAndOptional_Example<
            /* required: */ ParamsOf<Head>,
            /* optional: */ ParamsOf<HeadOptional>
        >,
        ParamsWithOptionalOf_v2_Example<Rest>
    >
    : RequiredAndOptional_Example<
        /* required: */ ParamsOf<Url>,
        /* optional: */ never
    >;

type ResultWithOptional_v2_Example =
    ParamsWithOptionalOf_v2_Example<"api/person/:personId(/address/:addressId)">;
//#endregion

//#region Use that parsed type within two separate Record types, which we can intersect (&), and assign to a shorthand new 'ParamsOfWithOptional' type that we can use
//#region Example

// Join a Record<RequiredKeys, Value> with a Partial<Record<OptionalKeys, Value>>
type RequiredAndPartialRecord<
    T extends RequiredAndOptional_Example<string, string>,
    Value,
> =
    Record<T["required"], Value>
    & Partial<Record<T["optional"], Value>>;



type ParamsOfWithOptional<Url extends string> = RequiredAndPartialRecord<
    ParamsWithOptionalOf_v2_Example<Url>,
    string
>;
//#endregion

function interpolateUrlWithOptionals<Url extends string>(
    url: Url,
    parameters: ParamsOfWithOptional<Url>,
) {
    // ...
}

interpolateUrlWithOptionals("api/person/:personId(/address/:addressId)", {
    // Let's test our type here
});
//#endregion
//#endregion
//#endregion
//#endregion
//#endregion
//#endregion
