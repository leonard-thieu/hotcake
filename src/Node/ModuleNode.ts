import { Token } from '../Token';
import { Directive } from './Directive/Directive';
import { Node } from './Node';

export class ModuleNode extends Node {
    static CHILD_NAMES: (keyof ModuleNode)[] = [
        'members',
        'eofToken',
    ];

    members: Array<Directive | Token> = [];
    eofToken: Token | null = null;
}
