import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { ClosingParenthesisToken, EndKeywordToken, ExtendsKeywordToken, InterfaceKeywordToken, MethodKeywordToken, NewlineToken, OpeningParenthesisToken } from '../../Token/Token';
import { CommaSeparator } from '../CommaSeparator';
import { MissableIdentifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { TypeAnnotation } from '../TypeAnnotation';
import { TypeReference } from '../TypeReference';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { Declaration } from './Declaration';

// #region Interface declaration

export const InterfaceDeclarationChildNames: ReadonlyArray<keyof InterfaceDeclaration> = [
    'interfaceKeyword',
    'identifier',
    'extendsKeyword',
    'baseTypes',
    'members',
    'endKeyword',
    'endInterfaceKeyword',
];

export class InterfaceDeclaration extends Declaration {
    readonly kind = NodeKind.InterfaceDeclaration;

    interfaceKeyword: InterfaceKeywordToken = undefined!;
    identifier: MissableIdentifier = undefined!;
    extendsKeyword?: ExtendsKeywordToken = undefined;
    baseTypes?: (TypeReference | CommaSeparator)[] = undefined;
    members: InterfaceDeclarationMember[] = undefined!;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endInterfaceKeyword?: InterfaceKeywordToken = undefined;
}

export type InterfaceDeclarationMember =
    | DataDeclarationSequence
    | InterfaceMethodDeclaration
    | NewlineToken
    | SkippedToken
    ;

// #endregion

// #region Interface method declaration

export const InterfaceMethodDeclarationChildNames: ReadonlyArray<keyof InterfaceMethodDeclaration> = [
    'methodKeyword',
    'identifier',
    'returnType',
    'openingParenthesis',
    'parameters',
    'closingParenthesis',
];

export class InterfaceMethodDeclaration extends Declaration {
    readonly kind = NodeKind.InterfaceMethodDeclaration;

    methodKeyword: MethodKeywordToken = undefined!;
    identifier: MissableIdentifier = undefined!;
    returnType?: TypeAnnotation = undefined;
    openingParenthesis: MissableToken<OpeningParenthesisToken> = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: MissableToken<ClosingParenthesisToken> = undefined!;
}

// #endregion
