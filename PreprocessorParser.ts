import { ModuleNode } from "./Node";
import { PreprocessorTokenizer } from "./PreprocessorTokenizer";
import { PreprocessorToken, PreprocessorTokenKind } from "./PreprocessorToken";
import { SkippedToken } from "./SkippedToken";

export class PreprocessorParser {
    private tokens: PreprocessorToken[] = [];
    private position: number = 0;

    parse(input: string): ModuleNode {
        const tokenizer = new PreprocessorTokenizer(input);

        this.tokens.length = 0;
        this.position = 0;
        let t: PreprocessorToken;
        do {
            t = tokenizer.next();
            this.tokens.push(t);
        } while (t.kind !== PreprocessorTokenKind.EOF);

        return this.parseModule();
    }

    parseModule(): ModuleNode {
        const moduleNode = new ModuleNode();

        let t: PreprocessorToken;
        while ((t = this.getCurrentToken()).kind !== PreprocessorTokenKind.EOF) {
            switch (t.kind) {
                default:
                    t = new SkippedToken(t);
                    moduleNode.children.push(t);
                    this.advanceToken();
                    break;
            }
        }

        moduleNode.eofToken = t;

        return moduleNode;
    }

    private getCurrentToken(): PreprocessorToken {
        return this.tokens[this.position];
    }

    private advanceToken(): void {
        if (this.position < this.tokens.length) {
            this.position++;            
        }
    }
}