import { MissingToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { AbstractKeywordToken, ClassKeywordToken, ClosingParenthesisToken, EndKeywordToken, ExtendsKeywordToken, FinalKeywordToken, GreaterThanSignToken, ImplementsKeywordToken, LessThanSignToken, MethodKeywordToken, NewKeywordToken, NewlineToken, OpeningParenthesisToken, PropertyKeywordToken } from '../../Token/Tokens';
import { CommaSeparator } from '../CommaSeparator';
import { Identifier } from '../Identifier';
import { NodeKind } from '../Nodes';
import { Statements } from '../Statement/Statements';
import { TypeAnnotation } from '../TypeAnnotation';
import { TypeReference } from '../TypeReference';
import { AccessibilityDirective } from './AccessibilityDirective';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { Declaration } from './Declarations';
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
    identifier: Identifier | MissingToken = undefined!;

    // Generic
    lessThanSign?: LessThanSignToken = undefined;
    typeParameters?: (TypeParameter | CommaSeparator)[] = undefined;
    greaterThanSign?: GreaterThanSignToken | MissingToken = undefined;

    // Extends
    extendsKeyword?: ExtendsKeywordToken = undefined;
    superType?: TypeReference | MissingToken = undefined;

    // Implements
    implementsKeyword?: ImplementsKeywordToken = undefined;
    implementedTypes?: (TypeReference | CommaSeparator)[] = undefined;

    attribute?: AbstractKeywordToken | FinalKeywordToken = undefined;

    members: ClassDeclarationMember[] = undefined!;
    endKeyword: EndKeywordToken | MissingToken = undefined!;
    endClassKeyword?: ClassKeywordToken = undefined;
}

export type ClassDeclarationMember =
    | AccessibilityDirective
    | DataDeclarationSequence
    | FunctionDeclaration
    | ClassMethodDeclaration
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
    identifier: Identifier | NewKeywordToken | MissingToken = undefined!;
    returnType?: TypeAnnotation = undefined;
    openingParenthesis: OpeningParenthesisToken | MissingToken = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: ClosingParenthesisToken | MissingToken = undefined!;
    attributes: (AbstractKeywordToken | FinalKeywordToken | PropertyKeywordToken)[] = undefined!;
    statements?: (Statements | SkippedToken)[] = undefined;
    endKeyword?: EndKeywordToken | MissingToken = undefined;
    endMethodKeyword?: MethodKeywordToken = undefined;
}

// #endregion
