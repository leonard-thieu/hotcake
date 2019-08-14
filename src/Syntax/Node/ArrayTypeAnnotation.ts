import { MissingToken } from '../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken } from '../Token/Tokens';
import { Expressions } from './Expression/Expressions';
import { Node, NodeKind } from './Nodes';

export const ArrayTypeAnnotationChildNames: ReadonlyArray<keyof ArrayTypeAnnotation> = [
    'openingSquareBracket',
    'expression',
    'closingSquareBracket',
];

export class ArrayTypeAnnotation extends Node {
    readonly kind = NodeKind.ArrayTypeAnnotation;

    openingSquareBracket: OpeningSquareBracketToken = undefined!;
    expression?: Expressions | MissingToken = undefined!;
    closingSquareBracket: ClosingSquareBracketToken | MissingToken = undefined!;
}
