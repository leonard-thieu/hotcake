import { StrictKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class StrictDirective extends Declaration {
    static CHILD_NAMES: (keyof StrictDirective)[] = [
        'strictKeyword',
    ];

    readonly kind = NodeKind.StrictDirective;

    strictKeyword: StrictKeywordToken = undefined!;

    get firstToken() {
        return this.strictKeyword;
    }

    get lastToken() {
        return this.strictKeyword;
    }
}
