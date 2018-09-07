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

    dataDeclarationKeyword: DataDeclarationKeywordToken;
    children: ParseContextElementArray<ParseContextKind.DataDeclarationSequence>;
}

export type DataDeclarationKeywordToken =
    ConstKeywordToken |
    GlobalKeywordToken |
    FieldKeywordToken |
    LocalKeywordToken
    ;
