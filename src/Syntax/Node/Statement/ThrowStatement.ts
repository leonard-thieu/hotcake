import { ThrowKeywordToken } from '../../Token/Tokens';
import { MissableExpression } from '../Expression/Expressions';
import { NodeKind } from '../Nodes';
import { Statement } from './Statements';

export const ThrowStatementChildNames: ReadonlyArray<keyof ThrowStatement> = [
    'throwKeyword',
    'expression',
    'terminator',
];

export class ThrowStatement extends Statement {
    readonly kind = NodeKind.ThrowStatement;

    throwKeyword: ThrowKeywordToken = undefined!;
    expression: MissableExpression = undefined!;
}
