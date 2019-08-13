import { MissingToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { AbstractKeywordToken, ClassKeywordToken, ClosingParenthesisToken, EndKeywordToken, ExtendsKeywordToken, FinalKeywordToken, MethodKeywordToken, NewlineToken, NullKeywordToken, OpeningParenthesisToken, PropertyKeywordToken } from '../../Token/Tokens';
import { Identifier } from '../Identifier';
import { NodeKind } from '../Nodes';
import { TypeAnnotation } from '../TypeAnnotation';
import { TypeReference } from '../TypeReference';
import { AccessibilityDirective } from './AccessibilityDirective';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { ExternDataDeclarationSequence } from './ExternDataDeclarationSequence';
import { ExternDeclaration } from './ExternDeclarations';
import { ExternFunctionDeclaration } from './ExternFunctionDeclaration';

// #region Extern class declaration

export const ExternClassDeclarationChildNames: ReadonlyArray<keyof ExternClassDeclaration> = [
    'classKeyword',
    'identifier',
    'extendsKeyword',
    'superType',
    'attribute',
    'equalsSign',
    'nativeSymbol',
    'members',
    'endKeyword',
    'endClassKeyword',
];

export class ExternClassDeclaration extends ExternDeclaration {
    readonly kind = NodeKind.ExternClassDeclaration;

    classKeyword: ClassKeywordToken = undefined!;
    identifier: Identifier | MissingToken = undefined!;

    // Extends
    extendsKeyword?: ExtendsKeywordToken = undefined!;
    superType?: TypeReference | NullKeywordToken | MissingToken = undefined!;

    attribute?: AbstractKeywordToken | FinalKeywordToken = undefined!;

    members: ExternClassDeclarationMember[] = undefined!;
    endKeyword: EndKeywordToken | MissingToken = undefined!;
    endClassKeyword?: ClassKeywordToken = undefined!;
}

export type ExternClassDeclarationMember =
    | AccessibilityDirective
    | ExternDataDeclarationSequence
    | ExternFunctionDeclaration
    | ExternClassMethodDeclaration
    | NewlineToken
    | SkippedToken
    ;

// #endregion

// #region Extern class method declaration

export const ExternClassMethodDeclarationChildNames: ReadonlyArray<keyof ExternClassMethodDeclaration> = [
    'methodKeyword',
    'identifier',
    'returnType',
    'openingParenthesis',
    'parameters',
    'closingParenthesis',
    'attributes',
    'equalsSign',
    'nativeSymbol',
];

export class ExternClassMethodDeclaration extends ExternDeclaration {
    readonly kind = NodeKind.ExternClassMethodDeclaration;

    methodKeyword: MethodKeywordToken = undefined!;
    identifier: Identifier | MissingToken = undefined!;
    returnType?: TypeAnnotation = undefined!;
    openingParenthesis: OpeningParenthesisToken | MissingToken = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: ClosingParenthesisToken | MissingToken = undefined!;
    attributes: (AbstractKeywordToken | FinalKeywordToken | PropertyKeywordToken)[] = undefined!;
}

// #endregion
