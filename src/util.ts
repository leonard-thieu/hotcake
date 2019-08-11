import { BoundTreeWalker } from './Binding/BoundTreeWalker';
import { BoundNodeKind, BoundNodes } from './Binding/Node/BoundNodes';
import { EscapedIdentifier } from './Syntax/Node/Identifier';
import { NodeKind } from './Syntax/Node/Nodes';
import { MissingToken } from './Syntax/Token/MissingToken';
import { TokenKind, Tokens } from './Syntax/Token/Tokens';

export function assertNever(x: never): never {
    throw new Error(`Unexpected object: ${x}`);
}

export function getText(identifier: EscapedIdentifier | Tokens | MissingToken, node: BoundNodes) {
    const { document } = BoundTreeWalker.getClosest(node, BoundNodeKind.ModuleDeclaration)!.declaration;

    switch (identifier.kind) {
        case NodeKind.EscapedIdentifier: {
            return identifier.name.getText(document);
        }
        case TokenKind.Missing: {
            throw new Error(`Missing identifier.`);
        }
        default: {
            return identifier.getText(document);
        }
    }
}
