import { EOFToken, Tokens } from '../../Token/Token';
import { Directives } from '../Directive/Directive';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

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
