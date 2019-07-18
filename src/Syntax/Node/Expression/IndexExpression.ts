import { MissableToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression, Expressions, MissableExpression } from './Expression';

export const IndexExpressionChildNames: ReadonlyArray<keyof IndexExpression> = [
    'newlines',
    'indexableExpression',
    'openingSquareBracket',
    'indexExpressionExpression',
    'closingSquareBracket',
];

export class IndexExpression extends Expression {
    readonly kind = NodeKind.IndexExpression;

    indexableExpression: Expressions = undefined!;
    openingSquareBracket: OpeningSquareBracketToken = undefined!;
    indexExpressionExpression: MissableExpression = undefined!;
    closingSquareBracket: MissableToken<ClosingSquareBracketToken> = undefined!;
}
