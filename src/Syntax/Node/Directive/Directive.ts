import { NumberSignToken } from '../../Token/Token';
import { Node } from '../Node';
import { AssignmentDirective } from './AssignmentDirective';
import { ErrorDirective } from './ErrorDirective';
import { ElseDirective, ElseIfDirective, IfDirective } from './IfDirective';
import { PrintDirective } from './PrintDirective';
import { RemDirective } from './RemDirective';

export abstract class Directive extends Node {
    numberSign: NumberSignToken = undefined!;

    get firstToken() {
        return this.numberSign;
    }
}

export type Directives =
    AssignmentDirective |
    ErrorDirective |
    IfDirective | ElseIfDirective | ElseDirective |
    PrintDirective |
    RemDirective
    ;