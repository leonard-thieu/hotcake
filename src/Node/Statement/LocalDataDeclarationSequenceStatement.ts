import { DataDeclarationSequence } from '../Declaration/DataDeclarationSequence';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class LocalDataDeclarationSequenceStatement extends Statement {
    static CHILD_NAMES: (keyof LocalDataDeclarationSequenceStatement)[] = [
        'localDataDeclarationSequence',
        'terminator',
    ];

    readonly kind = NodeKind.LocalDataDeclarationSequenceStatement;

    localDataDeclarationSequence: DataDeclarationSequence;
}
