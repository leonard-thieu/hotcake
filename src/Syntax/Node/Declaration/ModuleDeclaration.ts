import { Diagnostic } from '../../../Diagnostic';
import { ParseContextElementArray, ParseContextElementSequence, ParseContextKind } from '../../ParserBase';
import { EOFToken } from '../../Token/Token';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';
import { PreprocessorModuleDeclaration } from './PreprocessorModuleDeclaration';
import { StrictDirective } from './StrictDirective';

export class ModuleDeclaration extends Declaration {
    static CHILD_NAMES: (keyof ModuleDeclaration)[] = [
        'strictNewlines',
        'strictDirective',
        'headerMembers',
        'members',
        'eofToken',
    ];

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

    get firstToken() {
        if (this.strictNewlines.length !== 0) {
            return this.strictNewlines[0];
        }

        if (this.strictDirective) {
            return this.strictDirective.firstToken;
        }

        if (this.headerMembers.length !== 0) {
            const firstHeaderMember = this.headerMembers[0];
            if (isNode(firstHeaderMember)) {
                return firstHeaderMember.firstToken;
            }

            return firstHeaderMember;
        }

        if (this.members.length !== 0) {
            const firstMember = this.members[0];
            if (isNode(firstMember)) {
                return firstMember.firstToken;
            }

            return firstMember;
        }

        return this.eofToken;
    }

    get lastToken() {
        return this.eofToken;
    }
}
