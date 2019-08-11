import { MissableToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, NewlineToken, OpeningSquareBracketToken } from '../../Token/Tokens';
import { CommaSeparator } from '../CommaSeparator';
import { NodeKind } from '../Nodes';
import { Expression, MissableExpression } from './Expressions';

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
