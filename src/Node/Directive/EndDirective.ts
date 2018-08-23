import { Token } from "../../Token";
import { Directive } from "./Directive";

export class EndDirective extends Directive {
    static CHILD_NAMES: (keyof EndDirective)[] = [
        'numberSign',
        'endDirectiveKeyword',
    ];

    endDirectiveKeyword: Token | null = null;
}
