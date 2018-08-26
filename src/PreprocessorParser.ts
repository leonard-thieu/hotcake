import assert = require('assert');

import { assertNever } from './assertNever';
import { AssignmentDirective } from './Node/Directive/AssignmentDirective';
import { Directive, Directives } from './Node/Directive/Directive';
import { ElseDirective } from './Node/Directive/ElseDirective';
import { ElseIfDirective } from './Node/Directive/ElseIfDirective';
import { EndDirective } from './Node/Directive/EndDirective';
import { ErrorDirective } from './Node/Directive/ErrorDirective';
import { IfDirective } from './Node/Directive/IfDirective';
import { PrintDirective } from './Node/Directive/PrintDirective';
import { RemDirective } from './Node/Directive/RemDirective';
import { Expression } from './Node/Expression/Expression';
import { Node } from './Node/Node';
import { PreprocessorModule } from './Node/PreprocessorModule';
import { ParseListElementFn, ParserBase } from './ParserBase';
import { PreprocessorParseContext } from './PreprocessorParseContext';
import { PreprocessorTokenizer } from './PreprocessorTokenizer';
import { SkippedToken } from './SkippedToken';
import { Token } from './Token';
import { TokenKind } from "./TokenKind";

export class PreprocessorParser extends ParserBase {
    parse(document: string): PreprocessorModule {
        const lexer = new PreprocessorTokenizer();

        this.tokens = lexer.getTokens(document);
        this.position = 0;

        return this.parseModule();
    }

    private parseModule(): PreprocessorModule {
        const preprocessorModule = new PreprocessorModule();
        preprocessorModule.members.push(...this.parseList(preprocessorModule, PreprocessorParseContext.ModuleMembers) as Array<Directives | Token>);
        preprocessorModule.eofToken = this.eat(TokenKind.EOF);

        return preprocessorModule;
    }

    // #region Directives

    private assertExpressionParsedCompletely(): void {
        const token = this.getCurrentToken();

        assert([
            TokenKind.Newline,
            TokenKind.EOF,
        ].includes(token.kind), TokenKind[token.kind]);
    }

    private parseIfDirective(parent: Node): IfDirective {
        const ifDirective = new IfDirective();
        ifDirective.parent = parent;
        ifDirective.ifDirectiveKeyword = this.eat(TokenKind.IfDirectiveKeyword);
        ifDirective.expression = this.parseExpression(ifDirective);
        this.assertExpressionParsedCompletely();

        ifDirective.members.push(...this.parseList(ifDirective, PreprocessorParseContext.IfDirectiveMembers) as Array<Directives | Token>);
        while (this.getCurrentToken().kind === TokenKind.ElseIfDirectiveKeyword) {
            ifDirective.elseIfDirectives.push(this.parseElseIfDirective(ifDirective));
        }

        if (this.getCurrentToken().kind === TokenKind.ElseDirectiveKeyword) {
            ifDirective.elseDirective = this.parseElseDirective(ifDirective);
        }

        ifDirective.endDirective = this.parseEndDirective(ifDirective);

        return ifDirective;
    }

    private parseElseIfDirective(parent: IfDirective): ElseIfDirective {
        const elseIfDirective = new ElseIfDirective();
        elseIfDirective.parent = parent;
        elseIfDirective.elseIfDirectiveKeyword = this.eat(TokenKind.ElseIfDirectiveKeyword);
        elseIfDirective.expression = this.parseExpression(elseIfDirective);
        this.assertExpressionParsedCompletely();

        elseIfDirective.members.push(...this.parseList(elseIfDirective, PreprocessorParseContext.IfDirectiveMembers) as Array<Directives | Token>);

        return elseIfDirective;
    }

    private parseElseDirective(parent: IfDirective): ElseDirective {
        const elseDirective = new ElseDirective();
        elseDirective.parent = parent;
        elseDirective.elseDirectiveKeyword = this.eat(TokenKind.ElseDirectiveKeyword);
        elseDirective.members.push(...this.parseList(elseDirective, PreprocessorParseContext.IfDirectiveMembers) as Array<Directives | Token>);

        return elseDirective;
    }

    private parseEndDirective(parent: Directive): EndDirective {
        const endDirective = new EndDirective();
        endDirective.parent = parent;
        endDirective.endDirectiveKeyword = this.eat(TokenKind.EndDirectiveKeyword);

        return endDirective;
    }

    private parseRemDirective(parent: Node): RemDirective {
        const remDirective = new RemDirective();
        remDirective.parent = parent;
        remDirective.remDirectiveKeyword = this.eat(TokenKind.RemDirectiveKeyword);
        remDirective.children.push(...this.parseList(remDirective, PreprocessorParseContext.RemDirectiveMembers) as Array<RemDirective | IfDirective | Token>);
        remDirective.endDirective = this.parseEndDirective(remDirective);

        return remDirective;
    }

    private parsePrintDirective(parent: Node): PrintDirective {
        const printDirective = new PrintDirective();
        printDirective.parent = parent;
        printDirective.printDirectiveKeyword = this.eat(TokenKind.PrintDirectiveKeyword);
        printDirective.expression = this.parseExpression(printDirective);
        this.assertExpressionParsedCompletely();

        return printDirective;
    }

