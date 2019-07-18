import { PrintDirectiveKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Directive } from './Directive';

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
