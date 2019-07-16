import { DeclarationReferenceIdentifier } from '../../../Syntax/Node/Declaration/AliasDirectiveSequence';
import { EscapedIdentifier } from '../../../Syntax/Node/Identifier';
import { IdentifierToken } from '../../../Syntax/Token/Token';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';

export class BoundAliasDirective extends BoundNode {
    readonly kind = BoundNodeKind.AliasDirective;

    moduleIdentifier?: IdentifierToken = undefined;
    typeIdentifier?: EscapedIdentifier | IdentifierToken = undefined;
    target: DeclarationReferenceIdentifier = undefined!;
}
