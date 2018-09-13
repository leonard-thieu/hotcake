import { ParseContextElementDelimitedSequence, ParseContextKind } from '../ParserBase';
import { Declaration } from './Declaration/Declaration';
import { NodeKind } from './NodeKind';

export class ModulePath extends Declaration {
    static CHILD_NAMES: (keyof ModulePath)[] = [
        'children',
    ];

    readonly kind = NodeKind.ModulePath;

    children: ParseContextElementDelimitedSequence<ParseContextKind.ModulePathSequence> = undefined!;
}
