import { NewlineToken, Token, TokenKinds, TokenKindTokenMap, Tokens } from './Token';
import { TokenKind } from './TokenKind';
import { NodeKind } from '../Node/NodeKind';

export class MissingToken<TTokenKind extends MissableTokenKinds> extends Token<TokenKind.Missing> {
    constructor(fullStart: number, public originalKind: TTokenKind) {
        super(TokenKind.Missing, fullStart, fullStart, 0);
    }

    newlines: NewlineToken[] | null = null;
}

export type MissableTokenKinds =
    TokenKinds |
    TokenKind.Expression |
    NodeKind.DataDeclaration |
    NodeKind.TypeReference
    ;

export type MissableToken<TToken extends Tokens> =
    TokenKindTokenMap[TToken['kind']] |
    MissingToken<TToken['kind']>
    ;
