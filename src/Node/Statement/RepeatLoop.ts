import { ParseContextElementArray } from '../../ParserBase';
import { MissingToken } from '../../Token/MissingToken';
import { Token } from '../../Token/Token';
import { Expression } from '../Expression/Expression';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class RepeatLoop extends Statement {
    static CHILD_NAMES: (keyof RepeatLoop)[] = [
        'repeatKeyword',
        'statements',
        'foreverOrUntilKeyword',
        'untilExpression',
        'terminator',
    ];

    readonly kind = NodeKind.RepeatLoop;

    repeatKeyword: Token;
    statements: ParseContextElementArray<RepeatLoop['kind']>;
    foreverOrUntilKeyword: Token;
    untilExpression: Expression | MissingToken | null = null;
}
