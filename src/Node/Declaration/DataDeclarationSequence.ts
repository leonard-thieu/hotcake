import { ParseContextElementDelimitedSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken, MissingToken } from '../../Token/MissingToken';
import { ColonEqualsSignToken, ConstKeywordToken, EachInKeywordToken, EqualsSignToken, FieldKeywordToken, GlobalKeywordToken, LocalKeywordToken } from '../../Token/Token';
import { MissableExpression } from '../Expression/Expression';
import { Identifier } from '../Identifier';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';
import { TypeDeclaration } from './TypeDeclaration';

export class DataDeclarationSequence extends Declaration {
    static CHILD_NAMES: (keyof DataDeclarationSequence)[] = [
        'dataDeclarationKeyword',
        'children',
    ];

    readonly kind = NodeKind.DataDeclarationSequence;

    dataDeclarationKeyword: DataDeclarationKeywordToken = undefined!;
    children: ParseContextElementDelimitedSequence<ParseContextKind.DataDeclarationSequence> = undefined!;

    get firstToken() {
        return this.dataDeclarationKeyword;
    }

    get lastToken() {
        if (this.children.length !== 0) {
            return this.children[this.children.length - 1].lastToken;
        }

        return this.dataDeclarationKeyword;
    }
}

export type DataDeclarationKeywordToken =
    ConstKeywordToken |
    GlobalKeywordToken |
    FieldKeywordToken |
    LocalKeywordToken
    ;

/**
 * Explicit type (shorthand)
 *   Identifier(?|%|#|$) = Expression
 *   Identifier(?|%|#|$)
 * 
 * Explicit type (longhand)
 *   Identifier: Type = Expression
 *   Identifier: Type
 * 
 * Inferred type
 *   Identifier := Expression
 * 
 * Default type
 *   Identifier = Expression
 *   Identifier
 */
export class DataDeclaration extends Declaration {
    static CHILD_NAMES: (keyof DataDeclaration)[] = [
        'identifier',
        'type',
        'equalsSign',
        'eachInKeyword',
        'expression',
    ];

    readonly kind = NodeKind.DataDeclaration;

    identifier: Identifier = undefined!;
    type?: TypeDeclaration = undefined;
    equalsSign?: MissableToken<EqualsSignToken | ColonEqualsSignToken> = undefined;
    eachInKeyword?: EachInKeywordToken = undefined;
    expression?: MissableExpression = undefined;

    get firstToken() {
        if (isNode(this.identifier)) {
            return this.identifier.firstToken;
        }

        return this.identifier;
    }

    get lastToken() {
        if (this.expression) {
            if (isNode(this.expression)) {
                return this.expression.lastToken;
            }

            return this.expression;
        }

        if (this.type) {
            return this.type.lastToken;
        }

        if (isNode(this.identifier)) {
            return this.identifier.lastToken;
        }

        return this.identifier;
    }
}

export type MissableDataDeclaration = DataDeclaration | MissingToken<DataDeclaration['kind']>;
