import { ParseContextElementArray, ParseContextKind } from '../../ParserBase';
import { ConstKeywordToken, FieldKeywordToken, GlobalKeywordToken, LocalKeywordToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class DataDeclarationList extends Declaration {
    static CHILD_NAMES: (keyof DataDeclarationList)[] = [
        'dataDeclarationKeyword',
        'children',
    ];

    readonly kind = NodeKind.DataDeclarationList;

    /**
     * Const, Global, Field, or Local
     */
    dataDeclarationKeyword: ConstKeywordToken | GlobalKeywordToken | FieldKeywordToken | LocalKeywordToken;
    children: ParseContextElementArray<ParseContextKind.DataDeclarationSequence>;
}
