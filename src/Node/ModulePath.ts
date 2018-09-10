import { ParseContextElementArray } from '../ParserBase';
import { MissableToken, MissingToken } from '../Token/MissingToken';
import { PeriodToken } from '../Token/Token';
import { Identifier } from './Identifier';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class ModulePath extends Node {
    static CHILD_NAMES: (keyof ModulePath)[] = [
        'children',
        'scopeMemberAccessOperator',
        'identifier',
    ];

    readonly kind = NodeKind.ModulePath;

    children: ParseContextElementArray<ModulePath['kind']>;
    scopeMemberAccessOperator: MissableToken<PeriodToken> | null = null;
    identifier: Identifier | null = null;
}

export type MissableModulePath = ModulePath | MissingToken<NodeKind.ModulePath>;
