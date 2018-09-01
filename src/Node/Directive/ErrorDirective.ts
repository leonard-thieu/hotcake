import { MissingToken } from '../../Token/MissingToken';
import { Token } from '../../Token/Token';
import { Expressions } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class ErrorDirective extends Directive {
    static CHILD_NAMES: (keyof ErrorDirective)[] = [
        'errorDirectiveKeyword',
        'expression',
    ];

    readonly kind = NodeKind.ErrorDirective;

    errorDirectiveKeyword: Token;
    expression: Expressions | MissingToken;
}
