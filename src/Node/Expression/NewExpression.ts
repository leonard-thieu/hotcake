import { NewKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { TypeReference } from '../TypeReference';
import { Expression } from './Expression';

export class NewExpression extends Expression {
    static CHILD_NAMES: (keyof NewExpression)[] = [
        'newlines',
        'newKeyword',
        'type',
    ];

    readonly kind = NodeKind.NewExpression;

    newKeyword: NewKeywordToken;
    type: TypeReference;
}
