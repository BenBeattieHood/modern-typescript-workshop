type LooseTuple<Values extends readonly any[]> = {
    -readonly [Key in keyof Values]: Values[Key] extends readonly any[] ? LooseTuple<Values[Key]> : Values[Key];
};