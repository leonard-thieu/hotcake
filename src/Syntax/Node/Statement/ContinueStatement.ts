import { ContinueKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ContinueStatement extends Statement {
    readonly kind = NodeKind.ContinueStatement;

    continueKeyword: ContinueKeywordToken = undefined!;
}
