import { NewKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { MissableTypeReference } from '../TypeReference';
import { Expression } from './Expression';

export class NewExpression extends Expression {
    readonly kind = NodeKind.NewExpression;

    newKeyword: NewKeywordToken = undefined!;
    type: MissableTypeReference = undefined!;
}
