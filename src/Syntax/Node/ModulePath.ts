import { ParseContextElementDelimitedSequence, ParseContextKind } from '../ParserBase';
import { MissableToken } from '../Token/MissingToken';
import { IdentifierToken } from '../Token/Token';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export const ModulePathChildNames: ReadonlyArray<keyof ModulePath> = [
    'children',
    'moduleIdentifier',
];

export class ModulePath extends Node {
    readonly kind = NodeKind.ModulePath;

    children: ParseContextElementDelimitedSequence<ParseContextKind.ModulePathSequence> = undefined!;
    moduleIdentifier: MissableToken<IdentifierToken> = undefined!;
}
