import { ParseContextElementArray, ParseContextElementDelimitedSequence, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { EndKeywordToken, ExtendsKeywordToken, InterfaceKeywordToken } from '../../Token/Token';
import { MissableIdentifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

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
    baseTypes?: ParseContextElementDelimitedSequence<ParseContextKind.TypeReferenceSequence> = undefined;
    members: ParseContextElementArray<ParseContextKind.InterfaceDeclaration> = undefined!;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endInterfaceKeyword?: InterfaceKeywordToken = undefined;
}
