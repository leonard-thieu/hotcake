import { Diagnostic } from '../../../Diagnostic';
import { ParseContextElementArray, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { EOFToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';
import { PreprocessorModuleDeclaration } from './PreprocessorModuleDeclaration';
import { StrictDirective } from './StrictDirective';

export const ModuleDeclarationChildNames: ReadonlyArray<keyof ModuleDeclaration> = [
    'strictNewlines',
    'strictDirective',
    'headerMembers',
    'members',
    'eofToken',
];

export class ModuleDeclaration extends Declaration {
    preprocessorModuleDeclaration: PreprocessorModuleDeclaration = undefined!;

    get filePath(): string {
        return this.preprocessorModuleDeclaration.filePath;
    }

    get document(): string {
        return this.preprocessorModuleDeclaration.document;
    }

    readonly kind = NodeKind.ModuleDeclaration;

    strictNewlines: ParseContextElementSequence<ParseContextKind.NewlineList> = undefined!;
    strictDirective?: StrictDirective = undefined;
    headerMembers: ParseContextElementArray<ParseContextKind.ModuleDeclarationHeader> = undefined!;
    members: ParseContextElementArray<ParseContextKind.ModuleDeclaration> = undefined!;
    eofToken: EOFToken = undefined!;

    parseDiagnostics?: Diagnostic[];
}
