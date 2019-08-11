import { MissableToken } from '../../Token/MissingToken';
import { ConfigurationVariableToken, EqualsSignToken, PlusSignEqualsSignToken } from '../../Token/Tokens';
import { MissableExpression } from '../Expression/Expressions';
import { NodeKind } from '../Nodes';
import { Directive } from './Directives';

export const AssignmentDirectiveChildNames: ReadonlyArray<keyof AssignmentDirective> = [
    'numberSign',
    'name',
    'operator',
    'expression',
];

export class AssignmentDirective extends Directive {
    readonly kind = NodeKind.AssignmentDirective;

    name: ConfigurationVariableToken = undefined!;
    operator: MissableToken<EqualsSignToken | PlusSignEqualsSignToken> = undefined!;
    expression: MissableExpression = undefined!;
}
