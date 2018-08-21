import { Token } from '../Token';
import { Node } from './Node';

export class ModuleNode extends Node {
    static CHILD_NAMES: (keyof ModuleNode)[] = [
        'members',
        'eofToken',
    ];

    members: Array<Node | Token> = [];
    eofToken: Token | null = null;
}
