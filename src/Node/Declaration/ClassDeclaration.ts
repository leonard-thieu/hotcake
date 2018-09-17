import { ParseContextElementArray, ParseContextElementDelimitedSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { AbstractKeywordToken, ClassKeywordToken, EndKeywordToken, ExtendsKeywordToken, FinalKeywordToken, GreaterThanSignToken, ImplementsKeywordToken, LessThanSignToken } from '../../Token/Token';
import { MissableIdentifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { MissableTypeReference } from '../TypeReference';
import { Declaration } from './Declaration';

export class ClassDeclaration extends Declaration {
    static CHILD_NAMES: (keyof ClassDeclaration)[] = [
        'classKeyword',
        'identifier',
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

    classKeyword: ClassKeywordToken = undefined!;
    identifier: MissableIdentifier = undefined!;

    // Generic
    lessThanSign?: LessThanSignToken = undefined;
    typeParameters?: ParseContextElementDelimitedSequence<ParseContextKind.TypeParameterSequence> = undefined;
    greaterThanSign?: MissableToken<GreaterThanSignToken> = undefined;

    // Extends
    extendsKeyword?: ExtendsKeywordToken = undefined;
    baseType?: MissableTypeReference = undefined;

    // Implements
    implementsKeyword?: ImplementsKeywordToken = undefined;
    implementedTypes?: ParseContextElementDelimitedSequence<ParseContextKind.TypeReferenceSequence> = undefined;

    attribute?: AbstractKeywordToken | FinalKeywordToken = undefined;

    members: ParseContextElementArray<ClassDeclaration['kind']> = undefined!;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endClassKeyword?: ClassKeywordToken = undefined;

    get firstToken() {
        return this.classKeyword;
    }

    get lastToken() {
        if (this.endClassKeyword) {
            return this.endClassKeyword;
        }

        return this.endKeyword;
    }
}
