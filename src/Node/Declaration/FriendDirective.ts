import { FriendKeywordToken } from '../../Token/Token';
import { ModulePath } from '../ModulePath';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class FriendDirective extends Declaration {
    static CHILD_NAMES: (keyof FriendDirective)[] = [
        'friendKeyword',
        'modulePath',
    ];

    readonly kind = NodeKind.FriendDirective;

    friendKeyword: FriendKeywordToken;
    modulePath: ModulePath;
}
