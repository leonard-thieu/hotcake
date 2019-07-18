import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class EmptyStatement extends Statement {
    readonly kind = NodeKind.EmptyStatement;
}