    private parseErrorDirective(parent: Node): ErrorDirective {
        const errorDirective = new ErrorDirective();
        errorDirective.parent = parent;
        errorDirective.errorDirectiveKeyword = this.eat(TokenKind.ErrorDirectiveKeyword);
        errorDirective.expression = this.parseExpression(errorDirective);
        this.assertExpressionParsedCompletely();

        return errorDirective;
    }

    private parseAssignmentDirective(parent: Node): AssignmentDirective {
        const assignmentDirective = new AssignmentDirective();
        assignmentDirective.parent = parent;
        assignmentDirective.name = this.eat(TokenKind.ConfigurationVariable);
        assignmentDirective.operator = this.eat(TokenKind.EqualsSign, TokenKind.PlusSignEqualsSign);
        assignmentDirective.expression = this.parseExpression(assignmentDirective);

        return assignmentDirective;
    }

    // #endregion

    // #region Core

    private currentParseContext: PreprocessorParseContext;

    private parseList(parent: Node, parseContext: PreprocessorParseContext): Array<Expression | Token> {
        const savedParseContext = this.currentParseContext;
        this.currentParseContext |= parseContext;

        const parseListElementFn = this.getParseListElementFn(parseContext).bind(this);

        const nodes: Array<Expression | Token> = [];
        while (!this.isCurrentTokenListTerminator(parseContext)) {
            if (this.isCurrentTokenValidListElement(parseContext)) {
                const element = parseListElementFn(parent);
                nodes.push(element);

                continue;
            }

            if (this.isCurrentTokenValidInEnclosingContexts()) {
                break;
            }

            const token = new SkippedToken(this.getCurrentToken());
            nodes.push(token);
            this.advanceToken();
        }

        this.currentParseContext = savedParseContext;

        return nodes;
    }

    private getParseListElementFn(parseContext: PreprocessorParseContext): ParseListElementFn {
        switch (parseContext) {
            case PreprocessorParseContext.ModuleMembers:
            case PreprocessorParseContext.IfDirectiveMembers: {
                return this.parseModuleMember;
            }
            case PreprocessorParseContext.RemDirectiveMembers: {
                return this.parseRemDirectiveMember;
            }
        }

        return assertNever(parseContext);
    }

    private parseModuleMember(parent: Node): Directives | Token {
        const token = this.getCurrentToken();
        switch (token.kind) {
            case TokenKind.IfDirectiveKeyword: {
                return this.parseIfDirective(parent);
            }
            case TokenKind.RemDirectiveKeyword: {
                return this.parseRemDirective(parent);
            }
            case TokenKind.PrintDirectiveKeyword: {
                return this.parsePrintDirective(parent);
            }
            case TokenKind.ErrorDirectiveKeyword: {
                return this.parseErrorDirective(parent);
            }
            case TokenKind.ConfigurationVariable: {
                return this.parseAssignmentDirective(parent);
            }
        }

        this.advanceToken();

        return token;
    }

    private parseRemDirectiveMember(parent: Node): IfDirective | RemDirective | Token {
        const token = this.getCurrentToken();
        switch (token.kind) {
            case TokenKind.IfDirectiveKeyword: {
                return this.parseIfDirective(parent);
            }
            case TokenKind.RemDirectiveKeyword: {
                return this.parseRemDirective(parent);
            }
            case TokenKind.RemDirectiveBody: {
                this.advanceToken();

                return token;
            }
        }

        throw new Error(`Unexpected token: ${TokenKind[token.kind] || token.kind}`);
    }

    private isCurrentTokenListTerminator(parseContext: PreprocessorParseContext): boolean {
        const token = this.getCurrentToken();
        if (token.kind === TokenKind.EOF) {
            return true;
        }

        switch (parseContext) {
            case PreprocessorParseContext.ModuleMembers: {
                return false;
            }
            case PreprocessorParseContext.IfDirectiveMembers: {
                switch (token.kind) {
                    case TokenKind.ElseIfDirectiveKeyword:
                    case TokenKind.ElseDirectiveKeyword:
                    case TokenKind.EndDirectiveKeyword: {
                        return true;
                    }
                }

                return false;
            }
            case PreprocessorParseContext.RemDirectiveMembers: {
                return token.kind === TokenKind.EndDirectiveKeyword;
            }
        }

        return assertNever(parseContext);
    }

    private isCurrentTokenValidListElement(parseContext: PreprocessorParseContext): boolean {
        switch (parseContext) {
            case PreprocessorParseContext.ModuleMembers:
            case PreprocessorParseContext.IfDirectiveMembers: {
                return true;
            }
            case PreprocessorParseContext.RemDirectiveMembers: {
                const token = this.getCurrentToken();
                switch (token.kind) {
                    case TokenKind.IfDirectiveKeyword:
                    case TokenKind.RemDirectiveKeyword:
                    case TokenKind.RemDirectiveBody: {
                        return true;
                    }
                }

                return false;
            }
        }

        return assertNever(parseContext);
    }

    private isCurrentTokenValidInEnclosingContexts(): boolean {
        for (let i = 0; i < 32; i++) {
            const parseContext = 1 << i;
            if (this.isInParseContext(parseContext)) {
                if (this.isCurrentTokenValidListElement(parseContext) ||
                    this.isCurrentTokenListTerminator(parseContext)) {
                    return true;
                }
            }
        }

        return false;
    }

    private isInParseContext(parseContext: number): boolean {
        return (this.currentParseContext & parseContext) === 1;
    }

    // #endregion
}
