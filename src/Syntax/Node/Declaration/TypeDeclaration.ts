import { ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { ColonToken, DollarSignToken, NumberSignToken, PercentSignToken, QuestionMarkToken } from '../../Token/Token';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { MissableTypeReference } from '../TypeReference';
import { Declaration } from './Declaration';

// TODO: Shouldn't these be end with `Reference` instead of `Declaration`?

export type TypeDeclaration =
    ShorthandTypeDeclaration |
    LonghandTypeDeclaration
    ;

export class ShorthandTypeDeclaration extends Declaration {
    static CHILD_NAMES: (keyof ShorthandTypeDeclaration)[] = [
        'shorthandType',
        'arrayTypeDeclarations',
    ];

    readonly kind = NodeKind.ShorthandTypeDeclaration;

    shorthandType?: ShorthandTypeToken = undefined;
    arrayTypeDeclarations: ParseContextElementSequence<ParseContextKind.ArrayTypeDeclarationList> = undefined!;

    get firstToken() {
        if (this.shorthandType) {
            return this.shorthandType;
        }

        return this.arrayTypeDeclarations[0].firstToken;
    }

    get lastToken() {
        if (this.arrayTypeDeclarations.length !== 0) {
            return this.arrayTypeDeclarations[this.arrayTypeDeclarations.length - 1].lastToken;
        }

        return this.shorthandType!;
    }
}

export type ShorthandTypeToken =
    QuestionMarkToken |
    PercentSignToken |
    NumberSignToken |
    DollarSignToken
    ;

export class LonghandTypeDeclaration extends Declaration {
    static CHILD_NAMES: (keyof LonghandTypeDeclaration)[] = [
        'colon',
        'typeReference',
    ];

    readonly kind = NodeKind.LonghandTypeDeclaration;

    colon: ColonToken = undefined!;
    typeReference: MissableTypeReference = undefined!;

    get firstToken() {
        return this.colon;
    }

    get lastToken() {
        if (isNode(this.typeReference)) {
            return this.typeReference.lastToken;
        }

        return this.typeReference;
    }
}
