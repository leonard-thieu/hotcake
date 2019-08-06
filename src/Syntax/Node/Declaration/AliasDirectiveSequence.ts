import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { AliasKeywordToken, EqualsSignToken, FloatKeywordToken, IdentifierToken, IntKeywordToken, PeriodToken, StringKeywordToken } from '../../Token/Tokens';
import { CommaSeparator } from '../CommaSeparator';
import { EscapedIdentifier, Identifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

// #region Alias directive sequence

export const AliasDirectiveSequenceChildNames: ReadonlyArray<keyof AliasDirectiveSequence> = [
    'aliasKeyword',
    'children',
];

export class AliasDirectiveSequence extends Declaration {
    readonly kind = NodeKind.AliasDirectiveSequence;

    aliasKeyword: AliasKeywordToken = undefined!;
    children: (AliasDirective | CommaSeparator)[] = undefined!;
}

// #endregion

// #region Alias directive

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

    target: DeclarationReferenceIdentifier | MissingToken = undefined!;
}

// NOTE: Does not include BoolKeywordToken.
type DeclarationReferenceIdentifier =
    | Identifier
    | IntKeywordToken
    | FloatKeywordToken
    | StringKeywordToken
    ;

// #endregion
