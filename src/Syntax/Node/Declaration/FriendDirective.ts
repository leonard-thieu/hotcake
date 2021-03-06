import { FriendKeywordToken } from '../../Token/Tokens';
import { ModulePath } from '../ModulePath';
import { NodeKind } from '../Nodes';
import { Declaration } from './Declarations';

export const FriendDirectiveChildNames: ReadonlyArray<keyof FriendDirective> = [
    'friendKeyword',
    'modulePath',
];

export class FriendDirective extends Declaration {
    readonly kind = NodeKind.FriendDirective;

    friendKeyword: FriendKeywordToken = undefined!;
    modulePath: ModulePath = undefined!;
}
