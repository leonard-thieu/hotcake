import { ParseContextElementArray } from '../../ParserBase';
import { CatchKeywordToken, EndKeywordToken, TryKeywordToken } from '../../Token/Token';
import { DataDeclaration } from '../DataDeclaration';
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
    endKeyword: EndKeywordToken;
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
    parameter: DataDeclaration;
    statements: ParseContextElementArray<CatchStatement['kind']>;
}
