import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export const ExpressionStatementChildNames: ReadonlyArray<keyof ExpressionStatement> = [
    'expression',
    'terminator',
];

export class ExpressionStatement extends Statement {
    readonly kind = NodeKind.ExpressionStatement;

    expression: MissableExpression = undefined!;
}
