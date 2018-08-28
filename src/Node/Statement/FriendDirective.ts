import { Token } from "../../Token";
import { ModulePath } from "../ModulePath";
import { NodeKind } from "../NodeKind";
import { Statement } from "./Statement";

export class FriendDirective extends Statement {
    static CHILD_NAMES: (keyof FriendDirective)[] = [
        'friendKeyword',
        'modulePath',
    ];

    readonly kind = NodeKind.FriendDirective;

    friendKeyword: Token;
    modulePath: ModulePath;
}
