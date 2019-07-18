import { Diagnostic } from '../../../Diagnostic';
import { ParseContextElementArray, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { EOFToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';
import { PreprocessorModuleDeclaration } from './PreprocessorModuleDeclaration';
import { StrictDirective } from './StrictDirective';

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
    members: ParseContextElementArray<ModuleDeclaration['kind']> = undefined!;
    eofToken: EOFToken = undefined!;

    parseDiagnostics?: Diagnostic[];
}
