import { ParseContextElementDelimitedSequence } from '../../../ParserBase';
import { FieldKeywordToken, GlobalKeywordToken } from '../../../Token/Token';
import { Identifier } from '../../Identifier';
import { isNode } from '../../Node';
import { NodeKind } from '../../NodeKind';
import { Declaration } from '../Declaration';
import { TypeDeclaration } from '../TypeDeclaration';
import { ExternDeclaration } from './ExternDeclaration';

export class ExternDataDeclarationSequence extends Declaration {
    static CHILD_NAMES: (keyof ExternDataDeclarationSequence)[] = [
        'dataDeclarationKeyword',
        'children',
    ];

    readonly kind = NodeKind.ExternDataDeclarationSequence;

    dataDeclarationKeyword: ExternDataDeclarationKeywordToken = undefined!;
    children: ParseContextElementDelimitedSequence<ExternDataDeclarationSequence['kind']> = undefined!;

    get firstToken() {
        return this.dataDeclarationKeyword;
    }

    get lastToken() {
        // TODO: `parseList` should guarantee a data declaration.
        if (this.children.length !== 0) {
            return this.children[this.children.length - 1].lastToken;
        }

        return this.dataDeclarationKeyword;
    }
}

export type ExternDataDeclarationKeywordToken =
    GlobalKeywordToken |
    FieldKeywordToken
    ;

export class ExternDataDeclaration extends ExternDeclaration {
    static CHILD_NAMES: (keyof ExternDataDeclaration)[] = [
        'identifier',
        'type',
        'equalsSign',
        'nativeSymbol',
    ];

    readonly kind = NodeKind.ExternDataDeclaration;

    identifier: Identifier = undefined!;
    type?: TypeDeclaration = undefined;

    get firstToken() {
        if (isNode(this.identifier)) {
            return this.identifier.firstToken;
        }

        return this.identifier;
    }

    get lastToken() {
        if (this.nativeSymbol) {
            if (isNode(this.nativeSymbol)) {
                return this.nativeSymbol.lastToken;
            }

            return this.nativeSymbol;
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
