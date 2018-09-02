import { MissingToken } from '../../Token/MissingToken';
import { ConfigurationVariableToken, EqualsSignToken, PlusSignEqualsSignToken } from '../../Token/Token';
import { Expressions } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class AssignmentDirective extends Directive {
    static CHILD_NAMES: (keyof AssignmentDirective)[] = [
        'name',
        'operator',
        'expression',
    ];

    readonly kind = NodeKind.AssignmentDirective;

    name: ConfigurationVariableToken;
    operator: EqualsSignToken | PlusSignEqualsSignToken;
    expression: Expressions | MissingToken;
}
