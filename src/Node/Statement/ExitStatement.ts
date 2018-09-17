import { ExitKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ExitStatement extends Statement {
    static CHILD_NAMES: (keyof ExitStatement)[] = [
        'exitKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.ExitStatement;

    exitKeyword: ExitKeywordToken = undefined!;

    get firstToken() {
        return this.exitKeyword;
    }

    get lastToken() {
        if (this.terminator) {
            return this.terminator;
        }
        
        return this.exitKeyword;
    }
}
