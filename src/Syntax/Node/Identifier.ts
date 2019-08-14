import { MissingToken } from '../Token/MissingToken';
import { AbstractKeywordToken, AliasKeywordToken, AndKeywordToken, ArrayKeywordToken, BoolKeywordToken, CaseKeywordToken, CatchKeywordToken, ClassKeywordToken, CommercialAtToken, ConstKeywordToken, ContinueKeywordToken, DefaultKeywordToken, EachInKeywordToken, ElseIfKeywordToken, ElseKeywordToken, EndIfKeywordToken, EndKeywordToken, ExitKeywordToken, ExtendsKeywordToken, ExternKeywordToken, FalseKeywordToken, FieldKeywordToken, FinalKeywordToken, FloatKeywordToken, ForeverKeywordToken, ForKeywordToken, FriendKeywordToken, FunctionKeywordToken, GlobalKeywordToken, IdentifierToken, IfKeywordToken, ImplementsKeywordToken, ImportKeywordToken, IncludeKeywordToken, InlineKeywordToken, InterfaceKeywordToken, IntKeywordToken, LocalKeywordToken, MethodKeywordToken, ModKeywordToken, ModuleKeywordToken, NewKeywordToken, NextKeywordToken, NotKeywordToken, NullKeywordToken, ObjectKeywordToken, OrKeywordToken, PrivateKeywordToken, PropertyKeywordToken, ProtectedKeywordToken, PublicKeywordToken, RepeatKeywordToken, ReturnKeywordToken, SelectKeywordToken, SelfKeywordToken, ShlKeywordToken, ShrKeywordToken, StepKeywordToken, StrictKeywordToken, StringKeywordToken, SuperKeywordToken, ThenKeywordToken, ThrowableKeywordToken, ThrowKeywordToken, ToKeywordToken, TrueKeywordToken, TryKeywordToken, UntilKeywordToken, VoidKeywordToken, WendKeywordToken, WhileKeywordToken } from '../Token/Tokens';
import { Node, NodeKind } from './Nodes';

// #region Escaped identifier

export const EscapedIdentifierChildNames: ReadonlyArray<keyof EscapedIdentifier> = [
    'commercialAt',
    'name',
];

export class EscapedIdentifier extends Node {
    readonly kind = NodeKind.EscapedIdentifier;

    commercialAt: CommercialAtToken = undefined!;
    name: IdentifierTokens | MissingToken = undefined!;
}

// #endregion

export type Identifier =
    | EscapedIdentifier
    | EscapeOptionalIdentifierToken
    ;

export type IdentifierStartToken =
    | EscapeOptionalIdentifierToken
    | CommercialAtToken
    ;

export type IdentifierTokens =
    | EscapeOptionalIdentifierToken
    | EscapeRequiredIdentifierToken
    ;

export type EscapeOptionalIdentifierToken =
    | IdentifierToken
    | ObjectKeywordToken
    | ThrowableKeywordToken
    ;

type EscapeRequiredIdentifierToken =
    | VoidKeywordToken
    | StrictKeywordToken
    | PublicKeywordToken
    | PrivateKeywordToken
    | ProtectedKeywordToken
    | FriendKeywordToken
    | PropertyKeywordToken
    | BoolKeywordToken
    | IntKeywordToken
    | FloatKeywordToken
    | StringKeywordToken
    | ArrayKeywordToken
    | ModKeywordToken
    | ContinueKeywordToken
    | ExitKeywordToken
    | IncludeKeywordToken
    | ImportKeywordToken
    | ModuleKeywordToken
    | ExternKeywordToken
    | NewKeywordToken
    | SelfKeywordToken
    | SuperKeywordToken
    | EachInKeywordToken
    | TrueKeywordToken
    | FalseKeywordToken
    | NullKeywordToken
    | NotKeywordToken
    | ExtendsKeywordToken
    | AbstractKeywordToken
    | FinalKeywordToken
    | SelectKeywordToken
    | CaseKeywordToken
    | DefaultKeywordToken
    | ConstKeywordToken
    | LocalKeywordToken
    | GlobalKeywordToken
    | FieldKeywordToken
    | MethodKeywordToken
    | FunctionKeywordToken
    | ClassKeywordToken
    | AndKeywordToken
    | OrKeywordToken
    | ShlKeywordToken
    | ShrKeywordToken
    | EndKeywordToken
    | IfKeywordToken
    | ThenKeywordToken
    | ElseKeywordToken
    | ElseIfKeywordToken
    | EndIfKeywordToken
    | WhileKeywordToken
    | WendKeywordToken
    | RepeatKeywordToken
    | UntilKeywordToken
    | ForeverKeywordToken
    | ForKeywordToken
    | ToKeywordToken
    | StepKeywordToken
    | NextKeywordToken
    | ReturnKeywordToken
    | InterfaceKeywordToken
    | ImplementsKeywordToken
    | InlineKeywordToken
    | AliasKeywordToken
    | TryKeywordToken
    | CatchKeywordToken
    | ThrowKeywordToken
    ;
