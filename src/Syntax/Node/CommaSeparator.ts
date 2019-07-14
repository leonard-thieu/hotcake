import { ParseContextElementSequence, ParseContextKind } from '../ParserBase';
import { CommaToken } from '../Token/Token';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class CommaSeparator extends Node {
    static CHILD_NAMES: (keyof CommaSeparator)[] = [
        'separator',
        'newlines',
    ];

    readonly kind = NodeKind.CommaSeparator;

    separator: CommaToken = undefined!;
    newlines: ParseContextElementSequence<ParseContextKind.NewlineList> = undefined!;

    get firstToken() {
        return this.separator;
    }

    get lastToken() {
        if (this.newlines.length !== 0) {
            return this.newlines[this.newlines.length - 1];
        }

        return this.separator;
    }
}
