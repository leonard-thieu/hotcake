import { Token } from "../Token";
import { DirectiveNode } from "./DirectiveNode";

export class EndDirectiveNode extends DirectiveNode {
    static CHILD_NAMES: (keyof EndDirectiveNode)[] = [
        'numberSign',
        'endDirectiveKeyword',
    ];

    endDirectiveKeyword: Token | null = null;
}
