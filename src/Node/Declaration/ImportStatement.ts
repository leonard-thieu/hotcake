import { ImportKeywordToken } from '../../Token/Token';
import { StringLiteral } from '../Expression/StringLiteral';
import { ModulePath } from '../ModulePath';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class ImportStatement extends Declaration {
    static CHILD_NAMES: (keyof ImportStatement)[] = [
        'importKeyword',
        'modulePath',
        'nativeFilePath',
    ];

    readonly kind = NodeKind.ImportStatement;

    importKeyword: ImportKeywordToken;
    modulePath: ModulePath | null = null;
    nativeFilePath: StringLiteral | null = null;
}
