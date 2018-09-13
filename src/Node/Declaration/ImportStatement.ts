import { MissingToken } from '../../Token/MissingToken';
import { ImportKeywordToken } from '../../Token/Token';
import { TokenKind } from '../../Token/TokenKind';
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

    importKeyword: ImportKeywordToken = undefined!;
    path: StringLiteral | ModulePath | MissingToken<TokenKind.ImportStatementPath> = undefined!;
}
