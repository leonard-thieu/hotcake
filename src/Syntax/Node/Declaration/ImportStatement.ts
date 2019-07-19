import { MissingToken } from '../../Token/MissingToken';
import { ImportKeywordToken } from '../../Token/Token';
import { StringLiteralExpression } from '../Expression/StringLiteralExpression';
import { ModulePath } from '../ModulePath';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export const ImportStatementChildNames: ReadonlyArray<keyof ImportStatement> = [
    'importKeyword',
    'path',
];

export class ImportStatement extends Declaration {
    readonly kind = NodeKind.ImportStatement;

    importKeyword: ImportKeywordToken = undefined!;
    path: StringLiteralExpression | ModulePath | MissingToken = undefined!;
}
