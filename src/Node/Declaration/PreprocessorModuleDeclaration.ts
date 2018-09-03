import { ParseContextElementSequence } from '../../ParserBase';
import { EOFToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class PreprocessorModuleDeclaration extends Declaration {
    static CHILD_NAMES: (keyof PreprocessorModuleDeclaration)[] = [
        'members',
        'eofToken',
    ];

    filePath: string;
    document: string;

    readonly kind = NodeKind.PreprocessorModuleDeclaration;

    members: ParseContextElementSequence<PreprocessorModuleDeclaration['kind']>;
    eofToken: EOFToken;
}
