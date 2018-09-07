import { ImportKeywordToken } from '../../Token/Token';
import { StringLiteral } from '../Expression/StringLiteral';
import { MissableModulePath } from '../ModulePath';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class ImportStatement extends Declaration {
    static CHILD_NAMES: (keyof ImportStatement)[] = [
        'importKeyword',
        'path',
    ];

    readonly kind = NodeKind.ImportStatement;

    importKeyword: ImportKeywordToken;
    path: StringLiteral | MissableModulePath;
}
