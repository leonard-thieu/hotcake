import { MissableToken } from '../../Token/MissingToken';
import { ConfigurationVariableToken, EqualsSignToken, PlusSignEqualsSignToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class AssignmentDirective extends Directive {
    readonly kind = NodeKind.AssignmentDirective;

    name: ConfigurationVariableToken = undefined!;
    operator: MissableToken<EqualsSignToken | PlusSignEqualsSignToken> = undefined!;
    expression: MissableExpression = undefined!;
}
