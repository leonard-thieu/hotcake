import { MissableToken } from '../../Token/MissingToken';
import { SkippedToken } from '../../Token/SkippedToken';
import { EndKeywordToken, ExtendsKeywordToken, InterfaceKeywordToken, NewlineToken } from '../../Token/Token';
import { CommaSeparator } from '../CommaSeparator';
import { MissableIdentifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { TypeReference } from '../TypeReference';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { Declaration } from './Declaration';
import { InterfaceMethodDeclaration } from './InterfaceMethodDeclaration';

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
