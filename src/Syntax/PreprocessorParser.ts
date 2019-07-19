import { PreprocessorModuleDeclaration } from './Node/Declaration/PreprocessorModuleDeclaration';
import { AssignmentDirective } from './Node/Directive/AssignmentDirective';
import { ErrorDirective } from './Node/Directive/ErrorDirective';
import { ElseDirective, ElseIfDirective, IfDirective } from './Node/Directive/IfDirective';
import { PrintDirective } from './Node/Directive/PrintDirective';
import { RemDirective } from './Node/Directive/RemDirective';
import { Nodes } from './Node/Node';
import { ParseContextElementMapBase, ParseContextKind, ParserBase } from './ParserBase';
import { ConfigurationVariableToken, ElseDirectiveKeywordToken, ElseIfDirectiveKeywordToken, ErrorDirectiveKeywordToken, IfDirectiveKeywordToken, NumberSignToken, PrintDirectiveKeywordToken, RemDirectiveKeywordToken, Tokens } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export class PreprocessorParser extends ParserBase {
    parse(filePath: string, document: string, tokens: Tokens[]): PreprocessorModuleDeclaration {
        this.tokens = [...tokens]
        this.position = 0;
        this.parseContexts = [];

        return this.parsePreprocessorModuleDeclaration(filePath, document);
    }

    // #region Preprocessor module declaration

    private parsePreprocessorModuleDeclaration(filePath: string, document: string): PreprocessorModuleDeclaration {
        const preprocessorModuleDeclaration = new PreprocessorModuleDeclaration();
        preprocessorModuleDeclaration.filePath = filePath;
        preprocessorModuleDeclaration.document = document;

        preprocessorModuleDeclaration.members = this.parseList(ParseContextKind.PreprocessorModuleDeclaration, preprocessorModuleDeclaration);
        // Guaranteed by tokenizer and parser.
        preprocessorModuleDeclaration.eofToken = this.eat(TokenKind.EOF);

        return preprocessorModuleDeclaration;
    }

    // #region Preprocessor module declaration members

    private isPreprocessorModuleDeclarationMembersListTerminator(): boolean {
        return false;
    }

    private isPreprocessorModuleDeclarationMemberStart(): boolean {
        return true;
    }

    private parsePreprocessorModuleDeclarationMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.NumberSign: {
                const nextToken = this.getToken(1);
                switch (nextToken.kind) {
                    case TokenKind.IfDirectiveKeyword: {
                        this.advanceToken();
                        this.advanceToken();

                        return this.parseIfDirective(parent, token, nextToken);
                    }
                    case TokenKind.RemDirectiveKeyword: {
                        this.advanceToken();
                        this.advanceToken();

                        return this.parseRemDirective(parent, token, nextToken);
                    }
                    case TokenKind.PrintDirectiveKeyword: {
                        this.advanceToken();
                        this.advanceToken();

                        return this.parsePrintDirective(parent, token, nextToken);
                    }
                    case TokenKind.ErrorDirectiveKeyword: {
                        this.advanceToken();
                        this.advanceToken();

                        return this.parseErrorDirective(parent, token, nextToken);
                    }
                    case TokenKind.ConfigurationVariable: {
                        this.advanceToken();
                        this.advanceToken();

                        return this.parseAssignmentDirective(parent, token, nextToken);
                    }
                }
                break;
            }
        }

        this.advanceToken();

        return token;
    }

    // #endregion

    // #endregion

    // #region If directive

    private parseIfDirective(parent: Nodes, numberSign: NumberSignToken, ifDirectiveKeyword: IfDirectiveKeywordToken): IfDirective {
        const ifDirective = new IfDirective();
        ifDirective.parent = parent;
        ifDirective.numberSign = numberSign;
        ifDirective.ifDirectiveKeyword = ifDirectiveKeyword;
        ifDirective.expression = this.parseExpression(ifDirective);
        ifDirective.members = this.parseList(ParseContextKind.IfDirective, ifDirective);
        ifDirective.elseIfDirectives = this.parseList(ParseContextKind.ElseIfDirectiveList, ifDirective);

        const elseDirectiveNumberSign = this.getToken();
        const elseDirectiveKeyword = this.getToken(1);
        if (elseDirectiveNumberSign.kind === TokenKind.NumberSign &&
            elseDirectiveKeyword.kind === TokenKind.ElseDirectiveKeyword
        ) {
            this.advanceToken();
            this.advanceToken();

            ifDirective.elseDirective = this.parseElseDirective(ifDirective, elseDirectiveNumberSign, elseDirectiveKeyword);
        }

        ifDirective.endDirectiveNumberSign = this.eatMissable(TokenKind.NumberSign);
        ifDirective.endDirectiveKeyword = this.eatMissable(TokenKind.EndDirectiveKeyword);
        if (ifDirective.endDirectiveKeyword.kind === TokenKind.EndDirectiveKeyword) {
            ifDirective.endIfDirectiveKeyword = this.eatOptional(TokenKind.IfDirectiveKeyword);
        }

        return ifDirective;
    }

    // #region ElseIf directive list members

    private isElseIfDirectiveListTerminator(token: Tokens): boolean {
        return !this.isElseIfDirectiveListMemberStart(token);
    }

    private isElseIfDirectiveListMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.NumberSign: {
                const nextToken = this.getToken(1);
                switch (nextToken.kind) {
                    case TokenKind.ElseIfDirectiveKeyword: {
                        return true;
                    }
                    case TokenKind.ElseDirectiveKeyword: {
                        const nextNextToken = this.getToken(2);
                        switch (nextNextToken.kind) {
                            case TokenKind.IfDirectiveKeyword: {
                                return true;
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }

        return false;
    }

    private parseElseIfDirectiveListMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.NumberSign: {
                const nextToken = this.getToken(1);
                switch (nextToken.kind) {
                    case TokenKind.ElseIfDirectiveKeyword: {
                        this.advanceToken();
                        this.advanceToken();

                        return this.parseElseIfDirective(parent, token, nextToken);
                    }
                    case TokenKind.ElseDirectiveKeyword: {
                        const nextNextToken = this.getToken(2);
                        switch (nextNextToken.kind) {
                            case TokenKind.IfDirectiveKeyword: {
                                this.advanceToken();
                                this.advanceToken();
                                this.advanceToken();

                                return this.parseElseIfDirective(parent, token, nextToken, nextNextToken);
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }

        return this.parseCore(parent, token);
    }

    private parseElseIfDirective(
        parent: Nodes,
        numberSign: NumberSignToken,
        elseIfDirectiveKeyword: ElseIfDirectiveKeywordToken | ElseDirectiveKeywordToken,
        ifDirectiveKeyword?: IfDirectiveKeywordToken,
    ): ElseIfDirective {
        const elseIfDirective = new ElseIfDirective();
        elseIfDirective.parent = parent;
        elseIfDirective.numberSign = numberSign;
        elseIfDirective.elseIfDirectiveKeyword = elseIfDirectiveKeyword;
        elseIfDirective.ifDirectiveKeyword = ifDirectiveKeyword;
        elseIfDirective.expression = this.parseExpression(elseIfDirective);
        elseIfDirective.members = this.parseList(ParseContextKind.ElseIfDirective, elseIfDirective);

        return elseIfDirective;
    }

    // #endregion

    private parseElseDirective(parent: IfDirective, numberSign: NumberSignToken, elseDirectiveKeyword: ElseDirectiveKeywordToken): ElseDirective {
        const elseDirective = new ElseDirective();
        elseDirective.parent = parent;
        elseDirective.numberSign = numberSign;
        elseDirective.elseDirectiveKeyword = elseDirectiveKeyword;
        elseDirective.members = this.parseList(ParseContextKind.ElseDirective, elseDirective);

        return elseDirective;
    }

    private isIfOrElseIfOrElseDirectiveMembersListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.NumberSign: {
                const nextToken = this.getToken(1);
                switch (nextToken.kind) {
                    case TokenKind.ElseIfDirectiveKeyword:
                    case TokenKind.ElseDirectiveKeyword:
                    case TokenKind.EndDirectiveKeyword: {
                        return true;
                    }
                }
                break;
            }
        }

        return false;
    }

    // #endregion

    // #region Rem directive

    private parseRemDirective(parent: Nodes, numberSign: NumberSignToken, remDirectiveKeyword: RemDirectiveKeywordToken): RemDirective {
        const remDirective = new RemDirective();
        remDirective.parent = parent;
        remDirective.numberSign = numberSign;
        remDirective.remDirectiveKeyword = remDirectiveKeyword;
        remDirective.children = this.parseListWithSkippedTokens(ParseContextKind.RemDirective, remDirective);
        remDirective.endDirectiveNumberSign = this.eatMissable(TokenKind.NumberSign);
        remDirective.endDirectiveKeyword = this.eatMissable(TokenKind.EndDirectiveKeyword);
        if (remDirective.endDirectiveKeyword.kind === TokenKind.EndDirectiveKeyword) {
            remDirective.endIfDirectiveKeyword = this.eatOptional(TokenKind.IfDirectiveKeyword);
        }

        return remDirective;
    }

    // #region Rem directive members

    private isRemDirectiveMembersListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.NumberSign: {
                const nextToken = this.getToken(1);
                switch (nextToken.kind) {
                    case TokenKind.EndDirectiveKeyword: {
                        return true;
                    }
                }
                break;
            }
        }

        return false;
    }

    private isRemDirectiveMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.NumberSign: {
                const nextToken = this.getToken(1);
                switch (nextToken.kind) {
                    case TokenKind.IfDirectiveKeyword:
                    case TokenKind.RemDirectiveKeyword: {
                        return true;
                    }
                }
                break;
            }
            case TokenKind.RemDirectiveBody: {
                return true;
            }
        }

        return false;
    }

    private parseRemDirectiveMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.NumberSign: {
                const nextToken = this.getToken(1);
                switch (nextToken.kind) {
                    case TokenKind.IfDirectiveKeyword: {
                        this.advanceToken();
                        this.advanceToken();

                        return this.parseIfDirective(parent, token, nextToken);
                    }
                    case TokenKind.RemDirectiveKeyword: {
                        this.advanceToken();
                        this.advanceToken();

                        return this.parseRemDirective(parent, token, nextToken);
                    }
                }
                break;
            }
            case TokenKind.RemDirectiveBody: {
                this.advanceToken();

                return token;
            }
        }

        return this.parseCore(parent, token);
    }

    // #endregion

    // #endregion

    // #region Print directive

    private parsePrintDirective(parent: Nodes, numberSign: NumberSignToken, printDirectiveKeyword: PrintDirectiveKeywordToken): PrintDirective {
        const printDirective = new PrintDirective();
        printDirective.parent = parent;
        printDirective.numberSign = numberSign;
        printDirective.printDirectiveKeyword = printDirectiveKeyword;
        printDirective.expression = this.parseExpression(printDirective);

        return printDirective;
    }

    // #endregion

    // #region Error directive

    private parseErrorDirective(parent: Nodes, numberSign: NumberSignToken, errorDirectiveKeyword: ErrorDirectiveKeywordToken): ErrorDirective {
        const errorDirective = new ErrorDirective();
        errorDirective.parent = parent;
        errorDirective.numberSign = numberSign;
        errorDirective.errorDirectiveKeyword = errorDirectiveKeyword;
        errorDirective.expression = this.parseExpression(errorDirective);

        return errorDirective;
    }

    // #endregion

    // #region Assignment directive

    private parseAssignmentDirective(parent: Nodes, numberSign: NumberSignToken, name: ConfigurationVariableToken): AssignmentDirective {
        const assignmentDirective = new AssignmentDirective();
        assignmentDirective.parent = parent;
        assignmentDirective.numberSign = numberSign;
        assignmentDirective.name = name;
        assignmentDirective.operator = this.eatMissable(TokenKind.EqualsSign, TokenKind.PlusSignEqualsSign);
        assignmentDirective.expression = this.parseExpression(assignmentDirective);

        return assignmentDirective;
    }

    // #endregion

    // #region Core

    // #region Parse lists

    protected isListTerminator(parseContext: PreprocessorParserParseContext, token: Tokens): boolean {
        if (token.kind === TokenKind.EOF) {
            return true;
        }

        switch (parseContext) {
            case ParseContextKind.PreprocessorModuleDeclaration: {
                return this.isPreprocessorModuleDeclarationMembersListTerminator();
            }
            case ParseContextKind.IfDirective:
            case ParseContextKind.ElseIfDirective:
            case ParseContextKind.ElseDirective: {
                return this.isIfOrElseIfOrElseDirectiveMembersListTerminator(token);
            }
            case ParseContextKind.RemDirective: {
                return this.isRemDirectiveMembersListTerminator(token);
            }
            case ParseContextKind.ElseIfDirectiveList: {
                return this.isElseIfDirectiveListTerminator(token);
            }
        }

        return super.isListTerminatorCore(parseContext, token);
    }

    protected isValidListElement(parseContext: PreprocessorParserParseContext, token: Tokens): boolean {
        switch (parseContext) {
            case ParseContextKind.PreprocessorModuleDeclaration:
            case ParseContextKind.IfDirective:
            case ParseContextKind.ElseIfDirective:
            case ParseContextKind.ElseDirective: {
                return this.isPreprocessorModuleDeclarationMemberStart();
            }
            case ParseContextKind.RemDirective: {
                return this.isRemDirectiveMemberStart(token);
            }
            case ParseContextKind.ElseIfDirectiveList: {
                return this.isElseIfDirectiveListMemberStart(token);
            }
        }

        return super.isValidListElementCore(parseContext, token);
    }

    protected parseListElement(parseContext: PreprocessorParserParseContext, parent: Nodes) {
        switch (parseContext) {
            case ParseContextKind.PreprocessorModuleDeclaration:
            case ParseContextKind.IfDirective:
            case ParseContextKind.ElseIfDirective:
            case ParseContextKind.ElseDirective: {
                return this.parsePreprocessorModuleDeclarationMember(parent);
            }
            case ParseContextKind.RemDirective: {
                return this.parseRemDirectiveMember(parent);
            }
            case ParseContextKind.ElseIfDirectiveList: {
                return this.parseElseIfDirectiveListMember(parent);
            }
        }

        return this.parseListElementCore(parseContext, parent);
    }

    // #endregion

    protected isInvokeExpressionStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.OpeningParenthesis: {
                return true;
            }
        }

        return false;
    }

    // #endregion
}

