import { ParseContextElementArray } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { CatchKeywordToken, EndKeywordToken, TryKeywordToken } from '../../Token/Token';
import { MissableDataDeclaration } from '../Declaration/DataDeclaration';
import { NodeKind } from '../NodeKind';
import { Statement } from './Statement';

export class TryStatement extends Statement {
    static CHILD_NAMES: (keyof TryStatement)[] = [
        'tryKeyword',
        'statements',
        'catchStatements',
        'endKeyword',
        'endTryKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.TryStatement;

    tryKeyword: TryKeywordToken;
    statements: ParseContextElementArray<TryStatement['kind']>;
    catchStatements: CatchStatement[] | null = null;
    endKeyword: MissableToken<EndKeywordToken>;
    endTryKeyword: TryKeywordToken | null = null;
}

export class CatchStatement extends Statement {
    static CHILD_NAMES: (keyof CatchStatement)[] = [
        'catchKeyword',
        'parameter',
        'statements',
    ];

    readonly kind = NodeKind.CatchStatement;

    catchKeyword: CatchKeywordToken;
    parameter: MissableDataDeclaration;
    statements: ParseContextElementArray<CatchStatement['kind']>;
}
