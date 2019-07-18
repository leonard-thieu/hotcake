import { SuperKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Expression } from './Expression';

export class SuperExpression extends Expression {
    readonly kind = NodeKind.SuperExpression;

    superKeyword: SuperKeywordToken = undefined!;
}
