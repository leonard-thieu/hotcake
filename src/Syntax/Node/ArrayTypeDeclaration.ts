import { MissableToken } from '../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken } from '../Token/Token';
import { MissableExpression } from './Expression/Expression';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class ArrayTypeDeclaration extends Node {
    static CHILD_NAMES: (keyof ArrayTypeDeclaration)[] = [
        'openingSquareBracket',
        'expression',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.ArrayTypeDeclaration;

    openingSquareBracket: OpeningSquareBracketToken = undefined!;
    expression?: MissableExpression = undefined;
    closingSquareBracket: MissableToken<ClosingSquareBracketToken> = undefined!;

    get firstToken() {
        return this.openingSquareBracket;
    }

    get lastToken() {
        return this.closingSquareBracket;
    }
}
