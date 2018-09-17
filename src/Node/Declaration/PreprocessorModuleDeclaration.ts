import { ParseContextElementSequence } from '../../ParserBase';
import { EOFToken } from '../../Token/Token';
import { Node } from '../Node';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class PreprocessorModuleDeclaration extends Declaration {
    static CHILD_NAMES: (keyof PreprocessorModuleDeclaration)[] = [
        'members',
        'eofToken',
    ];

    filePath: string = undefined!;
    document: string = undefined!;

    readonly kind = NodeKind.PreprocessorModuleDeclaration;

    members: ParseContextElementSequence<PreprocessorModuleDeclaration['kind']> = undefined!;
    eofToken: EOFToken = undefined!;

    get firstToken() {
        const firstMember = this.members[0];
        if (firstMember) {
            if (firstMember instanceof Node) {
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
