import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { AbstractKeywordToken, ClassKeywordToken, ClosingParenthesisToken, EndKeywordToken, ExtendsKeywordToken, FinalKeywordToken, GreaterThanSignToken, ImplementsKeywordToken, LessThanSignToken, MethodKeywordToken, NewKeywordToken, NewlineToken, OpeningParenthesisToken, PropertyKeywordToken } from '../../Token/Token';
import { CommaSeparator } from '../CommaSeparator';
import { MissableIdentifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { Statements } from '../Statement/Statement';
import { TypeAnnotation } from '../TypeAnnotation';
import { MissableTypeReference, TypeReference } from '../TypeReference';
import { AccessibilityDirective } from './AccessibilityDirective';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { Declaration } from './Declaration';
import { FunctionDeclaration } from './FunctionDeclaration';
import { TypeParameter } from './TypeParameter';

// #region Class declaration

export const ClassDeclarationChildNames: ReadonlyArray<keyof ClassDeclaration> = [
    'classKeyword',
    'identifier',
    'lessThanSign',
    'typeParameters',
    'greaterThanSign',
    'extendsKeyword',
    'superType',
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
    superType?: MissableTypeReference = undefined;

    // Implements
    implementsKeyword?: ImplementsKeywordToken = undefined;
    implementedTypes?: (TypeReference | CommaSeparator)[] = undefined;

    attribute?: AbstractKeywordToken | FinalKeywordToken = undefined;

    members: ClassDeclarationMember[] = undefined!;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endClassKeyword?: ClassKeywordToken = undefined;
}

export type ClassDeclarationMember =
    | DataDeclarationSequence
    | FunctionDeclaration
    | ClassMethodDeclaration
    | AccessibilityDirective
    | NewlineToken
    | SkippedToken
    ;

// #endregion

// #region Class method declaration

export const ClassMethodDeclarationChildNames: ReadonlyArray<keyof ClassMethodDeclaration> = [
    'methodKeyword',
    'identifier',
    'returnType',
    'openingParenthesis',
    'parameters',
    'closingParenthesis',
    'attributes',
    'statements',
    'endKeyword',
    'endMethodKeyword',
];

export class ClassMethodDeclaration extends Declaration {
    readonly kind = NodeKind.ClassMethodDeclaration;

    methodKeyword: MethodKeywordToken = undefined!;
    identifier: NewKeywordToken | MissableIdentifier = undefined!;
    returnType?: TypeAnnotation = undefined;
    openingParenthesis: MissableToken<OpeningParenthesisToken> = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: MissableToken<ClosingParenthesisToken> = undefined!;
    attributes: (AbstractKeywordToken | FinalKeywordToken | PropertyKeywordToken)[] = undefined!;
    statements?: (Statements | SkippedToken)[] = undefined;
    endKeyword?: MissableToken<EndKeywordToken> = undefined;
    endMethodKeyword?: MethodKeywordToken = undefined;
}

// #endregion
