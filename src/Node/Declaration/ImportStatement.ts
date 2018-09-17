import { MissingToken } from '../../Token/MissingToken';
import { ImportKeywordToken } from '../../Token/Token';
import { TokenKind } from '../../Token/TokenKind';
import { StringLiteralExpression } from '../Expression/StringLiteralExpression';
import { ModulePath } from '../ModulePath';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class ImportStatement extends Declaration {
    static CHILD_NAMES: (keyof ImportStatement)[] = [
        'importKeyword',
        'path',
    ];

    readonly kind = NodeKind.ImportStatement;

    importKeyword: ImportKeywordToken = undefined!;
    path: StringLiteralExpression | ModulePath | MissingToken<TokenKind.ImportStatementPath> = undefined!;

    get firstToken() {
        return this.importKeyword;
    }

    get lastToken() {
        if (isNode(this.path)) {
            return this.path.lastToken;
        }

        return this.path;
    }
}
