import { assertNever } from './assertNever';
import { CommaSeparator } from './Node/CommaSeparator';
import { DataDeclaration } from './Node/DataDeclaration';
import { AccessibilityDirective } from './Node/Declaration/AccessibilityDirective';
import { AliasDirective } from './Node/Declaration/AliasDirective';
import { ClassDeclaration } from './Node/Declaration/ClassDeclaration';
import { ClassMethodDeclaration } from './Node/Declaration/ClassMethodDeclaration';
import { DataDeclarationList } from './Node/Declaration/DataDeclarationList';
import { FriendDirective } from './Node/Declaration/FriendDirective';
import { FunctionDeclaration } from './Node/Declaration/FunctionDeclaration';
import { ImportStatement } from './Node/Declaration/ImportStatement';
import { InterfaceDeclaration } from './Node/Declaration/InterfaceDeclaration';
import { InterfaceMethodDeclaration } from './Node/Declaration/InterfaceMethodDeclaration';
import { ModuleDeclaration } from './Node/Declaration/ModuleDeclaration';
import { StrictDirective } from './Node/Declaration/StrictDirective';
import { BinaryExpression } from './Node/Expression/BinaryExpression';
import { ModulePath } from './Node/ModulePath';
import { Node } from './Node/Node';
import { NodeKind } from './Node/NodeKind';
import { QualifiedIdentifier } from './Node/QualifiedIdentifier';
import { ContinueStatement } from './Node/Statement/ContinueStatement';
import { EmptyStatement } from './Node/Statement/EmptyStatement';
import { ExitStatement } from './Node/Statement/ExitStatement';
import { ExpressionStatement } from './Node/Statement/ExpressionStatement';
import { ForLoop, NumericForLoopHeader } from './Node/Statement/ForLoop';
import { ElseIfStatement, ElseStatement, IfStatement } from './Node/Statement/IfStatement';
import { LocalDeclarationListStatement } from './Node/Statement/LocalDeclarationListStatement';
import { RepeatLoop } from './Node/Statement/RepeatLoop';
import { ReturnStatement } from './Node/Statement/ReturnStatement';
import { CaseStatement, DefaultStatement, SelectStatement } from './Node/Statement/SelectStatement';
import { ThrowStatement } from './Node/Statement/ThrowStatement';
import { CatchStatement, TryStatement } from './Node/Statement/TryStatement';
import { WhileLoop } from './Node/Statement/WhileLoop';
import { TypeParameter } from './Node/TypeParameter';
import { ParserBase } from './ParserBase';
import { SkippedToken } from './Token/SkippedToken';
import { Token } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export class Parser extends ParserBase {
    parse(filePath: string, document: string, tokens: Token[]): ModuleDeclaration {
        this.tokens = [...tokens];
        this.position = 0;
        this.parseContexts = [];

        return this.parseModuleDeclaration(filePath, document);
    }

    private parseModuleDeclaration(filePath: string, document: string): ModuleDeclaration {
        const moduleDeclaration = new ModuleDeclaration();
        moduleDeclaration.filePath = filePath;
        moduleDeclaration.document = document;

        moduleDeclaration.members = this.parseList(moduleDeclaration, moduleDeclaration.kind);

        return moduleDeclaration;
    }

    // #region Module members

    private isModuleMembersListTerminator(): boolean {
        return false;
    }

    private isModuleMemberStart(token: Token): boolean {
        switch (token.kind) {
            case TokenKind.StrictKeyword:
            case TokenKind.ImportKeyword:
            case TokenKind.FriendKeyword:
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ExternKeyword:
            case TokenKind.AliasKeyword:
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FunctionKeyword:
            case TokenKind.InterfaceKeyword:
            case TokenKind.ClassKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseModuleMember(parent: Node) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.StrictKeyword: {
                return this.parseStrictDirective(parent);
            }
            case TokenKind.ImportKeyword: {
                return this.parseImportStatement(parent);
            }
            case TokenKind.FriendKeyword: {
                return this.parseFriendDirective(parent);
            }
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ExternKeyword: {
                return this.parseAccessibilityDirective(parent);
            }
            case TokenKind.AliasKeyword: {
                return this.parseAliasDirective(parent);
            }
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword: {
                return this.parseDataDeclarationList(parent);
            }
            case TokenKind.FunctionKeyword: {
                return this.parseFunctionDeclaration(parent);
            }
            case TokenKind.InterfaceKeyword: {
                return this.parseInterfaceDeclaration(parent);
            }
            case TokenKind.ClassKeyword: {
                return this.parseClassDeclaration(parent);
            }
        }

        return this.parseCore(parent);
    }

    private parseStrictDirective(parent: Node): StrictDirective {
        const strictDirective = new StrictDirective();
        strictDirective.parent = parent;
        strictDirective.strictKeyword = this.eat(TokenKind.StrictKeyword);

        return strictDirective;
    }

    private parseImportStatement(parent: Node): ImportStatement {
        const importStatement = new ImportStatement();
        importStatement.parent = parent;
        importStatement.importKeyword = this.eat(TokenKind.ImportKeyword);
        if (this.getToken().kind === TokenKind.QuotationMark) {
            importStatement.nativeFilePath = this.parseStringLiteral(importStatement);
        } else {
            importStatement.modulePath = this.parseModulePath(importStatement);
        }

        return importStatement;
    }

    private parseFriendDirective(parent: Node): FriendDirective {
        const friendDirective = new FriendDirective();
        friendDirective.parent = parent;
        friendDirective.friendKeyword = this.eat(TokenKind.FriendKeyword);
        friendDirective.modulePath = this.parseModulePath(friendDirective);

        return friendDirective;
    }

    private parseAliasDirective(parent: Node): AliasDirective {
        /**
         * TODO: Comma separated aliases allowed?
         * TODO: Explicit data type declaration allowed?
         */
        const aliasDirective = new AliasDirective();
        aliasDirective.parent = parent;
        aliasDirective.aliasKeyword = this.eat(TokenKind.AliasKeyword);
        aliasDirective.name = this.eat(TokenKind.Identifier);
        aliasDirective.equalsSign = this.eat(TokenKind.EqualsSign);
        aliasDirective.target = this.parseQualifiedIdentifier(aliasDirective);

        return aliasDirective;
    }

    private parseInterfaceDeclaration(parent: Node): InterfaceDeclaration {
        const interfaceDeclaration = new InterfaceDeclaration();
        interfaceDeclaration.parent = parent;
        interfaceDeclaration.interfaceKeyword = this.eat(TokenKind.InterfaceKeyword);
        interfaceDeclaration.name = this.eat(TokenKind.Identifier);
        interfaceDeclaration.extendsKeyword = this.eatOptional(TokenKind.ExtendsKeyword);
        if (interfaceDeclaration.extendsKeyword !== null) {
            interfaceDeclaration.baseTypes = this.parseList(interfaceDeclaration, ParseContextKind.BaseTypes);
        }
        interfaceDeclaration.members = this.parseList(interfaceDeclaration, interfaceDeclaration.kind);
        interfaceDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
        interfaceDeclaration.endInterfaceKeyword = this.eatOptional(TokenKind.InterfaceKeyword);

        return interfaceDeclaration;
    }

    private parseClassDeclaration(parent: Node): ClassDeclaration {
        const classDeclaration = new ClassDeclaration();
        classDeclaration.parent = parent;
        classDeclaration.classKeyword = this.eat(TokenKind.ClassKeyword);
        classDeclaration.name = this.eat(TokenKind.Identifier);

        classDeclaration.lessThanSign = this.eatOptional(TokenKind.LessThanSign);
        if (classDeclaration.lessThanSign !== null) {
            classDeclaration.typeParameters = this.parseList(classDeclaration, ParseContextKind.TypeParameterSequence);
            classDeclaration.greaterThanSign = this.eat(TokenKind.GreaterThanSign);
        }

        classDeclaration.extendsKeyword = this.eatOptional(TokenKind.ExtendsKeyword);
        if (classDeclaration.extendsKeyword !== null) {
            classDeclaration.baseType = this.parseQualifiedIdentifier(classDeclaration);
        }

        classDeclaration.implementsKeyword = this.eatOptional(TokenKind.ImplementsKeyword);
        if (classDeclaration.implementsKeyword !== null) {
            classDeclaration.implementedTypes = this.parseList(classDeclaration, ParseContextKind.BaseTypes);
        }

        while (true) {
            const token = this.getToken();
            if (token.kind !== TokenKind.AbstractKeyword &&
                token.kind !== TokenKind.FinalKeyword) {
                break;
            }
            this.advanceToken();
            classDeclaration.attributes.push(token);
        }

        classDeclaration.members = this.parseList(classDeclaration, classDeclaration.kind);
        classDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
        classDeclaration.endClassKeyword = this.eatOptional(TokenKind.ClassKeyword);

        return classDeclaration;
    }

    // #endregion

    // #region Interface members

    private isInterfaceMembersListTerminator(token: Token): boolean {
        return token.kind === TokenKind.EndKeyword;
    }

    private isInterfaceMemberStart(token: Token): boolean {
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.MethodKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseInterfaceMember(parent: Node) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.ConstKeyword: {
                return this.parseDataDeclarationList(parent);
            }
            case TokenKind.MethodKeyword: {
                return this.parseInterfaceMethodDeclaration(parent);
            }
        }

        return this.parseCore(parent);
    }

    private parseInterfaceMethodDeclaration(parent: Node): InterfaceMethodDeclaration {
        const interfaceMethodDeclaration = new InterfaceMethodDeclaration();
        interfaceMethodDeclaration.parent = parent;
        interfaceMethodDeclaration.methodKeyword = this.eat(TokenKind.MethodKeyword);
        interfaceMethodDeclaration.name = this.eat(TokenKind.Identifier);

        if (this.getToken().kind !== TokenKind.OpeningParenthesis) {
            interfaceMethodDeclaration.colon = this.eatOptional(TokenKind.Colon);
            interfaceMethodDeclaration.returnType = this.parseQualifiedIdentifier(interfaceMethodDeclaration);
        }

        interfaceMethodDeclaration.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        interfaceMethodDeclaration.parameters = this.parseDataDeclarationList(interfaceMethodDeclaration);
        interfaceMethodDeclaration.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);

        return interfaceMethodDeclaration;
    }

    // #endregion

    // #region Class members

    private isClassMembersListTerminator(token: Token): boolean {
        return token.kind === TokenKind.EndKeyword;
    }

    private isClassMemberStart(token: Token): boolean {
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FunctionKeyword:
            case TokenKind.FieldKeyword:
            case TokenKind.MethodKeyword:
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ProtectedKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseClassMember(parent: Node) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FieldKeyword: {
                return this.parseDataDeclarationList(parent);
            }
            case TokenKind.FunctionKeyword: {
                return this.parseFunctionDeclaration(parent);
            }
            case TokenKind.MethodKeyword: {
                return this.parseClassMethodDeclaration(parent);
            }
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ProtectedKeyword: {
                return this.parseAccessibilityDirective(parent);
            }
        }

        return this.parseCore(parent);
    }

    private parseClassMethodDeclaration(parent: Node): ClassMethodDeclaration {
        const classMethodDeclaration = new ClassMethodDeclaration();
        classMethodDeclaration.parent = parent;
        classMethodDeclaration.methodKeyword = this.eat(TokenKind.MethodKeyword);
        classMethodDeclaration.name = this.eat(TokenKind.Identifier);

        if (this.getToken().kind !== TokenKind.OpeningParenthesis) {
            classMethodDeclaration.colon = this.eatOptional(TokenKind.Colon);
            classMethodDeclaration.returnType = this.parseQualifiedIdentifier(classMethodDeclaration);
        }

        classMethodDeclaration.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        classMethodDeclaration.parameters = this.parseDataDeclarationList(classMethodDeclaration);
        classMethodDeclaration.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);

        while (true) {
            const token = this.getToken();
            if (token.kind !== TokenKind.PropertyKeyword &&
                token.kind !== TokenKind.AbstractKeyword &&
                token.kind !== TokenKind.FinalKeyword) {
                break;
            }
            this.advanceToken();
            classMethodDeclaration.attributes.push(token);
        }

        if (classMethodDeclaration.attributes.findIndex(a => a.kind === TokenKind.AbstractKeyword) === -1) {
            classMethodDeclaration.statements = this.parseList(classMethodDeclaration, classMethodDeclaration.kind);
            classMethodDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
            classMethodDeclaration.endMethodKeyword = this.eatOptional(TokenKind.MethodKeyword);
        }

        return classMethodDeclaration;
    }

    // #endregion

    // #region Statements

    private isBlockStatementsListTerminator(token: Token): boolean {
        return token.kind === TokenKind.EndKeyword;
    }

    private isStatementStart(token: Token): boolean {
        switch (token.kind) {
            case TokenKind.LocalKeyword:
            case TokenKind.ReturnKeyword:
            case TokenKind.IfKeyword:
            case TokenKind.SelectKeyword:
            case TokenKind.WhileKeyword:
            case TokenKind.RepeatKeyword:
            case TokenKind.ForKeyword:
            case TokenKind.ContinueKeyword:
            case TokenKind.ExitKeyword:
            case TokenKind.ThrowKeyword:
            case TokenKind.TryKeyword:
            case TokenKind.Newline:
            case TokenKind.Semicolon: {
                return true;
            }
        }

        return this.isExpressionStart(token);
    }

    private parseStatement(parent: Node) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.LocalKeyword: {
                return this.parseLocalDeclarationListStatement(parent);
            }
            case TokenKind.ReturnKeyword: {
                return this.parseReturnStatement(parent);
            }
            case TokenKind.IfKeyword: {
                return this.parseIfStatement(parent);
            }
            case TokenKind.SelectKeyword: {
                return this.parseSelectStatement(parent);
            }
            case TokenKind.CaseKeyword: {
                return this.parseCaseStatement(parent);
            }
            case TokenKind.DefaultKeyword: {
                return this.parseDefaultStatement(parent);
            }
            case TokenKind.WhileKeyword: {
                return this.parseWhileLoop(parent);
            }
            case TokenKind.RepeatKeyword: {
                return this.parseRepeatLoop(parent);
            }
            case TokenKind.ForKeyword: {
                return this.parseForLoop(parent);
            }
            case TokenKind.ContinueKeyword: {
                return this.parseContinueStatement(parent);
            }
            case TokenKind.ExitKeyword: {
                return this.parseExitStatement(parent);
            }
            case TokenKind.ThrowKeyword: {
                return this.parseThrowStatement(parent);
            }
            case TokenKind.TryKeyword: {
                return this.parseTryStatement(parent);
            }
            case TokenKind.Newline:
            case TokenKind.Semicolon: {
                return this.parseEmptyStatement(parent);
            }
        }

        return this.parseExpressionStatement(parent);
    }

    private parseLocalDeclarationListStatement(parent: Node): LocalDeclarationListStatement {
        const localDeclarationListStatement = new LocalDeclarationListStatement();
        localDeclarationListStatement.parent = parent;
        localDeclarationListStatement.localDeclarationList = this.parseDataDeclarationList(localDeclarationListStatement);
        localDeclarationListStatement.terminator = this.eatStatementTerminator();

        return localDeclarationListStatement;
    }

    private parseReturnStatement(parent: Node): ReturnStatement {
        const returnStatement = new ReturnStatement();
        returnStatement.parent = parent;
        returnStatement.returnKeyword = this.eat(TokenKind.ReturnKeyword);
        returnStatement.expression = this.parseExpression(returnStatement);
        returnStatement.terminator = this.eatStatementTerminator();

        return returnStatement;
    }

    // #region If statement

    private parseIfStatement(parent: Node): IfStatement {
        const ifStatement = new IfStatement();
        ifStatement.parent = parent;
        ifStatement.ifKeyword = this.eat(TokenKind.IfKeyword);
        ifStatement.expression = this.parseExpression(ifStatement);
        ifStatement.thenKeyword = this.eatOptional(TokenKind.ThenKeyword);

        if (this.getToken().kind === TokenKind.Newline) {
            ifStatement.statements = this.parseList(ifStatement, ifStatement.kind);

            ifStatement.elseIfStatements = [];
            while (this.isElseIfStatementStart()) {
                ifStatement.elseIfStatements.push(this.parseElseIfStatement(ifStatement));
            }

            if (this.getToken().kind === TokenKind.ElseKeyword) {
                ifStatement.elseStatement = this.parseElseStatement(ifStatement);
            }

            ifStatement.endKeyword = this.eat(TokenKind.EndIfKeyword, TokenKind.EndKeyword);
            if (ifStatement.endKeyword.kind === TokenKind.EndKeyword) {
                ifStatement.endIfKeyword = this.eatOptional(TokenKind.IfKeyword);
            }
        } else {
            ifStatement.statements = [this.parseStatement(ifStatement)];

            if (this.getToken().kind === TokenKind.ElseKeyword) {
                ifStatement.elseStatement = this.parseElseStatement(ifStatement);
            }
        }

        ifStatement.terminator = this.eatStatementTerminator();

        return ifStatement;
    }

    private isElseIfStatementStart(): boolean {
        const token = this.getToken();
        if (token.kind === TokenKind.ElseIfKeyword) {
            return true;
        }

        if (token.kind === TokenKind.ElseKeyword) {
            const nextToken = this.getToken(1);
            if (nextToken.kind === TokenKind.IfKeyword) {
                return true;
            }
        }

        return false;
    }

    private parseElseIfStatement(parent: IfStatement): ElseIfStatement {
        const elseIfStatement = new ElseIfStatement();
        elseIfStatement.parent = parent;
        elseIfStatement.elseIfKeyword = this.eat(TokenKind.ElseIfKeyword, TokenKind.ElseKeyword);
        if (elseIfStatement.elseIfKeyword.kind === TokenKind.ElseKeyword) {
            elseIfStatement.ifKeyword = this.eat(TokenKind.IfKeyword);
        }
        elseIfStatement.expression = this.parseExpression(elseIfStatement);
        elseIfStatement.thenKeyword = this.eatOptional(TokenKind.ThenKeyword);
        elseIfStatement.statements = this.parseList(elseIfStatement, elseIfStatement.kind);

        return elseIfStatement;
    }

    private parseElseStatement(parent: IfStatement): ElseStatement {
        const elseStatement = new ElseStatement();
        elseStatement.parent = parent;
        elseStatement.elseKeyword = this.eat(TokenKind.ElseKeyword);

        if (this.getToken().kind === TokenKind.Newline) {
            elseStatement.statements = this.parseList(elseStatement, elseStatement.kind);
        } else {
            elseStatement.statements = [this.parseStatement(elseStatement)];
        }

        return elseStatement;
    }

    private isIfStatementStatementsListTerminator(token: Token): boolean {
        return token.kind === TokenKind.ElseIfKeyword ||
            token.kind === TokenKind.ElseKeyword ||
            token.kind === TokenKind.EndIfKeyword ||
            token.kind === TokenKind.EndKeyword;
    }

    // #endregion

    // #region Select statement

    private parseSelectStatement(parent: Node): SelectStatement {
        const selectStatement = new SelectStatement();
        selectStatement.parent = parent;
        selectStatement.selectKeyword = this.eat(TokenKind.SelectKeyword);
        selectStatement.expression = this.parseExpression(selectStatement);

        while (true) {
            const token = this.getToken();
            if (token.kind !== TokenKind.Newline) {
                break;
            }
            selectStatement.newlines.push(token);
            this.advanceToken();
        }

        while (this.getToken().kind === TokenKind.CaseKeyword) {
            selectStatement.caseStatements.push(this.parseCaseStatement(selectStatement));
        }

        if (this.getToken().kind === TokenKind.DefaultKeyword) {
            selectStatement.defaultStatement = this.parseDefaultStatement(selectStatement);
        }

        selectStatement.endKeyword = this.eat(TokenKind.EndKeyword);
        selectStatement.endSelectKeyword = this.eatOptional(TokenKind.SelectKeyword);
        selectStatement.terminator = this.eatStatementTerminator();

        return selectStatement;
    }

    private parseCaseStatement(parent: Node): CaseStatement {
        const caseStatement = new CaseStatement();
        caseStatement.parent = parent;
        caseStatement.caseKeyword = this.eat(TokenKind.CaseKeyword);
        caseStatement.expressions = this.parseList(caseStatement, ParseContextKind.ExpressionSequence);
        caseStatement.statements = this.parseList(caseStatement, caseStatement.kind);

        return caseStatement;
    }

    private parseDefaultStatement(parent: Node): DefaultStatement {
        const defaultStatement = new DefaultStatement();
        defaultStatement.parent = parent;
        defaultStatement.defaultKeyword = this.eat(TokenKind.DefaultKeyword);
        defaultStatement.statements = this.parseList(defaultStatement, defaultStatement.kind);

        return defaultStatement;
    }

    private isCaseOrDefaultStatementStatementsListTerminator(token: Token): boolean {
        switch (token.kind) {
            case TokenKind.CaseKeyword:
            case TokenKind.DefaultKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region Loops

    private parseWhileLoop(parent: Node): WhileLoop {
        const whileLoop = new WhileLoop();
        whileLoop.parent = parent;
        whileLoop.whileKeyword = this.eat(TokenKind.WhileKeyword);
        whileLoop.expression = this.parseExpression(whileLoop);
        whileLoop.statements = this.parseList(whileLoop, whileLoop.kind);
        whileLoop.endKeyword = this.eat(TokenKind.WendKeyword, TokenKind.EndKeyword);
        if (whileLoop.endKeyword.kind === TokenKind.EndKeyword) {
            whileLoop.endWhileKeyword = this.eatOptional(TokenKind.WhileKeyword);
        }
        whileLoop.terminator = this.eatStatementTerminator();

        return whileLoop;
    }

    private parseRepeatLoop(parent: Node): RepeatLoop {
        const repeatLoop = new RepeatLoop();
        repeatLoop.parent = parent;
        repeatLoop.repeatKeyword = this.eat(TokenKind.RepeatKeyword);
        repeatLoop.statements = this.parseList(repeatLoop, repeatLoop.kind);
        repeatLoop.foreverOrUntilKeyword = this.eat(TokenKind.ForeverKeyword, TokenKind.UntilKeyword);
        if (repeatLoop.foreverOrUntilKeyword.kind === TokenKind.UntilKeyword) {
            repeatLoop.untilExpression = this.parseExpression(repeatLoop);
        }
        repeatLoop.terminator = this.eatStatementTerminator();

        return repeatLoop;
    }

    // #region For loop

    private parseForLoop(parent: Node): ForLoop {
        const forLoop = new ForLoop();
        forLoop.parent = parent;
        forLoop.forKeyword = this.eat(TokenKind.ForKeyword);
        forLoop.header = this.parseForLoopHeader(forLoop);
        forLoop.statements = this.parseList(forLoop, forLoop.kind);
        forLoop.endKeyword = this.eat(TokenKind.NextKeyword, TokenKind.EndKeyword);
        if (forLoop.endKeyword.kind === TokenKind.EndKeyword) {
            forLoop.endForKeyword = this.eatOptional(TokenKind.ForKeyword);
        }
        forLoop.terminator = this.eatStatementTerminator();

        return forLoop;
    }

    private parseForLoopHeader(parent: ForLoop) {
        let loopVariableExpression: DataDeclarationList | BinaryExpression;
        if (this.getToken().kind === TokenKind.LocalKeyword) {
            loopVariableExpression = this.parseDataDeclarationList(parent);
            const declaration = loopVariableExpression.children[0];
            if (declaration &&
                declaration.kind === NodeKind.DataDeclaration &&
                declaration.eachInKeyword !== null) {
                return loopVariableExpression;
            }
        } else {
            // TODO: Is this a safe assertion?
            loopVariableExpression = this.parseExpression(parent) as BinaryExpression;
            if (loopVariableExpression.eachInKeyword !== null) {
                return loopVariableExpression;
            }
        }

        const numericForLoopHeader = new NumericForLoopHeader();
        numericForLoopHeader.parent = parent;
        numericForLoopHeader.loopVariableExpression = loopVariableExpression;

        numericForLoopHeader.toOrUntilKeyword = this.eat(TokenKind.ToKeyword, TokenKind.UntilKeyword);
        numericForLoopHeader.lastValueExpression = this.parseExpression(numericForLoopHeader);

        numericForLoopHeader.stepKeyword = this.eatOptional(TokenKind.StepKeyword);
        if (numericForLoopHeader.stepKeyword !== null) {
            numericForLoopHeader.stepValueExpression = this.parseExpression(numericForLoopHeader);
        }

        return numericForLoopHeader;
    }

    // #endregion

    private parseContinueStatement(parent: Node): ContinueStatement {
        const continueStatement = new ContinueStatement();
        continueStatement.parent = parent;
        continueStatement.continueKeyword = this.eat(TokenKind.ContinueKeyword);
        continueStatement.terminator = this.eatStatementTerminator();

        return continueStatement;
    }

    private parseExitStatement(parent: Node): ExitStatement {
        const exitStatement = new ExitStatement();
        exitStatement.parent = parent;
        exitStatement.exitKeyword = this.eat(TokenKind.ExitKeyword);
        exitStatement.terminator = this.eatStatementTerminator();

        return exitStatement;
    }

    // #endregion

    private parseThrowStatement(parent: Node): ThrowStatement {
        const throwStatement = new ThrowStatement();
        throwStatement.parent = parent;
        throwStatement.throwKeyword = this.eat(TokenKind.ThrowKeyword);
        throwStatement.expression = this.parseExpression(throwStatement);
        throwStatement.terminator = this.eatStatementTerminator();

        return throwStatement;
    }

    // #region Try statement

    private parseTryStatement(parent: Node): TryStatement {
        const tryStatement = new TryStatement();
        tryStatement.parent = parent;
        tryStatement.tryKeyword = this.eat(TokenKind.TryKeyword);
        tryStatement.statements = this.parseList(tryStatement, tryStatement.kind);

        while (this.getToken().kind === TokenKind.CatchKeyword) {
            tryStatement.catchStatements.push(this.parseCatchStatement(tryStatement));
        }

        tryStatement.endKeyword = this.eat(TokenKind.EndKeyword);
        tryStatement.endTryKeyword = this.eatOptional(TokenKind.TryKeyword);
        tryStatement.terminator = this.eatStatementTerminator();

        return tryStatement;
    }

    private parseCatchStatement(parent: Node): CatchStatement {
        const catchStatement = new CatchStatement();
        catchStatement.parent = parent;
        catchStatement.catchKeyword = this.eat(TokenKind.CatchKeyword);
        catchStatement.parameter = this.parseDataDeclaration(catchStatement);
        catchStatement.statements = this.parseList(catchStatement, catchStatement.kind);

        return catchStatement;
    }

    // #endregion

    private parseExpressionStatement(parent: Node): ExpressionStatement {
        const expressionStatement = new ExpressionStatement();
        expressionStatement.parent = parent;
        expressionStatement.expression = this.parseExpression(expressionStatement);
        expressionStatement.terminator = this.eatStatementTerminator();

        return expressionStatement;
    }

    private parseEmptyStatement(parent: Node): EmptyStatement {
        const emptyStatement = new EmptyStatement();
        emptyStatement.parent = parent;
        emptyStatement.terminator = this.eatStatementTerminator();

        return emptyStatement;
    }

    // #endregion

    // #region Common

    private parseAccessibilityDirective(parent: Node): AccessibilityDirective {
        const accessibilityDirective = new AccessibilityDirective();
        accessibilityDirective.parent = parent;
        accessibilityDirective.accessibilityKeyword = this.eat(TokenKind.PrivateKeyword, TokenKind.PublicKeyword, TokenKind.ProtectedKeyword, TokenKind.ExternKeyword);
        if (accessibilityDirective.accessibilityKeyword.kind === TokenKind.ExternKeyword) {
            accessibilityDirective.externPrivateKeyword = this.eatOptional(TokenKind.PrivateKeyword);
        }

        return accessibilityDirective;
    }

    private parseFunctionDeclaration(parent: Node): FunctionDeclaration {
        const functionDeclaration = new FunctionDeclaration();
        functionDeclaration.parent = parent;
        functionDeclaration.functionKeyword = this.eat(TokenKind.FunctionKeyword);
        functionDeclaration.name = this.eat(TokenKind.Identifier);

        if (this.getToken().kind !== TokenKind.OpeningParenthesis) {
            // TODO: Consolidate type declaration handling logic.
            functionDeclaration.colon = this.eatOptional(TokenKind.Colon);
            functionDeclaration.returnType = this.parseQualifiedIdentifier(functionDeclaration);
        }

        functionDeclaration.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        functionDeclaration.parameters = this.parseDataDeclarationList(functionDeclaration);
        functionDeclaration.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);
        functionDeclaration.statements = this.parseList(functionDeclaration, functionDeclaration.kind);
        functionDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
        functionDeclaration.endFunctionKeyword = this.eatOptional(TokenKind.FunctionKeyword);

        return functionDeclaration;
    }

    private parseDataDeclarationList(parent: Node): DataDeclarationList {
        const dataDeclarationList = new DataDeclarationList();
        dataDeclarationList.parent = parent;
        dataDeclarationList.dataDeclarationKeyword = this.eatOptional(TokenKind.ConstKeyword, TokenKind.GlobalKeyword, TokenKind.FieldKeyword, TokenKind.LocalKeyword);
        dataDeclarationList.children = this.parseList(dataDeclarationList, dataDeclarationList.kind);

        return dataDeclarationList;
    }

    // #region Data declaration list members

    private isDataDeclarationListMembersListTerminator(token: Token): boolean {
        return token.kind !== TokenKind.Identifier &&
            token.kind !== TokenKind.Comma;
    }

    private isDataDeclarationListMemberStart(token: Token): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private parseDataDeclarationListMember(parent: Node) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier: {
                return this.parseDataDeclaration(parent);
            }
            case TokenKind.Comma: {
                return this.parseCommaSeparator(parent);
            }
        }

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)}`);
    }

    private parseDataDeclaration(parent: Node): DataDeclaration {
        const dataDeclaration = new DataDeclaration();
        dataDeclaration.parent = parent;
        dataDeclaration.name = this.eat(TokenKind.Identifier);
        dataDeclaration.colonEqualsSign = this.eatOptional(TokenKind.ColonEqualsSign);
        if (dataDeclaration.colonEqualsSign === null) {
            dataDeclaration.colon = this.eatOptional(TokenKind.Colon);
            if (dataDeclaration.colon !== null) {
                dataDeclaration.longhandType = this.parseQualifiedIdentifier(dataDeclaration);
            } else {
                dataDeclaration.shorthandType = this.eatOptional(TokenKind.DollarSign, TokenKind.QuestionMark, TokenKind.NumberSign, TokenKind.PercentSign);
            }
            dataDeclaration.equalsSign = this.eatOptional(TokenKind.EqualsSign);
        }
        if (dataDeclaration.colonEqualsSign !== null ||
            dataDeclaration.equalsSign !== null) {
            dataDeclaration.eachInKeyword = this.eatOptional(TokenKind.EachInKeyword);
            dataDeclaration.expression = this.parseExpression(dataDeclaration);
        }

        return dataDeclaration;
    }

    private parseCommaSeparator(parent: Node): CommaSeparator {
        const commaSeparator = new CommaSeparator();
        commaSeparator.parent = parent;
        commaSeparator.separator = this.eat(TokenKind.Comma);
        let token: Token | null;
        while ((token = this.eatOptional(TokenKind.Newline)) !== null) {
            commaSeparator.newlines.push(token);
        }

        return commaSeparator;
    }

    // #endregion

    // #region Type parameter sequence

    private isTypeParameterSequenceTerminator(token: Token): boolean {
        return !this.isTypeParameterSequenceMemberStart(token);
    }

    private isTypeParameterSequenceMemberStart(token: Token): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private parseTypeParameterSequenceMember(parent: Node) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier: {
                return this.parseTypeParameter(parent);
            }
            case TokenKind.Comma: {
                return this.parseCommaSeparator(parent);
            }
        }

        return this.parseCore(parent);
    }

    private parseTypeParameter(parent: Node): TypeParameter {
        const typeParameter = new TypeParameter();
        typeParameter.parent = parent;
        typeParameter.name = this.eat(TokenKind.Identifier);

        return typeParameter;
    }

    // #endregion

    // #region Expression sequence

    private isExpressionSequenceListTerminator(token: Token): boolean {
        return !this.isExpressionSequenceMemberStart(token);
    }

    private isExpressionSequenceMemberStart(token: Token): boolean {
        return token.kind === TokenKind.Comma ||
            this.isExpressionStart(token);
    }

    private parseExpressionSequenceMember(parent: Node) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Comma: {
                return this.parseCommaSeparator(parent);
            }
        }

        return this.parseExpression(parent);
    }

    // #endregion

    private parseQualifiedIdentifier(parent: Node): QualifiedIdentifier {
        const qualifiedIdentifier = new QualifiedIdentifier();
        qualifiedIdentifier.parent = parent;
        qualifiedIdentifier.modulePath = this.parseModulePath(qualifiedIdentifier);

        const modulePathChildren = qualifiedIdentifier.modulePath.children;
        if (modulePathChildren.length > 0) {
            qualifiedIdentifier.identifier = modulePathChildren.pop()!;
            qualifiedIdentifier.scopeMemberAccessOperator = modulePathChildren.pop() || null;
        } else {
            const token = this.getToken();
            switch (token.kind) {
                case TokenKind.StringKeyword:
                case TokenKind.BoolKeyword:
                case TokenKind.FloatKeyword:
                case TokenKind.IntKeyword:
                case TokenKind.ObjectKeyword:
                case TokenKind.ThrowableKeyword:
                case TokenKind.VoidKeyword: {
                    qualifiedIdentifier.identifier = token;
                    this.advanceToken();
                    break;
                }
                default: {
                    qualifiedIdentifier.identifier = new SkippedToken(token);
                    break;
                }
            }
        }

        return qualifiedIdentifier;
    }

    private parseModulePath(parent: Node): ModulePath {
        const modulePath = new ModulePath();
        modulePath.parent = parent;

        let lastTokenKind: TokenKind | undefined;
        while (true) {
            const token = this.getToken();
            if (token.kind === TokenKind.Identifier) {
                if (lastTokenKind !== undefined &&
                    lastTokenKind !== TokenKind.Period) {
                    console.error(`Did not expect ${JSON.stringify(token.kind)} to follow ${JSON.stringify(lastTokenKind)}`);
                    break;
                }

                modulePath.children.push(token);
                this.advanceToken();
            } else if (token.kind === TokenKind.Period) {
                if (lastTokenKind !== undefined &&
                    lastTokenKind !== TokenKind.Identifier) {
                    console.error(`Did not expect ${JSON.stringify(token.kind)} to follow ${JSON.stringify(lastTokenKind)}`);
                    break;
                }

                modulePath.children.push(token);
                this.advanceToken();
            } else {
                break;
            }
        }

        return modulePath;
    }

    private isExpressionStart(token: Token): boolean {
        switch (token.kind) {
            case TokenKind.NewKeyword:
            case TokenKind.NullKeyword:
            case TokenKind.TrueKeyword:
            case TokenKind.FalseKeyword:
            case TokenKind.SelfKeyword:
            case TokenKind.SuperKeyword:
            case TokenKind.QuotationMark:
            case TokenKind.FloatLiteral:
            case TokenKind.IntegerLiteral:
            case TokenKind.Identifier:
            case TokenKind.Period:
            case TokenKind.OpeningParenthesis:
            case TokenKind.OpeningSquareBracket:
            case TokenKind.PlusSign:
            case TokenKind.HyphenMinus:
            case TokenKind.Tilde:
            case TokenKind.NotKeyword:
            case TokenKind.StringKeyword:
            case TokenKind.BoolKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region Core

    private parseContexts: ParseContext[];

    private parseList<TParseContext extends ParseContext>(
        parent: Node,
        parseContext: TParseContext
    ) {
        this.parseContexts.push(parseContext);

        const nodes: ParseContextElementArray<TParseContext> = [];
        while (true) {
            const token = this.getToken();

            if (this.isListTerminator(parseContext, token)) {
                break;
            }

            if (this.isValidListElement(parseContext, token)) {
                const element = this.parseListElement(parseContext, parent);
                nodes.push(element);

                continue;
            }

            if (this.isValidInEnclosingContexts(token)) {
                break;
            }

            const skippedToken = new SkippedToken(token);
            nodes.push(skippedToken);
            this.advanceToken();
        }

        this.parseContexts.pop();

        return nodes;
    }

    private isListTerminator(parseContext: ParseContext, token: Token): boolean {
        if (token.kind === TokenKind.EOF) {
            return true;
        }

        switch (parseContext) {
            case NodeKind.ModuleDeclaration: {
                return this.isModuleMembersListTerminator();
            }
            case NodeKind.InterfaceDeclaration: {
                return this.isInterfaceMembersListTerminator(token);
            }
            case NodeKind.ClassDeclaration: {
                return this.isClassMembersListTerminator(token);
            }
            case NodeKind.FunctionDeclaration:
            case NodeKind.ClassMethodDeclaration:
            case NodeKind.RepeatLoop:
            case NodeKind.ForLoop:
            case NodeKind.TryStatement:
            case NodeKind.CatchStatement: {
                return this.isBlockStatementsListTerminator(token);
            }
            case NodeKind.IfStatement:
            case NodeKind.ElseIfStatement:
            case NodeKind.ElseStatement: {
                return this.isIfStatementStatementsListTerminator(token);
            }
            case NodeKind.CaseStatement:
            case NodeKind.DefaultStatement: {
                return this.isCaseOrDefaultStatementStatementsListTerminator(token);
            }
            case NodeKind.WhileLoop: {
                return token.kind === TokenKind.WendKeyword ||
                    this.isBlockStatementsListTerminator(token);
            }
            case NodeKind.DataDeclarationList:
            case ParseContextKind.BaseTypes: {
                return this.isDataDeclarationListMembersListTerminator(token);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.isTypeParameterSequenceTerminator(token);
            }
            case ParseContextKind.ExpressionSequence: {
                return this.isExpressionSequenceListTerminator(token);
            }
        }

        return assertNever(parseContext);
    }

    private isValidListElement(parseContext: ParseContext, token: Token): boolean {
        switch (parseContext) {
            case NodeKind.ModuleDeclaration: {
                return this.isModuleMemberStart(token);
            }
            case NodeKind.InterfaceDeclaration: {
                return this.isInterfaceMemberStart(token);
            }
            case NodeKind.ClassDeclaration: {
                return this.isClassMemberStart(token);
            }
            case NodeKind.FunctionDeclaration:
            case NodeKind.ClassMethodDeclaration:
            case NodeKind.IfStatement:
            case NodeKind.ElseIfStatement:
            case NodeKind.ElseStatement:
            case NodeKind.CaseStatement:
            case NodeKind.DefaultStatement:
            case NodeKind.WhileLoop:
            case NodeKind.RepeatLoop:
            case NodeKind.ForLoop:
            case NodeKind.TryStatement:
            case NodeKind.CatchStatement: {
                return this.isStatementStart(token);
            }
            case NodeKind.DataDeclarationList:
            case ParseContextKind.BaseTypes: {
                return this.isDataDeclarationListMemberStart(token);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.isTypeParameterSequenceMemberStart(token);
            }
            case ParseContextKind.ExpressionSequence: {
                return this.isExpressionSequenceMemberStart(token);
            }
        }

        return assertNever(parseContext);
    }

    private parseListElement(parseContext: ParseContext, parent: Node) {
        switch (parseContext) {
            case NodeKind.ModuleDeclaration: {
                return this.parseModuleMember(parent);
            }
            case NodeKind.InterfaceDeclaration: {
                return this.parseInterfaceMember(parent);
            }
            case NodeKind.ClassDeclaration: {
                return this.parseClassMember(parent);
            }
            case NodeKind.FunctionDeclaration:
            case NodeKind.ClassMethodDeclaration:
            case NodeKind.IfStatement:
            case NodeKind.ElseIfStatement:
            case NodeKind.ElseStatement:
            case NodeKind.CaseStatement:
            case NodeKind.DefaultStatement:
            case NodeKind.WhileLoop:
            case NodeKind.RepeatLoop:
            case NodeKind.ForLoop:
            case NodeKind.TryStatement:
            case NodeKind.CatchStatement: {
                return this.parseStatement(parent);
            }
            case NodeKind.DataDeclarationList:
            case ParseContextKind.BaseTypes: {
                return this.parseDataDeclarationListMember(parent);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.parseTypeParameterSequenceMember(parent);
            }
            case ParseContextKind.ExpressionSequence: {
                return this.parseExpressionSequenceMember(parent);
            }
        }

        return assertNever(parseContext);
    }

    private isValidInEnclosingContexts(token: Token): boolean {
        for (let i = this.parseContexts.length - 2; i >= 0; i--) {
            const parseContext = this.parseContexts[i];
            if (this.isValidListElement(parseContext, token) ||
                this.isListTerminator(parseContext, token)) {
                return true;
            }
        }

        return false;
    }

    private eatStatementTerminator(): Token {
        return this.eat(TokenKind.Newline, TokenKind.Semicolon);
    }

    private parseCore(parent: Node) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Newline: {
                this.advanceToken();

                return token;
            }
        }

        const p = parent || {
            kind: null,
        };
        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)} in ${JSON.stringify(p.kind)}`);
    }

    // #endregion
}

