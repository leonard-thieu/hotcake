import { ParseContextElementArray, ParseContextElementDelimitedSequence, ParseContextKind } from '../../ParserBase';
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

    interfaceKeyword: InterfaceKeywordToken = undefined!;
    identifier: MissableIdentifier = undefined!;
    extendsKeyword?: ExtendsKeywordToken = undefined;
    baseTypes?: ParseContextElementDelimitedSequence<ParseContextKind.TypeReferenceSequence> = undefined;
    members: ParseContextElementArray<InterfaceDeclaration['kind']> = undefined!;
    endKeyword: MissableToken<EndKeywordToken> = undefined!;
    endInterfaceKeyword?: InterfaceKeywordToken = undefined;

    get firstToken() {
        return this.interfaceKeyword;
    }

    get lastToken() {
        if (this.endInterfaceKeyword) {
            return this.endInterfaceKeyword;
        }

        return this.endKeyword;
    }
}
