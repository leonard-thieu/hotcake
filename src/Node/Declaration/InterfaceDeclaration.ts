import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { EndKeywordToken, ExtendsKeywordToken, IdentifierToken, InterfaceKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class InterfaceDeclaration extends Declaration {
    static CHILD_NAMES: (keyof InterfaceDeclaration)[] = [
        'interfaceKeyword',
        'name',
        'extendsKeyword',
        'baseTypes',
        'members',
        'endKeyword',
        'endInterfaceKeyword',
    ];

    readonly kind = NodeKind.InterfaceDeclaration;

    interfaceKeyword: InterfaceKeywordToken;
    name: IdentifierToken;
    extendsKeyword: ExtendsKeywordToken | null = null;
    baseTypes: ParseContextElementArray<ParseContextKind.TypeReferenceSequence> | null = null;
    members: ParseContextElementArray<InterfaceDeclaration['kind']>;
    endKeyword: EndKeywordToken;
    endInterfaceKeyword: InterfaceKeywordToken | null = null;
}
