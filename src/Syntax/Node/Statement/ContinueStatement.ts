import { ContinueKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ContinueStatement extends Statement {
    static CHILD_NAMES: (keyof ContinueStatement)[] = [
        'continueKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.ContinueStatement;

    continueKeyword: ContinueKeywordToken = undefined!;

    get firstToken() {
        return this.continueKeyword;
    }

    get lastToken() {
        if (this.terminator) {
            return this.terminator;
        }
        
        return this.continueKeyword;
    }
}
