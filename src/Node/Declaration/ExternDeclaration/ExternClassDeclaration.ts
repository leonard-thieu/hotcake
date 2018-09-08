import { ParseContextElementArray } from '../../../ParserBase';
import { MissableToken } from '../../../Token/MissingToken';
import { AbstractKeywordToken, ArrayKeywordToken, ClassKeywordToken, CommercialAtToken, EndKeywordToken, ExtendsKeywordToken, FinalKeywordToken, IdentifierToken, NullKeywordToken, ObjectKeywordToken, StringKeywordToken, ThrowableKeywordToken } from '../../../Token/Token';
import { NodeKind } from '../../NodeKind';
import { MissableTypeReference } from '../../TypeReference';
import { ExternDeclaration } from './ExternDeclaration';

export class ExternClassDeclaration extends ExternDeclaration {
    static CHILD_NAMES: (keyof ExternClassDeclaration)[] = [
        'classKeyword',
        'commercialAt',
        'name',
        'extendsKeyword',
        'baseType',
        'attribute',
        'equalsSign',
        'nativeSymbol',
        'members',
        'endKeyword',
        'endClassKeyword',
    ];

    readonly kind = NodeKind.ExternClassDeclaration;

    classKeyword: ClassKeywordToken;
    commercialAt: CommercialAtToken | null;
    name: MissableToken<ExternClassDeclarationNameToken>;

    // Extends
    extendsKeyword: ExtendsKeywordToken | null = null;
    baseType: MissableTypeReference | NullKeywordToken | null = null;

    attribute: AbstractKeywordToken | FinalKeywordToken | null = null;

    members: ParseContextElementArray<ExternClassDeclaration['kind']>;
    endKeyword: MissableToken<EndKeywordToken>;
    endClassKeyword: ClassKeywordToken | null = null;
}

export type ExternClassDeclarationNameToken =
    StringKeywordToken |
    ArrayKeywordToken |
    ObjectKeywordToken |
    ThrowableKeywordToken |
    IdentifierToken
    ;
