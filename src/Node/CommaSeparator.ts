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

    separator: CommaToken;
    newlines: ParseContextElementSequence<ParseContextKind.NewlineList>;
}
