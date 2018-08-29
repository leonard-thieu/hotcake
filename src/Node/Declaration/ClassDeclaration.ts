import { ParseContextElementArray, ParseContextKind } from "../../Parser";
import { Token } from "../../Token";
import { NodeKind } from "../NodeKind";
import { QualifiedIdentifier } from "../QualifiedIdentifier";
import { Declaration } from "./Declaration";

export class ClassDeclaration extends Declaration {
    static CHILD_NAMES: (keyof ClassDeclaration)[] = [
        'classKeyword',
        'name',
        'lessThanSign',
        'typeParameters',
        'greaterThanSign',
        'extendsKeyword',
        'implementsKeyword',
        'implementedTypes',
        'attributes',
        'members',
        'endKeyword',
        'endClassKeyword',
    ];

    readonly kind = NodeKind.ClassDeclaration;

    classKeyword: Token;
    name: Token;

    // Generic
    lessThanSign: Token | null = null;
    typeParameters: Token[] | null = null;
    greaterThanSign: Token | null = null;

    // Extends
    extendsKeyword: Token | null = null;
    baseType: QualifiedIdentifier | null = null;

    // Implements
    implementsKeyword: Token | null = null;
    implementedTypes: ParseContextElementArray<ParseContextKind.BaseTypes> | null = null;

    // Abstract or Final
    attributes: Token[] = [];

    members: ParseContextElementArray<ClassDeclaration['kind']>;
    endKeyword: Token;
    endClassKeyword: Token | null = null;
}
