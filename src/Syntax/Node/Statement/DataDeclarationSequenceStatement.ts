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

    get firstToken() {
        return this.dataDeclarationSequence.firstToken;
    }

    get lastToken() {
        if (this.terminator) {
            return this.terminator;
        }
        
        return this.dataDeclarationSequence.lastToken;
    }
}
