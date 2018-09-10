import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { MissableToken } from '../../Token/MissingToken';
import { EndKeywordToken, ExtendsKeywordToken, InterfaceKeywordToken } from '../../Token/Token';
import { MissableIdentifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class InterfaceDeclaration extends Declaration {
    static CHILD_NAMES: (keyof InterfaceDeclaration)[] = [
        'interfaceKeyword',
        'identifier',
        'extendsKeyword',
        'baseTypes',
        'members',
        'endKeyword',
        'endInterfaceKeyword',
    ];

    readonly kind = NodeKind.InterfaceDeclaration;

    interfaceKeyword: InterfaceKeywordToken;
    identifier: MissableIdentifier;
    extendsKeyword: ExtendsKeywordToken | null = null;
    baseTypes: ParseContextElementArray<ParseContextKind.TypeReferenceSequence> | null = null;
    members: ParseContextElementArray<InterfaceDeclaration['kind']>;
    endKeyword: MissableToken<EndKeywordToken>;
    endInterfaceKeyword: InterfaceKeywordToken | null = null;
}
