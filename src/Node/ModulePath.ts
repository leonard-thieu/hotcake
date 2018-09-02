import { IdentifierToken, PeriodToken } from '../Token/Token';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class ModulePath extends Node {
    static CHILD_NAMES: (keyof ModulePath)[] = [
        'children',
    ];

    readonly kind = NodeKind.ModulePath;

    children: Array<IdentifierToken | PeriodToken> = [];
}
