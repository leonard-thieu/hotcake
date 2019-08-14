import { NewlineToken, Token, TokenKind } from './Tokens';

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
    | MissingTokenKind
    ;

export enum MissingTokenKind {
    Expression = 'Expression',
    ImportStatementPath = 'ImportStatementPath',
    DataDeclaration = 'DataDeclaration',
    StringLiteralExpression = 'StringLiteralExpression',
    TypeReference = 'TypeReference',
}
