import { MissingToken } from '../../MissingToken';
import { Token } from '../../Token';
import { Expression } from '../Expression/Expression';
import { Directive } from './Directive';

export class ErrorDirective extends Directive {
    static CHILD_NAMES: (keyof ErrorDirective)[] = [
        'numberSign',
        'errorDirectiveKeyword',
        'expression',
    ];

    errorDirectiveKeyword: Token | null = null;
    expression: Expression | MissingToken | null = null;
}
