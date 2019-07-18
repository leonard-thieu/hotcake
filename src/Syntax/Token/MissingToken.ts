import { NodeKind } from '../Node/NodeKind';
import { ParseContextElementSequence, ParseContextKind } from '../ParserBase';
import { Token, TokenKinds, TokenKindTokenMap, Tokens } from './Token';
import { TokenKind } from './TokenKind';

export class MissingToken extends Token<TokenKind.Missing> {
    constructor(
        fullStart: number,
        readonly originalKind: MissingTokenKinds,
    ) {
        super(
            TokenKind.Missing,
            fullStart,
            fullStart,
            0,
        );
    }

    newlines: ParseContextElementSequence<ParseContextKind.NewlineList> = undefined!;
}

export type MissingTokenKinds =
    | TokenKinds
    | TokenKind.Expression
    | TokenKind.ForLoopHeader
    | TokenKind.ImportStatementPath
    | NodeKind.DataDeclaration
    | NodeKind.StringLiteralExpression
    | NodeKind.TypeReference
    ;

export type MissableToken<TToken extends Tokens> =
    | TokenKindTokenMap[TToken['kind']]
    | MissingToken
    ;
