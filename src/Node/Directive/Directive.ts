import { Node } from '../Node';
import { AssignmentDirective } from './AssignmentDirective';
import { ErrorDirective } from './ErrorDirective';
import { ElseDirective, ElseIfDirective, IfDirective } from './IfDirective';
import { PrintDirective } from './PrintDirective';
import { RemDirective } from './RemDirective';

export abstract class Directive extends Node {

}

export type Directives =
    AssignmentDirective |
    ErrorDirective |
    IfDirective | ElseIfDirective | ElseDirective |
    PrintDirective |
    RemDirective
    ;
