import { ReturnKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export const ReturnStatementChildNames: ReadonlyArray<keyof ReturnStatement> = [
    'returnKeyword',
    'expression',
    'terminator',
];

export class ReturnStatement extends Statement {
    readonly kind = NodeKind.ReturnStatement;

    returnKeyword: ReturnKeywordToken = undefined!;
    expression?: MissableExpression = undefined;
}
