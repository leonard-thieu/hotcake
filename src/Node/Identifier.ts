import { MissableToken, MissingToken } from '../Token/MissingToken';
import { AbstractKeywordToken, AliasKeywordToken, AndKeywordToken, ArrayKeywordToken, BoolKeywordToken, CaseKeywordToken, CatchKeywordToken, ClassKeywordToken, CommercialAtToken, ConstKeywordToken, ContinueKeywordToken, DefaultKeywordToken, EachInKeywordToken, ElseIfKeywordToken, ElseKeywordToken, EndIfKeywordToken, EndKeywordToken, ExitKeywordToken, ExtendsKeywordToken, ExternKeywordToken, FalseKeywordToken, FieldKeywordToken, FinalKeywordToken, FloatKeywordToken, ForeverKeywordToken, ForKeywordToken, FriendKeywordToken, FunctionKeywordToken, GlobalKeywordToken, IdentifierToken, IfKeywordToken, ImplementsKeywordToken, ImportKeywordToken, IncludeKeywordToken, InlineKeywordToken, InterfaceKeywordToken, IntKeywordToken, LocalKeywordToken, MethodKeywordToken, ModKeywordToken, ModuleKeywordToken, NewKeywordToken, NextKeywordToken, NotKeywordToken, NullKeywordToken, ObjectKeywordToken, OrKeywordToken, PrivateKeywordToken, PropertyKeywordToken, ProtectedKeywordToken, PublicKeywordToken, RepeatKeywordToken, ReturnKeywordToken, SelectKeywordToken, SelfKeywordToken, ShlKeywordToken, ShrKeywordToken, StepKeywordToken, StrictKeywordToken, StringKeywordToken, SuperKeywordToken, ThenKeywordToken, ThrowableKeywordToken, ThrowKeywordToken, ToKeywordToken, TrueKeywordToken, TryKeywordToken, UntilKeywordToken, VoidKeywordToken, WendKeywordToken, WhileKeywordToken } from '../Token/Token';
import { TokenKind } from '../Token/TokenKind';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export type Identifier =
    EscapedIdentifier |
    EscapeOptionalIdentifierNameToken
    ;

export type MissableIdentifier = Identifier | MissingToken<TokenKind.Identifier>;

export type IdentifierStartToken =
    EscapeOptionalIdentifierNameToken |
    CommercialAtToken
    ;

export class EscapedIdentifier extends Node {
    static CHILD_NAMES: (keyof EscapedIdentifier)[] = [
        'commercialAt',
        'name',
    ];

    readonly kind = NodeKind.EscapedIdentifier;

    commercialAt: CommercialAtToken;
    name: MissableToken<EscapedIdentifierNameToken>;

    get fullStart() {
        return this.commercialAt.fullStart;
    }
}

export type EscapedIdentifierNameToken =
    EscapeOptionalIdentifierNameToken |
    EscapeRequiredIdentifierNameToken
    ;

export type EscapeOptionalIdentifierNameToken =
    IdentifierToken |
    ObjectKeywordToken |
    ThrowableKeywordToken
    ;

export type EscapeRequiredIdentifierNameToken =
    VoidKeywordToken |
    StrictKeywordToken |
    PublicKeywordToken |
    PrivateKeywordToken |
    ProtectedKeywordToken |
    FriendKeywordToken |
    PropertyKeywordToken |
    BoolKeywordToken |
    IntKeywordToken |
    FloatKeywordToken |
    StringKeywordToken |
    ArrayKeywordToken |
    ModKeywordToken |
    ContinueKeywordToken |
    ExitKeywordToken |
    IncludeKeywordToken |
    ImportKeywordToken |
    ModuleKeywordToken |
    ExternKeywordToken |
    NewKeywordToken |
    SelfKeywordToken |
    SuperKeywordToken |
    EachInKeywordToken |
    TrueKeywordToken |
    FalseKeywordToken |
    NullKeywordToken |
    NotKeywordToken |
    ExtendsKeywordToken |
    AbstractKeywordToken |
    FinalKeywordToken |
    SelectKeywordToken |
    CaseKeywordToken |
    DefaultKeywordToken |
    ConstKeywordToken |
    LocalKeywordToken |
    GlobalKeywordToken |
    FieldKeywordToken |
    MethodKeywordToken |
    FunctionKeywordToken |
    ClassKeywordToken |
    AndKeywordToken |
    OrKeywordToken |
    ShlKeywordToken |
    ShrKeywordToken |
    EndKeywordToken |
    IfKeywordToken |
    ThenKeywordToken |
    ElseKeywordToken |
    ElseIfKeywordToken |
    EndIfKeywordToken |
    WhileKeywordToken |
    WendKeywordToken |
    RepeatKeywordToken |
    UntilKeywordToken |
    ForeverKeywordToken |
    ForKeywordToken |
    ToKeywordToken |
    StepKeywordToken |
    NextKeywordToken |
    ReturnKeywordToken |
    InterfaceKeywordToken |
    ImplementsKeywordToken |
    InlineKeywordToken |
    AliasKeywordToken |
    TryKeywordToken |
    CatchKeywordToken |
    ThrowKeywordToken
    ;