export type ParseContextElementArray<T extends ParseContext> = Array<ParseContextElementMap[T] | SkippedToken>;

type ParseContext = keyof ParseContextElementMap;

export enum ParseContextKind {
    BaseTypes = 'BaseTypes',
    TypeParameterSequence = 'TypeParameters',
    ExpressionSequence = 'Expressions',
}

export interface ParseContextElementMap {
    [NodeKind.ModuleDeclaration]: ReturnType<Parser['parseModuleMember']>;
    [NodeKind.InterfaceDeclaration]: ReturnType<Parser['parseInterfaceMember']>;
    [NodeKind.ClassDeclaration]: ReturnType<Parser['parseClassMember']>;
    [NodeKind.ClassMethodDeclaration]: ReturnType<Parser['parseStatement']>;
    [NodeKind.IfStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.ElseIfStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.ElseStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.CaseStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.DefaultStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.WhileLoop]: ReturnType<Parser['parseStatement']>;
    [NodeKind.RepeatLoop]: ReturnType<Parser['parseStatement']>;
    [NodeKind.ForLoop]: ReturnType<Parser['parseStatement']>;
    [NodeKind.TryStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.CatchStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.FunctionDeclaration]: ReturnType<Parser['parseStatement']>;
    [NodeKind.DataDeclarationList]: ReturnType<Parser['parseDataDeclarationListMember']>;
    [ParseContextKind.BaseTypes]: ReturnType<Parser['parseDataDeclarationListMember']>;
    [ParseContextKind.TypeParameterSequence]: ReturnType<Parser['parseTypeParameterSequenceMember']>;
    [ParseContextKind.ExpressionSequence]: ReturnType<Parser['parseExpressionSequenceMember']>;
}
