import { MissingToken } from '../../Token/MissingToken';
import { ClosingSquareBracketToken, OpeningSquareBracketToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { Expression, Expressions } from './Expressions';

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
    indexExpressionExpression: Expressions | MissingToken = undefined!;
    closingSquareBracket: ClosingSquareBracketToken | MissingToken = undefined!;
}
