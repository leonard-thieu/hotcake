import { PrintDirectiveKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class PrintDirective extends Directive {
    static CHILD_NAMES: (keyof PrintDirective)[] = [
        'printDirectiveKeyword',
        'expression',
    ];

    readonly kind = NodeKind.PrintDirective;

    printDirectiveKeyword: PrintDirectiveKeywordToken;
    expression: MissableExpression;
}
