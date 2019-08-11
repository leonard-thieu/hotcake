import { MissableToken } from '../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken } from '../Token/Tokens';
import { MissableExpression } from './Expression/Expressions';
import { Node, NodeKind } from './Nodes';

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
