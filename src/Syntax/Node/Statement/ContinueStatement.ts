import { ContinueKeywordToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { Statement } from './Statements';

export const ContinueStatementChildNames: ReadonlyArray<keyof ContinueStatement> = [
    'continueKeyword',
    'terminator',
];

export class ContinueStatement extends Statement {
    readonly kind = NodeKind.ContinueStatement;

    continueKeyword: ContinueKeywordToken = undefined!;
}
