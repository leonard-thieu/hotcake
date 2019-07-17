import { ParseContextElementDelimitedSequence, ParseContextKind } from '../ParserBase';
import { MissableToken } from '../Token/MissingToken';
import { IdentifierToken } from '../Token/Token';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class ModulePath extends Node {
    static CHILD_NAMES: (keyof ModulePath)[] = [
        'children',
        'moduleIdentifier',
    ];

    readonly kind = NodeKind.ModulePath;

    children: ParseContextElementDelimitedSequence<ParseContextKind.ModulePathSequence> = undefined!;
    moduleIdentifier: MissableToken<IdentifierToken> = undefined!;

    get firstToken() {
        return this.children[0];
    }

    get lastToken() {
        return this.moduleIdentifier;
    }
}
