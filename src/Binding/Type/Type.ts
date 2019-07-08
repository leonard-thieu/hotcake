export abstract class Type {
    constructor(readonly name: string) { }

    abstract isConvertibleTo(target: Type): boolean;
}
