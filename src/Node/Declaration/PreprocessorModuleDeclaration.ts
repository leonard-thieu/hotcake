import { PreprocessorParseContextElementArray } from '../../PreprocessorParser';
import { Token } from '../../Token/Token';
import { Node } from '../Node';
import { NodeKind } from '../NodeKind';

export class PreprocessorModuleDeclaration extends Node {
    static CHILD_NAMES: (keyof PreprocessorModuleDeclaration)[] = [
        'members',
        'eofToken',
    ];

    filePath: string;
    document: string;

    readonly kind = NodeKind.PreprocessorModuleDeclaration;

    members: PreprocessorParseContextElementArray<PreprocessorModuleDeclaration['kind']>;
    eofToken: Token;
}
