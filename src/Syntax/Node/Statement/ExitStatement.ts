import { ExitKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class ExitStatement extends Statement {
    readonly kind = NodeKind.ExitStatement;

    exitKeyword: ExitKeywordToken = undefined!;
}
