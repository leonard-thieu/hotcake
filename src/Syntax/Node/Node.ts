import { ArrayTypeAnnotation } from './ArrayTypeAnnotation';
import { CommaSeparator } from './CommaSeparator';
import { ConfigurationTag } from './ConfigurationTag';
import { Declarations } from './Declaration/Declaration';
import { Directives } from './Directive/Directive';
import { ElseDirective, ElseIfDirective } from './Directive/IfDirective';
import { Expressions } from './Expression/Expression';
import { EscapedIdentifier } from './Identifier';
import { ModulePath } from './ModulePath';
import { NodeKind } from './NodeKind';
import { ElseClause, ElseIfClause } from './Statement/IfStatement';
import { CaseClause, DefaultClause } from './Statement/SelectStatement';
import { Statements } from './Statement/Statement';
import { CatchClause } from './Statement/TryStatement';
import { TypeAnnotation } from './TypeAnnotation';
import { TypeReference } from './TypeReference';

export abstract class Node {
    abstract readonly kind: NodeKind = undefined!;
    parent?: Nodes = undefined;
}

export type Nodes =
    | Declarations
    | Directives
    | ElseIfDirective | ElseDirective
    | Expressions
    | Statements
    | ConfigurationTag
    | ElseIfClause | ElseClause
    | CaseClause | DefaultClause
    | CatchClause
    | ArrayTypeAnnotation
    | TypeAnnotation
    | CommaSeparator
    | EscapedIdentifier
    | ModulePath
    | TypeReference
    ;
