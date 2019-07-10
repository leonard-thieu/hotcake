import { MissableToken } from '../../Token/MissingToken';
import { ConfigurationVariableToken, EqualsSignToken, PlusSignEqualsSignToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class AssignmentDirective extends Directive {
    static CHILD_NAMES: (keyof AssignmentDirective)[] = [
        'numberSign',
        'name',
        'operator',
        'expression',
    ];

    readonly kind = NodeKind.AssignmentDirective;

    name: ConfigurationVariableToken = undefined!;
    operator: MissableToken<EqualsSignToken | PlusSignEqualsSignToken> = undefined!;
    expression: MissableExpression = undefined!;

    get lastToken() {
        if (isNode(this.expression)) {
            return this.expression.lastToken;
        }

        return this.expression;
    }
}