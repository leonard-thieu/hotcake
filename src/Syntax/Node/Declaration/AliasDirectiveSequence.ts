import { ParseContextElementDelimitedSequence } from '../../ParserBase';
import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { AliasKeywordToken, EqualsSignToken, FloatKeywordToken, IdentifierToken, IntKeywordToken, PeriodToken, StringKeywordToken } from '../../Token/Token';
import { TokenKind } from '../../Token/TokenKind';
import { EscapedIdentifier, Identifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export const AliasDirectiveSequenceChildNames: ReadonlyArray<keyof AliasDirectiveSequence> = [
    'aliasKeyword',
    'children',
];

export class AliasDirectiveSequence extends Declaration {
    readonly kind = NodeKind.AliasDirectiveSequence;

    aliasKeyword: AliasKeywordToken = undefined!;
    children: ParseContextElementDelimitedSequence<AliasDirectiveSequence['kind']> = undefined!;
}

export const AliasDirectiveChildNames: ReadonlyArray<keyof AliasDirective> = [
    'identifier',
    'equalsSign',
    'moduleIdentifier',
    'moduleScopeMemberAccessOperator',
    'typeIdentifier',
    'typeScopeMemberAccessOperator',
    'target',
];

export class AliasDirective extends Declaration {
    readonly kind = NodeKind.AliasDirective;

    identifier: Identifier = undefined!;
    equalsSign: MissableToken<EqualsSignToken> = undefined!;

    moduleIdentifier?: IdentifierToken = undefined;
    moduleScopeMemberAccessOperator?: MissableToken<PeriodToken> = undefined;

    typeIdentifier?: EscapedIdentifier | IdentifierToken = undefined;
    typeScopeMemberAccessOperator?: PeriodToken = undefined;

    target: MissableDeclarationReferenceIdentifier = undefined!;
}

// NOTE: Does not include BoolKeywordToken.
export type DeclarationReferenceIdentifier =
    | Identifier
    | IntKeywordToken
    | FloatKeywordToken
    | StringKeywordToken
    ;

export type MissableDeclarationReferenceIdentifier =
    | DeclarationReferenceIdentifier
    | MissingToken<TokenKind.Identifier>
    ;
