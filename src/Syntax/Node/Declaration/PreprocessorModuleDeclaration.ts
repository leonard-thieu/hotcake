import { ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { EOFToken } from '../../Token/Token';
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

    members: ParseContextElementSequence<ParseContextKind.PreprocessorModuleDeclaration> = undefined!;
    eofToken: EOFToken = undefined!;
}
