import { ImportKeywordToken } from '../../Token/Token';
import { StringLiteral } from '../Expression/StringLiteral';
import { ModulePath } from '../ModulePath';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class ImportStatement extends Declaration {
    static CHILD_NAMES: (keyof ImportStatement)[] = [
        'importKeyword',
        'path',
    ];

    readonly kind = NodeKind.ImportStatement;

    importKeyword: ImportKeywordToken;
    path: ModulePath | StringLiteral | null = null;
}
