export type Extractor<
    S extends string,
    T extends string
> = S extends `${T}_${infer R}` ? R : never
