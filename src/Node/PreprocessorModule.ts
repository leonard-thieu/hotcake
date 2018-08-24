import { Token } from '../Token';
import { Directive } from './Directive/Directive';
import { Node } from './Node';

export class PreprocessorModule extends Node {
    static CHILD_NAMES: (keyof PreprocessorModule)[] = [
        'members',
        'eofToken',
    ];

    members: Array<Directive | Token> = [];
    eofToken: Token | null = null;
}
