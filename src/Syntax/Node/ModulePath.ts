import { MissableToken } from '../Token/MissingToken';
import { IdentifierToken, PeriodToken } from '../Token/Tokens';
import { Node, NodeKind } from './Nodes';

export const ModulePathChildNames: ReadonlyArray<keyof ModulePath> = [
    'children',
    'moduleIdentifier',
];

export class ModulePath extends Node {
    readonly kind = NodeKind.ModulePath;

    children: (IdentifierToken | PeriodToken)[] = undefined!;
    moduleIdentifier: MissableToken<IdentifierToken> = undefined!;
}
