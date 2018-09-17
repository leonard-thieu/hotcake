import { ConfigurationTagEndToken, ConfigurationTagStartToken, IdentifierToken } from '../Token/Token';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class ConfigurationTag extends Node {
    static CHILD_NAMES: (keyof ConfigurationTag)[] = [
        'startToken',
        'name',
        'endToken',
    ];

    readonly kind = NodeKind.ConfigurationTag;

    startToken: ConfigurationTagStartToken = undefined!;
    name?: IdentifierToken = undefined;
    endToken: ConfigurationTagEndToken = undefined!;

    get firstToken() {
        return this.startToken;
    }

    get lastToken() {
        return this.endToken;
    }
}
