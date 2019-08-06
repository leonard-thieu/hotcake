import { ErrorDirectiveKeywordToken } from '../../Token/Tokens';
import { MissableExpression } from '../Expression/Expressions';
import { NodeKind } from '../Nodes';
import { Directive } from './Directives';

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
