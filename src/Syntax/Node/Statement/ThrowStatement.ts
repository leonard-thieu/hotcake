import { ThrowKeywordToken } from '../../Token/Tokens';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

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
