import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { AbstractKeywordToken, ClassKeywordToken, EndKeywordToken, ExtendsKeywordToken, FinalKeywordToken, GreaterThanSignToken, IdentifierToken, ImplementsKeywordToken, LessThanSignToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { MissableTypeReference } from '../TypeReference';
import { Declaration } from './Declaration';

export class ClassDeclaration extends Declaration {
    static CHILD_NAMES: (keyof ClassDeclaration)[] = [
        'classKeyword',
        'name',
        'lessThanSign',
        'typeParameters',
        'greaterThanSign',
        'extendsKeyword',
        'baseType',
        'implementsKeyword',
        'implementedTypes',
        'attribute',
        'members',
        'endKeyword',
        'endClassKeyword',
    ];

    readonly kind = NodeKind.ClassDeclaration;

    classKeyword: ClassKeywordToken;
    name: MissableToken<IdentifierToken>;

    // Generic
    lessThanSign: LessThanSignToken | null = null;
    typeParameters: ParseContextElementArray<ParseContextKind.TypeParameterSequence> | null = null;
    greaterThanSign: MissableToken<GreaterThanSignToken> | null = null;

    // Extends
    extendsKeyword: ExtendsKeywordToken | null = null;
    baseType: MissableTypeReference | null = null;

    // Implements
    implementsKeyword: ImplementsKeywordToken | null = null;
    implementedTypes: ParseContextElementArray<ParseContextKind.TypeReferenceSequence> | null = null;

    attribute: AbstractKeywordToken | FinalKeywordToken | null = null;

    members: ParseContextElementArray<ClassDeclaration['kind']>;
    endKeyword: MissableToken<EndKeywordToken>;
    endClassKeyword: ClassKeywordToken | null = null;
}
