import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class EmptyStatement extends Statement {
    static CHILD_NAMES: (keyof EmptyStatement)[] = [
        'terminator',
    ];

    readonly kind = NodeKind.EmptyStatement;

    get firstToken() {
        return this.terminator!;
    }

    get lastToken() {
        return this.terminator!;
    }
}
