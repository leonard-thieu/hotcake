import { DataDeclarationSequence } from '../Declaration/DataDeclarationSequence';
import { NodeKind } from '../Nodes';
import { Statement } from './Statements';

export const DataDeclarationSequenceStatementChildNames: ReadonlyArray<keyof DataDeclarationSequenceStatement> = [
    'dataDeclarationSequence',
    'terminator',
];

export class DataDeclarationSequenceStatement extends Statement {
    readonly kind = NodeKind.DataDeclarationSequenceStatement;

    dataDeclarationSequence: DataDeclarationSequence = undefined!;
}
