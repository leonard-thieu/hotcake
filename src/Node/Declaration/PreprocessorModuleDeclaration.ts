import { Token } from '../../Token/Token';
import { Directives } from '../Directive/Directive';
import { Node } from '../Node';
import { NodeKind } from '../NodeKind';

export class PreprocessorModuleDeclaration extends Node {
    static CHILD_NAMES: (keyof PreprocessorModuleDeclaration)[] = [
        'members',
        'eofToken',
    ];

    readonly kind = NodeKind.PreprocessorModuleDeclaration;

    members: Array<Directives | Token>;
    eofToken: Token;
}
