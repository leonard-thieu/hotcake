import { ParseContextElementDelimitedSequence, ParseContextKind } from '../../ParserBase';
import { FriendKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class FriendDirective extends Declaration {
    static CHILD_NAMES: (keyof FriendDirective)[] = [
        'friendKeyword',
        'modulePath',
    ];

    readonly kind = NodeKind.FriendDirective;

    friendKeyword: FriendKeywordToken = undefined!;
    modulePath: ParseContextElementDelimitedSequence<ParseContextKind.ModulePathSequence> = undefined!;
}
