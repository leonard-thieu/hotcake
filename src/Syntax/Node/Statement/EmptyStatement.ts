import { NodeKind } from '../Nodes';
import { Statement } from './Statements';

export const EmptyStatementChildNames: ReadonlyArray<keyof EmptyStatement> = [
    'terminator',
];

export class EmptyStatement extends Statement {
    readonly kind = NodeKind.EmptyStatement;
}
