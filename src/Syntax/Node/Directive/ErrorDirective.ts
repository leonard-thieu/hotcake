import { ErrorDirectiveKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

export const ErrorDirectiveChildNames: ReadonlyArray<keyof ErrorDirective> = [
    'numberSign',
    'errorDirectiveKeyword',
    'expression',
];

export class ErrorDirective extends Directive {
    readonly kind = NodeKind.ErrorDirective;

    errorDirectiveKeyword: ErrorDirectiveKeywordToken = undefined!;
    expression: MissableExpression = undefined!;
}
