import { ConfigurationTagEndToken, ConfigurationTagStartToken, IdentifierToken } from '../Token/Tokens';
import { Node, NodeKind } from './Nodes';

export const ConfigurationTagChildNames: ReadonlyArray<keyof ConfigurationTag> = [
    'startToken',
    'name',
    'endToken',
];

export class ConfigurationTag extends Node {
    readonly kind = NodeKind.ConfigurationTag;

    startToken: ConfigurationTagStartToken = undefined!;
    name?: IdentifierToken = undefined;
    endToken: ConfigurationTagEndToken = undefined!;
}
