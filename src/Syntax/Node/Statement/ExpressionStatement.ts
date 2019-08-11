import { MissableExpression } from '../Expression/Expressions';
import { NodeKind } from '../Nodes';
import { Statement } from './Statements';

export const ExpressionStatementChildNames: ReadonlyArray<keyof ExpressionStatement> = [
    'expression',
    'terminator',
];

export class ExpressionStatement extends Statement {
    readonly kind = NodeKind.ExpressionStatement;

    expression: MissableExpression = undefined!;
}
