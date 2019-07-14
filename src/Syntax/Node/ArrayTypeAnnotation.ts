import { MissableToken } from '../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken } from '../Token/Token';
import { MissableExpression } from './Expression/Expression';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class ArrayTypeAnnotation extends Node {
    static CHILD_NAMES: (keyof ArrayTypeAnnotation)[] = [
        'openingSquareBracket',
        'expression',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.ArrayTypeAnnotation;

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
