import { NodeKind } from '../Node/NodeKind';
import { ParseContextElementArray, ParseContextKind } from '../ParserBase';
import { Token, TokenKinds, TokenKindTokenMap, Tokens } from './Token';
import { TokenKind } from './TokenKind';

export class MissingToken<TTokenKind extends MissableTokenKinds> extends Token<TokenKind.Missing> {
    constructor(fullStart: number, public originalKind: TTokenKind) {
        super(TokenKind.Missing, fullStart, fullStart, 0);
    }

    newlines: ParseContextElementArray<ParseContextKind.NewlineList>;
}

export type MissableTokenKinds =
    TokenKinds |
    TokenKind.Expression |
    TokenKind.ForLoopHeader |
    NodeKind.DataDeclaration |
    NodeKind.ModulePath |
    NodeKind.StringLiteral |
    NodeKind.TypeReference
    ;

export type MissableToken<TToken extends Tokens> =
    TokenKindTokenMap[TToken['kind']] |
    MissingToken<TToken['kind']>
    ;
