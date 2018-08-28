import { Token } from "../../Token";
import { StringLiteral } from "../Expression/StringLiteral";
import { ModulePath } from "../ModulePath";
import { NodeKind } from "../NodeKind";
import { Statement } from "./Statement";

export class ImportStatement extends Statement {
    static CHILD_NAMES: (keyof ImportStatement)[] = [
        'importKeyword',
        'modulePath',
        'nativeFilePath',
    ];

    readonly kind = NodeKind.ImportStatement;

    importKeyword: Token;
    modulePath: ModulePath | null = null;
    nativeFilePath: StringLiteral | null = null;
}
