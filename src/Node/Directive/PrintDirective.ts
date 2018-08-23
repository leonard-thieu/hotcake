import { MissingToken } from '../../MissingToken';
import { Token } from '../../Token';
import { Expression } from '../Expression/Expression';
import { Directive } from './Directive';

export class PrintDirective extends Directive {
    static CHILD_NAMES: (keyof PrintDirective)[] = [
        'numberSign',
        'printDirectiveKeyword',
        'expression',
    ];

    printDirectiveKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
}
