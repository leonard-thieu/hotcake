import { BoundSymbolTable } from '../../../Binding/BoundSymbol';
import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { AbstractKeywordToken, ClassKeywordToken, EndKeywordToken, ExtendsKeywordToken, FinalKeywordToken, GreaterThanSignToken, ImplementsKeywordToken, LessThanSignToken, NewlineToken } from '../../Token/Token';
import { CommaSeparator } from '../CommaSeparator';
import { MissableIdentifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { MissableTypeReference, TypeReference } from '../TypeReference';
import { AccessibilityDirective } from './AccessibilityDirective';
import { ClassMethodDeclaration } from './ClassMethodDeclaration';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { Declaration } from './Declaration';
import { FunctionDeclaration } from './FunctionDeclaration';
import { TypeParameter } from './TypeParameter';

export const ClassDeclarationChildNames: ReadonlyArray<keyof ClassDeclaration> = [
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

export class ClassDeclaration extends Declaration {
    readonly kind = NodeKind.ClassDeclaration;

    classKeyword: ClassKeywordToken = undefined!;
    identifier: MissableIdentifier = undefined!;

    // Generic
    lessThanSign?: LessThanSignToken = undefined;
    typeParameters?: (TypeParameter | CommaSeparator)[] = undefined;
    greaterThanSign?: MissableToken<GreaterThanSignToken> = undefined;

    // Extends
    extendsKeyword?: ExtendsKeywordToken = undefined;
    baseType?: MissableTypeReference = undefined;

    // Implements
    implementsKeyword?: ImplementsKeywordToken = undefined;
    implementedTypes?: (TypeReference | CommaSeparator)[] = undefined;

    attribute?: AbstractKeywordToken | FinalKeywordToken = undefined;

    members: (ClassDeclarationMember | SkippedToken)[] = undefined!;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endClassKeyword?: ClassKeywordToken = undefined;

    locals = new BoundSymbolTable();
}

export type ClassDeclarationMember =
    | DataDeclarationSequence
    | FunctionDeclaration
    | ClassMethodDeclaration
    | AccessibilityDirective
    | NewlineToken
    ;
