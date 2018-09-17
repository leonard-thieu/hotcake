import { NewKeywordToken } from '../../Token/Token';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { MissableTypeReference } from '../TypeReference';
import { Expression } from './Expression';

export class NewExpression extends Expression {
    static CHILD_NAMES: (keyof NewExpression)[] = [
        'newlines',
        'newKeyword',
        'type',
    ];

    readonly kind = NodeKind.NewExpression;

    newKeyword: NewKeywordToken = undefined!;
    type: MissableTypeReference = undefined!;

    get firstToken() {
        if (this.newlines && this.newlines.length !== 0) {
            return this.newlines[0];
        }

        return this.newKeyword;
    }

    get lastToken() {
        if (isNode(this.type)) {
            return this.type.lastToken;
        }

        return this.type;
    }
}
