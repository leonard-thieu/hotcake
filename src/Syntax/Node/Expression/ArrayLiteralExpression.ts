import { MissableToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, NewlineToken, OpeningSquareBracketToken } from '../../Token/Token';
import { CommaSeparator } from '../CommaSeparator';
import { NodeKind } from '../NodeKind';
import { Expression, MissableExpression } from './Expression';

export const ArrayLiteralExpressionChildNames: ReadonlyArray<keyof ArrayLiteralExpression> = [
    'newlines',
    'openingSquareBracket',
    'leadingNewlines',
    'expressions',
    'closingSquareBracket',
];

export class ArrayLiteralExpression extends Expression {
    readonly kind = NodeKind.ArrayLiteralExpression;

    openingSquareBracket: OpeningSquareBracketToken = undefined!;
    leadingNewlines: NewlineToken[] = undefined!;
    expressions: (MissableExpression | CommaSeparator)[] = undefined!;
    closingSquareBracket: MissableToken<ClosingSquareBracketToken> = undefined!;
}
