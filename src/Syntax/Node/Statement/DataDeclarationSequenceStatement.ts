import { DataDeclarationSequence } from '../Declaration/DataDeclarationSequence';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export const DataDeclarationSequenceStatementChildNames: ReadonlyArray<keyof DataDeclarationSequenceStatement> = [
    'dataDeclarationSequence',
    'terminator',
];

export class DataDeclarationSequenceStatement extends Statement {
    readonly kind = NodeKind.DataDeclarationSequenceStatement;

    dataDeclarationSequence: DataDeclarationSequence = undefined!;
}
