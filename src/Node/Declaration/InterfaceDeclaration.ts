import { ParseContextElementArray, ParseContextKind } from '../../Parser';
import { Token } from '../../Token/Token';
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

    interfaceKeyword: Token;
    name: Token;
    extendsKeyword: Token | null = null;
    baseTypes: ParseContextElementArray<ParseContextKind.BaseTypes> | null = null;
    members: ParseContextElementArray<InterfaceDeclaration['kind']>;
    endKeyword: Token;
    endInterfaceKeyword: Token | null = null;
}
