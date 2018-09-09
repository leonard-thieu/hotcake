import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { ColonToken, DollarSignToken, NumberSignToken, PercentSignToken, QuestionMarkToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { MissableTypeReference } from '../TypeReference';
import { Declaration } from './Declaration';

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

    shorthandType: ShorthandTypeToken | null = null;
    arrayTypeDeclarations: ParseContextElementArray<ParseContextKind.ArrayTypeDeclarationList>;
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

    colon: ColonToken;
    typeReference: MissableTypeReference;
}
