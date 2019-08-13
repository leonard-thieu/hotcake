import { MissingToken } from '../../Token/MissingToken';
import { ConfigurationVariableToken, EqualsSignToken, PlusSignEqualsSignToken } from '../../Token/Tokens';
import { Expressions } from '../Expression/Expressions';
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
    operator: EqualsSignToken | PlusSignEqualsSignToken | MissingToken = undefined!;
    expression: Expressions | MissingToken = undefined!;
}
