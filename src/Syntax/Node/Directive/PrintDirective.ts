import { PrintDirectiveKeywordToken } from '../../Token/Tokens';
import { MissableExpression } from '../Expression/Expressions';
import { NodeKind } from '../Nodes';
import { Directive } from './Directives';

export const PrintDirectiveChildNames: ReadonlyArray<keyof PrintDirective> = [
    'numberSign',
    'printDirectiveKeyword',
    'expression',
];

export class PrintDirective extends Directive {
    readonly kind = NodeKind.PrintDirective;

    printDirectiveKeyword: PrintDirectiveKeywordToken = undefined!;
    expression: MissableExpression = undefined!;
}
