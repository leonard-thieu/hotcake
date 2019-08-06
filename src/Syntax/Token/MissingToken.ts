import { NodeKind } from '../Node/Nodes';
import { NewlineToken, Token, TokenKind, TokenKindToTokenMap, Tokens } from './Tokens';

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
    | TokenKind
    | TokenKind.Expression
    | TokenKind.ImportStatementPath
    | NodeKind.DataDeclaration
    | NodeKind.StringLiteralExpression
    | NodeKind.TypeReference
    ;

export type MissableToken<TToken extends Tokens> =
    | TokenKindToTokenMap[TToken['kind']]
    | MissingToken
    ;
