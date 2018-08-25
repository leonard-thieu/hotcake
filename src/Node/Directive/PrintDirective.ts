import { MissingToken } from '../../MissingToken';
import { Token } from '../../Token';
import { Expression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class PrintDirective extends Directive {
    static CHILD_NAMES: (keyof PrintDirective)[] = [
        'numberSign',
        'printDirectiveKeyword',
        'expression',
    ];

    readonly kind = NodeKind.PrintDirective;

    printDirectiveKeyword: Token;
    expression: Expression | MissingToken;
}
