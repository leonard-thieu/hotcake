import { FriendKeywordToken } from '../../Token/Token';
import { ModulePath } from '../ModulePath';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class FriendDirective extends Declaration {
    readonly kind = NodeKind.FriendDirective;

    friendKeyword: FriendKeywordToken = undefined!;
    modulePath: ModulePath = undefined!;
}
