import { EOFToken, Tokens } from '../../Token/Tokens';
import { Directives } from '../Directive/Directives';
import { NodeKind } from '../Nodes';
import { Declaration } from './Declarations';

export const PreprocessorModuleDeclarationChildNames: ReadonlyArray<keyof PreprocessorModuleDeclaration> = [
    'members',
    'eofToken',
];

export class PreprocessorModuleDeclaration extends Declaration {
    filePath: string = undefined!;
    document: string = undefined!;

    readonly kind = NodeKind.PreprocessorModuleDeclaration;

    members: (Directives | Tokens)[] = undefined!;
    eofToken: EOFToken = undefined!;
}
