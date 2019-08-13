import { MissingToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { ClosingParenthesisToken, EndKeywordToken, ExtendsKeywordToken, InterfaceKeywordToken, MethodKeywordToken, NewlineToken, OpeningParenthesisToken } from '../../Token/Tokens';
import { CommaSeparator } from '../CommaSeparator';
import { Identifier } from '../Identifier';
import { NodeKind } from '../Nodes';
import { TypeAnnotation } from '../TypeAnnotation';
import { TypeReference } from '../TypeReference';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { Declaration } from './Declarations';

// #region Interface declaration

export const InterfaceDeclarationChildNames: ReadonlyArray<keyof InterfaceDeclaration> = [
    'interfaceKeyword',
    'identifier',
    'extendsKeyword',
    'implementedTypes',
    'members',
    'endKeyword',
    'endInterfaceKeyword',
];

export class InterfaceDeclaration extends Declaration {
    readonly kind = NodeKind.InterfaceDeclaration;

    interfaceKeyword: InterfaceKeywordToken = undefined!;
    identifier: Identifier | MissingToken = undefined!;
    extendsKeyword?: ExtendsKeywordToken = undefined;
    implementedTypes?: (TypeReference | CommaSeparator)[] = undefined;
    members: InterfaceDeclarationMember[] = undefined!;
    endKeyword: EndKeywordToken | MissingToken = undefined!;
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
    identifier: Identifier | MissingToken = undefined!;
    returnType?: TypeAnnotation = undefined;
    openingParenthesis: OpeningParenthesisToken | MissingToken = undefined!;
    parameters: DataDeclarationSequence = undefined!;
    closingParenthesis: ClosingParenthesisToken | MissingToken = undefined!;
}

// #endregion
