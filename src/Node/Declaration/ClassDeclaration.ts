import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { AbstractKeywordToken, ClassKeywordToken, EndKeywordToken, ExtendsKeywordToken, FinalKeywordToken, GreaterThanSignToken, IdentifierToken, ImplementsKeywordToken, LessThanSignToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { TypeReference } from '../TypeReference';
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
        'attributes',
        'members',
        'endKeyword',
        'endClassKeyword',
    ];

    readonly kind = NodeKind.ClassDeclaration;

    classKeyword: ClassKeywordToken;
    name: IdentifierToken;

    // Generic
    lessThanSign: LessThanSignToken | null = null;
    typeParameters: ParseContextElementArray<ParseContextKind.TypeParameterSequence> | null = null;
    greaterThanSign: GreaterThanSignToken | null = null;

    // Extends
    extendsKeyword: ExtendsKeywordToken | null = null;
    baseType: TypeReference | null = null;

    // Implements
    implementsKeyword: ImplementsKeywordToken | null = null;
    implementedTypes: ParseContextElementArray<ParseContextKind.TypeReferenceSequence> | null = null;

    // Abstract or Final
    attributes: Array<AbstractKeywordToken | FinalKeywordToken> = [];

    members: ParseContextElementArray<ClassDeclaration['kind']>;
    endKeyword: EndKeywordToken;
    endClassKeyword: ClassKeywordToken | null = null;
}