// #region Parse contexts

interface PreprocessorParserParseContextElementMap extends ParseContextElementMapBase {
    [ParseContextKind.PreprocessorModuleDeclaration]: ReturnType<PreprocessorParser['parsePreprocessorModuleDeclarationMember']>;
    [ParseContextKind.IfDirective]: ReturnType<PreprocessorParser['parsePreprocessorModuleDeclarationMember']>;
    [ParseContextKind.ElseIfDirectiveList]: ReturnType<PreprocessorParser['parseElseIfDirectiveListMember']>;
    [ParseContextKind.ElseIfDirective]: ReturnType<PreprocessorParser['parsePreprocessorModuleDeclarationMember']>;
    [ParseContextKind.ElseDirective]: ReturnType<PreprocessorParser['parsePreprocessorModuleDeclarationMember']>;
    [ParseContextKind.RemDirective]: ReturnType<PreprocessorParser['parseRemDirectiveMember']>;
}

type PreprocessorParserParseContext = keyof PreprocessorParserParseContextElementMap;

const _ParseContextKind: { -readonly [P in keyof typeof ParseContextKind]: typeof ParseContextKind[P]; } = ParseContextKind;
_ParseContextKind.ElseIfDirectiveList = 'ElseIfDirectiveList' as ParseContextKind.ElseIfDirectiveList;
_ParseContextKind.PreprocessorModuleDeclaration = 'PreprocessorModuleDeclaration' as ParseContextKind.PreprocessorModuleDeclaration;
_ParseContextKind.IfDirective = 'IfDirective' as ParseContextKind.IfDirective;
_ParseContextKind.ElseIfDirectiveList = 'ElseIfDirectiveList' as ParseContextKind.ElseIfDirectiveList;
_ParseContextKind.ElseIfDirective = 'ElseIfDirective' as ParseContextKind.ElseIfDirective;
_ParseContextKind.ElseDirective = 'ElseDirective' as ParseContextKind.ElseDirective;
_ParseContextKind.RemDirective = 'RemDirective' as ParseContextKind.RemDirective;

declare module './ParserBase' {
    enum ParseContextKind {
        PreprocessorModuleDeclaration = 'PreprocessorModuleDeclaration',
        IfDirective = 'IfDirective',
        ElseIfDirectiveList = 'ElseIfDirectiveList',
        ElseIfDirective = 'ElseIfDirective',
        ElseDirective = 'ElseDirective',
        RemDirective = 'RemDirective',
    }

    interface ParseContextElementMap extends PreprocessorParserParseContextElementMap { }
}

// #endregion
