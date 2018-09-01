import { ParseContextElementArray } from '../../ParserBase';
import { MissingToken } from '../../Token/MissingToken';
import { Token } from '../../Token/Token';
import { BinaryExpression } from '../Expression/BinaryExpression';
import { Expression } from '../Expression/Expression';
import { Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { LocalDeclarationListStatement } from './LocalDeclarationListStatement';
import { Statement } from './Statement';

export class ForLoop extends Statement {
    static CHILD_NAMES: (keyof ForLoop)[] = [
        'forKeyword',
        'header',
        'statements',
        'endKeyword',
        'endForKeyword',
        'terminator',
    ];

    readonly kind = NodeKind.ForLoop;

    forKeyword: Token;
    header: NumericForLoopHeader | LocalDeclarationListStatement | BinaryExpression;
    statements: ParseContextElementArray<ForLoop['kind']>;
    endKeyword: Token;
    endForKeyword: Token | null = null;
}

export class NumericForLoopHeader extends Node {
    static CHILD_NAMES: (keyof NumericForLoopHeader)[] = [
        'loopVariableExpression',
        'toOrUntilKeyword',
        'lastValueExpression',
        'stepKeyword',
        'stepValueExpression',
    ];

    readonly kind = NodeKind.NumericForLoopHeader;

    loopVariableExpression: LocalDeclarationListStatement | BinaryExpression;
    toOrUntilKeyword: Token;
    lastValueExpression: Expression | MissingToken;
    stepKeyword: Token | null = null;
    stepValueExpression: Expression | MissingToken | null = null;
}
