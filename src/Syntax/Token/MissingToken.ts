import { NodeKind } from '../Node/NodeKind';
import { NewlineToken, Token, TokenKinds, TokenKindTokenMap, Tokens } from './Token';
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
            /*length*/ 0,
        );
    }

    newlines: NewlineToken[] = undefined!;
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
