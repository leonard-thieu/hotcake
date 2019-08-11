import { ExitKeywordToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { Statement } from './Statements';

export const ExitStatementChildNames: ReadonlyArray<keyof ExitStatement> = [
    'exitKeyword',
    'terminator',
];

export class ExitStatement extends Statement {
    readonly kind = NodeKind.ExitStatement;

    exitKeyword: ExitKeywordToken = undefined!;
}
