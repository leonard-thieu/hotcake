import { Token } from "../../Token";
import { Node } from "../Node";
import { NodeKind } from "../NodeKind";
import { QualifiedIdentifier } from "../QualifiedIdentifier";
import { Statement } from "./Statement";

export class ClassDeclaration extends Statement {
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
    implementedTypes: Array<QualifiedIdentifier | Token> | null = null;

    // Abstract or Final
    attributes: Token[] = [];

    members: Array<Node | Token>;
    endKeyword: Token;
    endClassKeyword: Token | null = null;
}
