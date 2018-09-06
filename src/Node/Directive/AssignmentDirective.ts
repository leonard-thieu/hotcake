import { ConfigurationVariableToken, EqualsSignToken, MissingExpressionToken, PlusSignEqualsSignToken } from '../../Token/Token';
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
    expression: Expressions | MissingExpressionToken;

    // Reconsider splitting `#` from directive tokens so this isn't necessary.
    getConfigurationVariableName(document: string) {
        const directiveName = this.name.getText(document);

        let i = 1;
        for (; i < directiveName.length; i++) {
            const c = directiveName[i];
            // WARN: Doesn't handle all whitespace.
            if (c !== ' ') {
                break;
            }
        }

        return directiveName.substring(i);
    }
}
