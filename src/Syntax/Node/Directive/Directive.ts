import { NumberSignToken } from '../../Token/Token';
import { Node } from '../Node';
import { AssignmentDirective } from './AssignmentDirective';
import { ErrorDirective } from './ErrorDirective';
import { IfDirective } from './IfDirective';
import { PrintDirective } from './PrintDirective';
import { RemDirective } from './RemDirective';

export abstract class Directive extends Node {
    numberSign: NumberSignToken = undefined!;
}

export type Directives =
    | AssignmentDirective
    | ErrorDirective
    | IfDirective
    | PrintDirective
    | RemDirective
    ;
