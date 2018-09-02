import { ErrorDirectiveKeywordToken, MissingExpressionToken } from '../../Token/Token';
import { Expressions } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export class ErrorDirective extends Directive {
    static CHILD_NAMES: (keyof ErrorDirective)[] = [
        'errorDirectiveKeyword',
        'expression',
    ];

    readonly kind = NodeKind.ErrorDirective;

    errorDirectiveKeyword: ErrorDirectiveKeywordToken;
    expression: Expressions | MissingExpressionToken;
}
