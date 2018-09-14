import { Diagnostic } from '../../Diagnostic';
import { ParseContextElementArray, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';
import { StrictDirective } from './StrictDirective';

export class ModuleDeclaration extends Declaration {
    static CHILD_NAMES: (keyof ModuleDeclaration)[] = [
        'strictNewlines',
        'strictDirective',
        'headerMembers',
        'members',
    ];

    filePath: string = undefined!;
    document: string = undefined!;

    readonly kind = NodeKind.ModuleDeclaration;

    strictNewlines: ParseContextElementSequence<ParseContextKind.NewlineList> = undefined!;
    strictDirective?: StrictDirective = undefined;
    headerMembers: ParseContextElementArray<ParseContextKind.ModuleDeclarationHeader> = undefined!;
    members: ParseContextElementArray<ModuleDeclaration['kind']> = undefined!;

    parseDiagnostics?: Diagnostic[];
}
