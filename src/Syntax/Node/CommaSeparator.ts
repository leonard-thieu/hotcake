import { ParseContextElementSequence, ParseContextKind } from '../ParserBase';
import { CommaToken } from '../Token/Token';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class CommaSeparator extends Node {
    readonly kind = NodeKind.CommaSeparator;

    separator: CommaToken = undefined!;
    newlines: ParseContextElementSequence<ParseContextKind.NewlineList> = undefined!;
}
