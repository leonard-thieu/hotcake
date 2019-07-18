import { ReturnKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ReturnStatement extends Statement {
    readonly kind = NodeKind.ReturnStatement;

    returnKeyword: ReturnKeywordToken = undefined!;
    // TODO: Is this actually missable at the syntax level?
    expression?: MissableExpression = undefined;
}
