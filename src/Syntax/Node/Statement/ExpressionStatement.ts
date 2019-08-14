import { MissingToken } from '../../Token/MissingToken';
import { Expressions } from '../Expression/Expressions';
import { NodeKind } from '../Nodes';
import { Statement } from './Statements';

export const ExpressionStatementChildNames: ReadonlyArray<keyof ExpressionStatement> = [
    'expression',
    'terminator',
];

export class ExpressionStatement extends Statement {
    readonly kind = NodeKind.ExpressionStatement;

    expression: Expressions | MissingToken = undefined!;
}
