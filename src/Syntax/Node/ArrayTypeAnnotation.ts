import { MissableToken } from '../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken } from '../Token/Token';
import { MissableExpression } from './Expression/Expression';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export const ArrayTypeAnnotationChildNames: ReadonlyArray<keyof ArrayTypeAnnotation> = [
    'openingSquareBracket',
    'expression',
    'closingSquareBracket',
];

export class ArrayTypeAnnotation extends Node {
    readonly kind = NodeKind.ArrayTypeAnnotation;

    openingSquareBracket: OpeningSquareBracketToken = undefined!;
    expression?: MissableExpression = undefined;
    closingSquareBracket: MissableToken<ClosingSquareBracketToken> = undefined!;
}
