import { ParseContextElementArray } from '../../ParserBase';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class ModuleDeclaration extends Declaration {
    static CHILD_NAMES: (keyof ModuleDeclaration)[] = [
        'members',
    ];

    filePath: string;
    document: string;

    readonly kind = NodeKind.ModuleDeclaration;

    members: ParseContextElementArray<ModuleDeclaration['kind']>;
}
