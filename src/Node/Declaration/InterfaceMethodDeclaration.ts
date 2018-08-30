import { Token } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { TypeReference } from '../TypeReference';
import { DataDeclarationList } from './DataDeclarationList';
import { Declaration } from './Declaration';

export class InterfaceMethodDeclaration extends Declaration {
    static CHILD_NAMES: (keyof InterfaceMethodDeclaration)[] = [
        'methodKeyword',
        'name',
        'colon',
        'returnType',
        'openingParenthesis',
        'parameters',
        'closingParenthesis',
    ];

    readonly kind = NodeKind.InterfaceMethodDeclaration;

    methodKeyword: Token;
    name: Token;
    colon: Token | null = null;
    returnType: TypeReference | null = null;
    openingParenthesis: Token;
    parameters: DataDeclarationList;
    closingParenthesis: Token;
}
