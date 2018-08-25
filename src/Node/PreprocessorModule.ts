import { Token } from '../Token';
import { Directives } from './Directive/Directive';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class PreprocessorModule extends Node {
    static CHILD_NAMES: (keyof PreprocessorModule)[] = [
        'members',
        'eofToken',
    ];

    readonly kind = NodeKind.PreprocessorModule;

    members: Array<Directives | Token> = [];
    eofToken: Token;
}
