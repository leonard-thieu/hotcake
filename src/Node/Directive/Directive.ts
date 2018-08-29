import { Node } from '../Node';
import { AssignmentDirective } from './AssignmentDirective';
import { ElseDirective } from './ElseDirective';
import { ElseIfDirective } from './ElseIfDirective';
import { EndDirective } from './EndDirective';
import { ErrorDirective } from './ErrorDirective';
import { IfDirective } from './IfDirective';
import { PrintDirective } from './PrintDirective';
import { RemDirective } from './RemDirective';

export abstract class Directive extends Node {

}

export type Directives =
    IfDirective |
    ElseIfDirective |
    ElseDirective |
    EndDirective |
    RemDirective |
    PrintDirective |
    ErrorDirective |
    AssignmentDirective
    ;
