import { ClosingSquareBracketToken, MissingExpressionToken, OpeningSquareBracketToken } from '../Token/Token';
import { Expressions } from './Expression/Expression';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class ArrayTypeDeclaration extends Node {
    static CHILD_NAMES: (keyof ArrayTypeDeclaration)[] = [
        'openingSquareBracket',
        'expression',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.ArrayTypeDeclaration;

    openingSquareBracket: OpeningSquareBracketToken;
    expression: Expressions | MissingExpressionToken | null = null;
    closingSquareBracket: ClosingSquareBracketToken;
}
