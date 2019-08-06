import { NumberSignToken } from '../../Token/Tokens';
import { Node } from '../Nodes';
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
