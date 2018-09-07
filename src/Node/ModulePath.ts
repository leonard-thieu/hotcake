import { ParseContextElementArray } from '../ParserBase';
import { MissableToken, MissingToken } from '../Token/MissingToken';
import { IdentifierToken, PeriodToken } from '../Token/Token';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class ModulePath extends Node {
    static CHILD_NAMES: (keyof ModulePath)[] = [
        'children',
        'scopeMemberAccessOperator',
        'name',
    ];

    readonly kind = NodeKind.ModulePath;

    children: ParseContextElementArray<ModulePath['kind']>;
    scopeMemberAccessOperator: MissableToken<PeriodToken> | null = null;
    name: MissableToken<IdentifierToken> | null = null;
}

export type MissableModulePath = ModulePath | MissingToken<NodeKind.ModulePath>;
