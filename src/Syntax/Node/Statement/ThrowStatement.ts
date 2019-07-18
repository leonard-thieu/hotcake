import { ThrowKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ThrowStatement extends Statement {
    readonly kind = NodeKind.ThrowStatement;

    throwKeyword: ThrowKeywordToken = undefined!;
    expression: MissableExpression = undefined!;
}
