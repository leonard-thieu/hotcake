import { MissableToken } from '../../../Token/MissingToken';
import { SkippedToken } from '../../../Token/SkippedToken';
import { AbstractKeywordToken, ClassKeywordToken, ClosingParenthesisToken, EndKeywordToken, ExtendsKeywordToken, FinalKeywordToken, MethodKeywordToken, NewlineToken, NullKeywordToken, OpeningParenthesisToken, PropertyKeywordToken } from '../../../Token/Token';
import { MissableIdentifier } from '../../Identifier';
import { NodeKind } from '../../NodeKind';
import { TypeAnnotation } from '../../TypeAnnotation';
import { MissableTypeReference } from '../../TypeReference';
import { AccessibilityDirective } from '../AccessibilityDirective';
import { DataDeclarationSequence } from '../DataDeclarationSequence';
import { ExternDataDeclarationSequence } from './ExternDataDeclarationSequence';
import { ExternDeclaration } from './ExternDeclaration';
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
    identifier: MissableIdentifier = undefined!;

    // Extends
    extendsKeyword?: ExtendsKeywordToken = undefined;
    superType?: MissableTypeReference | NullKeywordToken = undefined;

    attribute?: AbstractKeywordToken | FinalKeywordToken = undefined;

    members: ExternClassDeclarationMember[] = undefined!;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endClassKeyword?: ClassKeywordToken = undefined;
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
    identifier: MissableIdentifier = undefined!;
    returnType?: TypeAnnotation = undefined;
    openingParenthesis: MissableToken<OpeningParenthesisToken> = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: MissableToken<ClosingParenthesisToken> = undefined!;
    attributes: (AbstractKeywordToken | FinalKeywordToken | PropertyKeywordToken)[] = undefined!;
}

// #endregion
