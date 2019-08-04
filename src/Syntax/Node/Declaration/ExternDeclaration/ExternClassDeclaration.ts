import { MissableToken } from '../../../Token/MissingToken';
import { SkippedToken } from '../../../Token/SkippedToken';
import { AbstractKeywordToken, ClassKeywordToken, EndKeywordToken, ExtendsKeywordToken, FinalKeywordToken, NewlineToken, NullKeywordToken } from '../../../Token/Token';
import { MissableIdentifier } from '../../Identifier';
import { NodeKind } from '../../NodeKind';
import { MissableTypeReference } from '../../TypeReference';
import { AccessibilityDirective } from '../AccessibilityDirective';
import { ExternClassMethodDeclaration } from './ExternClassMethodDeclaration';
import { ExternDataDeclarationSequence } from './ExternDataDeclarationSequence';
import { ExternDeclaration } from './ExternDeclaration';
import { ExternFunctionDeclaration } from './ExternFunctionDeclaration';

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
