import { ContinueKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export const ContinueStatementChildNames: ReadonlyArray<keyof ContinueStatement> = [
    'continueKeyword',
    'terminator',
];

export class ContinueStatement extends Statement {
    readonly kind = NodeKind.ContinueStatement;

    continueKeyword: ContinueKeywordToken = undefined!;
}
