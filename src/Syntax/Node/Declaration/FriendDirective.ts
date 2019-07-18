import { FriendKeywordToken } from '../../Token/Token';
import { ModulePath } from '../ModulePath';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export const FriendDirectiveChildNames: ReadonlyArray<keyof FriendDirective> = [
    'friendKeyword',
    'modulePath',
];

export class FriendDirective extends Declaration {
    readonly kind = NodeKind.FriendDirective;

    friendKeyword: FriendKeywordToken = undefined!;
    modulePath: ModulePath = undefined!;
}
