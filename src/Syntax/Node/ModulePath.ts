import { ParseContextElementDelimitedSequence, ParseContextKind } from '../ParserBase';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class ModulePath extends Node {
    static CHILD_NAMES: (keyof ModulePath)[] = [
        'children',
    ];

    readonly kind = NodeKind.ModulePath;

    children: ParseContextElementDelimitedSequence<ParseContextKind.ModulePathSequence> = undefined!;

    get firstToken() {
        return this.children[0];
    }

    get lastToken() {
        return this.children[this.children.length - 1];
    }
}