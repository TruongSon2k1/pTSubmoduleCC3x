
declare type TFlexArgsFunction<T = any> = (...args: any[]) => T
declare type TClassConstructor<T = any> = new (...args: any[]) => T
declare type TKeys<T> = keyof T
declare type TFlexData<T> = T | T[]
declare type TExcludeKeys<T, K extends keyof T> = Omit<T, K>
declare type TObjectFunctions<T> = { [K in TKeys<T>]: T[K] extends TFlexArgsFunction ? K : never }[TKeys<T>];
declare type TObjectProperties<T> = { [K in TKeys<T>]: T[K] extends TFlexArgsFunction ? never : K }[TKeys<T>];

