import { ParseContextElementDelimitedSequence, ParseContextKind } from '../../ParserBase';
import { MissingToken } from '../../Token/MissingToken';
import { ImportKeywordToken } from '../../Token/Token';
import { TokenKind } from '../../Token/TokenKind';
import { StringLiteral } from '../Expression/StringLiteral';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class ImportStatement extends Declaration {
    static CHILD_NAMES: (keyof ImportStatement)[] = [
        'importKeyword',
        'path',
    ];

    readonly kind = NodeKind.ImportStatement;

    importKeyword: ImportKeywordToken = undefined!;
    path: StringLiteral | ParseContextElementDelimitedSequence<ParseContextKind.ModulePathSequence> | MissingToken<TokenKind.ImportStatementPath> = undefined!;
}
