import { BoundTreeWalker } from './Binding/BoundTreeWalker';
import { BoundNodes } from './Binding/Node/BoundNodes';
import { EscapedIdentifier } from './Syntax/Node/Identifier';
import { NodeKind } from './Syntax/Node/Nodes';
import { MissingToken } from './Syntax/Token/MissingToken';
import { TokenKind, Tokens } from './Syntax/Token/Tokens';

export function assertNever(x: never): never {
    throw new Error(`Unexpected object: ${x}`);
}

export function getText(identifier: EscapedIdentifier | Tokens | MissingToken, node: BoundNodes) {
    const { document } = BoundTreeWalker.getModule(node).declaration;

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

export function areElementsSame<T1, T2>(arr1: T1[], arr2: T2[], compare: ((e1: T1, e2: T2) => boolean)) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (!compare(arr1[i], arr2[i])) {
            return false;
        }
    }

    return true;
}
