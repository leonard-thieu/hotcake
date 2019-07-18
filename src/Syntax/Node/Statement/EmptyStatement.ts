import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export const EmptyStatementChildNames: ReadonlyArray<keyof EmptyStatement> = [
    'terminator',
];

export class EmptyStatement extends Statement {
    readonly kind = NodeKind.EmptyStatement;
}
