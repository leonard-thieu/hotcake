import { ParseContextElementDelimitedSequence } from '../ParserBase';
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

    children: ParseContextElementDelimitedSequence<ModulePath['kind']> = undefined!;
    scopeMemberAccessOperator?: MissableToken<PeriodToken> = undefined;
    identifier?: Identifier = undefined;
}

export type MissableModulePath = ModulePath | MissingToken<NodeKind.ModulePath>;
