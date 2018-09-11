import { DataDeclarationSequence } from '../Declaration/DataDeclarationSequence';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class DataDeclarationSequenceStatement extends Statement {
    static CHILD_NAMES: (keyof DataDeclarationSequenceStatement)[] = [
        'dataDeclarationSequence',
        'terminator',
    ];

    readonly kind = NodeKind.DataDeclarationSequenceStatement;

    dataDeclarationSequence: DataDeclarationSequence = undefined!;
}
