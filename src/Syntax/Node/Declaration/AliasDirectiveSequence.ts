import { MissableToken } from '../../Token/MissingToken';
import { AliasKeywordToken, EqualsSignToken, FloatKeywordToken, IntKeywordToken, PeriodToken, StringKeywordToken } from '../../Token/Tokens';
import { CommaSeparator } from '../CommaSeparator';
import { Identifier } from '../Identifier';
import { NodeKind } from '../Nodes';
import { Declaration } from './Declarations';

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
    'children',
];

export class AliasDirective extends Declaration {
    readonly kind = NodeKind.AliasDirective;

    identifier: Identifier = undefined!;
    equalsSign: MissableToken<EqualsSignToken> = undefined!;
    children: (DeclarationReferenceIdentifier | PeriodToken)[] = undefined!;
}

// NOTE: Does not include `Void`, `Bool`, or `Array`.
type DeclarationReferenceIdentifier =
    | Identifier
    | IntKeywordToken
    | FloatKeywordToken
    | StringKeywordToken
    ;

// #endregion
