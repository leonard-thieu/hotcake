import { ParseContextElementDelimitedSequence } from '../../ParserBase';
import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { AliasKeywordToken, EqualsSignToken, FloatKeywordToken, IdentifierToken, IntKeywordToken, PeriodToken, StringKeywordToken } from '../../Token/Token';
import { TokenKind } from '../../Token/TokenKind';
import { EscapedIdentifier, Identifier } from '../Identifier';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class AliasDirectiveSequence extends Declaration {
    static CHILD_NAMES: (keyof AliasDirectiveSequence)[] = [
        'aliasKeyword',
        'children',
    ];

    readonly kind = NodeKind.AliasDirectiveSequence;

    aliasKeyword: AliasKeywordToken = undefined!;
    children: ParseContextElementDelimitedSequence<AliasDirectiveSequence['kind']> = undefined!;

    get firstToken() {
        return this.aliasKeyword;
    }

    get lastToken() {
        if (this.children.length !== 0) {
            return this.children[this.children.length - 1].lastToken;
        }

        return this.aliasKeyword;
    }
}

export class AliasDirective extends Declaration {
    static CHILD_NAMES: (keyof AliasDirective)[] = [
        'identifier',
        'equalsSign',
        'moduleIdentifier',
        'moduleScopeMemberAccessOperator',
        'typeIdentifier',
        'typeScopeMemberAccessOperator',
        'target',
    ];

    readonly kind = NodeKind.AliasDirective;

    identifier: Identifier = undefined!;
    equalsSign: MissableToken<EqualsSignToken> = undefined!;

    moduleIdentifier?: IdentifierToken = undefined;
    moduleScopeMemberAccessOperator?: MissableToken<PeriodToken> = undefined;

    typeIdentifier?: EscapedIdentifier | IdentifierToken = undefined;
    typeScopeMemberAccessOperator?: PeriodToken = undefined;

    target: MissableDeclarationReferenceIdentifier = undefined!;

    get firstToken() {
        if (isNode(this.identifier)) {
            return this.identifier.firstToken;
        }

        return this.identifier;
    }

    get lastToken() {
        if (isNode(this.target)) {
            return this.target.lastToken;
        }

        return this.target;
    }
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
