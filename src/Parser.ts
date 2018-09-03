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
import { TypeParameter } from './Node/Declaration/TypeParameter';
import { BinaryExpression } from './Node/Expression/BinaryExpression';
import { Expressions } from './Node/Expression/Expression';
import { Node } from './Node/Node';
import { NodeKind } from './Node/NodeKind';
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
import { Statement } from './Node/Statement/Statement';
import { ThrowStatement } from './Node/Statement/ThrowStatement';
import { CatchStatement, TryStatement } from './Node/Statement/TryStatement';
import { WhileLoop } from './Node/Statement/WhileLoop';
import { ParseContext, ParseContextElementMapBase, ParseContextKind, ParserBase } from './ParserBase';
import { Tokens } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export class Parser extends ParserBase {
    parse(filePath: string, document: string, tokens: Tokens[]): ModuleDeclaration {
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

    private isModuleMemberStart(token: Tokens): boolean {
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
        aliasDirective.target = this.parseTypeReference(aliasDirective);

        return aliasDirective;
    }

    private parseInterfaceDeclaration(parent: Node): InterfaceDeclaration {
        const interfaceDeclaration = new InterfaceDeclaration();
        interfaceDeclaration.parent = parent;
        interfaceDeclaration.interfaceKeyword = this.eat(TokenKind.InterfaceKeyword);
        interfaceDeclaration.name = this.eat(TokenKind.Identifier);
        interfaceDeclaration.extendsKeyword = this.eatOptional(TokenKind.ExtendsKeyword);
        if (interfaceDeclaration.extendsKeyword !== null) {
            interfaceDeclaration.baseTypes = this.parseList(interfaceDeclaration, ParseContextKind.TypeReferenceSequence);
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
            classDeclaration.baseType = this.parseTypeReference(classDeclaration);
        }

        classDeclaration.implementsKeyword = this.eatOptional(TokenKind.ImplementsKeyword);
        if (classDeclaration.implementsKeyword !== null) {
            classDeclaration.implementedTypes = this.parseList(classDeclaration, ParseContextKind.TypeReferenceSequence);
        }

        let token: typeof classDeclaration.attributes[0] | null;
        while ((token = this.eatOptional(TokenKind.AbstractKeyword, TokenKind.FinalKeyword)) !== null) {
            classDeclaration.attributes.push(token);
        }

        classDeclaration.members = this.parseList(classDeclaration, classDeclaration.kind);
        classDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
        classDeclaration.endClassKeyword = this.eatOptional(TokenKind.ClassKeyword);

        return classDeclaration;
    }

    // #endregion

    // #region Interface members

    private isInterfaceMembersListTerminator(token: Tokens): boolean {
        return token.kind === TokenKind.EndKeyword;
    }

    private isInterfaceMemberStart(token: Tokens): boolean {
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
            interfaceMethodDeclaration.returnType = this.parseTypeReference(interfaceMethodDeclaration);
        }

        interfaceMethodDeclaration.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        interfaceMethodDeclaration.parameters = this.parseList(interfaceMethodDeclaration, ParseContextKind.DataDeclarationSequence);
        interfaceMethodDeclaration.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);

        return interfaceMethodDeclaration;
    }

    // #endregion

    // #region Class members

    private isClassMembersListTerminator(token: Tokens): boolean {
        return token.kind === TokenKind.EndKeyword;
    }

    private isClassMemberStart(token: Tokens): boolean {
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
            classMethodDeclaration.returnType = this.parseTypeReference(classMethodDeclaration);
        }

        classMethodDeclaration.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        classMethodDeclaration.parameters = this.parseList(classMethodDeclaration, ParseContextKind.DataDeclarationSequence);
        classMethodDeclaration.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);

        let token: typeof classMethodDeclaration.attributes[0] | null;
        while ((token = this.eatOptional(TokenKind.AbstractKeyword, TokenKind.FinalKeyword, TokenKind.PropertyKeyword)) !== null) {
            classMethodDeclaration.attributes.push(token);
        }

        if (classMethodDeclaration.attributes.findIndex(attribute => attribute.kind === TokenKind.AbstractKeyword) === -1) {
            classMethodDeclaration.statements = this.parseList(classMethodDeclaration, classMethodDeclaration.kind);
            classMethodDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
            classMethodDeclaration.endMethodKeyword = this.eatOptional(TokenKind.MethodKeyword);
        }

        return classMethodDeclaration;
    }

    // #endregion

    // #region Statements

    private isBlockStatementsListTerminator(token: Tokens): boolean {
        return token.kind === TokenKind.EndKeyword;
    }

    private isStatementStart(token: Tokens): boolean {
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
        localDeclarationListStatement.terminator = this.eatStatementTerminator(localDeclarationListStatement);

        return localDeclarationListStatement;
    }

    private parseReturnStatement(parent: Node): ReturnStatement {
        const returnStatement = new ReturnStatement();
        returnStatement.parent = parent;
        returnStatement.returnKeyword = this.eat(TokenKind.ReturnKeyword);
        // TODO: Is there sufficient information at this point to determine whether the return expression is required?
        if (this.isExpressionStart(this.getToken())) {
            returnStatement.expression = this.parseExpression(returnStatement);
        }
        returnStatement.terminator = this.eatStatementTerminator(returnStatement);

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

            while (this.isElseIfStatementStart()) {
                if (ifStatement.elseIfStatements === null) {
                    ifStatement.elseIfStatements = [];
                }
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
            ifStatement.isSingleLine = true;
            ifStatement.statements = [this.parseStatement(ifStatement)];

            if (this.getToken().kind === TokenKind.ElseKeyword) {
                ifStatement.elseStatement = this.parseElseStatement(ifStatement);
            }
        }

        ifStatement.terminator = this.eatStatementTerminator(ifStatement);

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

    private isIfStatementStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ElseIfKeyword:
            case TokenKind.ElseKeyword:
            case TokenKind.EndIfKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
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
        selectStatement.terminator = this.eatStatementTerminator(selectStatement);

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

    private isCaseOrDefaultStatementStatementsListTerminator(token: Tokens): boolean {
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

    // #region While loop

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
        whileLoop.terminator = this.eatStatementTerminator(whileLoop);

        return whileLoop;
    }

    private isWhileLoopStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.WendKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region Repeat loop

    private parseRepeatLoop(parent: Node): RepeatLoop {
        const repeatLoop = new RepeatLoop();
        repeatLoop.parent = parent;
        repeatLoop.repeatKeyword = this.eat(TokenKind.RepeatKeyword);
        repeatLoop.statements = this.parseList(repeatLoop, repeatLoop.kind);
        repeatLoop.foreverOrUntilKeyword = this.eat(TokenKind.ForeverKeyword, TokenKind.UntilKeyword);
        if (repeatLoop.foreverOrUntilKeyword.kind === TokenKind.UntilKeyword) {
            repeatLoop.untilExpression = this.parseExpression(repeatLoop);
        }
        repeatLoop.terminator = this.eatStatementTerminator(repeatLoop);

        return repeatLoop;
    }

    private isRepeatLoopStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ForeverKeyword:
            case TokenKind.UntilKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

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
        forLoop.terminator = this.eatStatementTerminator(forLoop);

        return forLoop;
    }

    private parseForLoopHeader(parent: ForLoop) {
        let loopVariableExpression: LocalDeclarationListStatement | BinaryExpression;
        if (this.getToken().kind === TokenKind.LocalKeyword) {
            loopVariableExpression = this.parseLocalDeclarationListStatement(parent);
            const declaration = loopVariableExpression.localDeclarationList.children[0];
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

    private isForLoopStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.NextKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    private parseContinueStatement(parent: Node): ContinueStatement {
        const continueStatement = new ContinueStatement();
        continueStatement.parent = parent;
        continueStatement.continueKeyword = this.eat(TokenKind.ContinueKeyword);
        continueStatement.terminator = this.eatStatementTerminator(continueStatement);

        return continueStatement;
    }

    private parseExitStatement(parent: Node): ExitStatement {
        const exitStatement = new ExitStatement();
        exitStatement.parent = parent;
        exitStatement.exitKeyword = this.eat(TokenKind.ExitKeyword);
        exitStatement.terminator = this.eatStatementTerminator(exitStatement);

        return exitStatement;
    }

    // #endregion

    private parseThrowStatement(parent: Node): ThrowStatement {
        const throwStatement = new ThrowStatement();
        throwStatement.parent = parent;
        throwStatement.throwKeyword = this.eat(TokenKind.ThrowKeyword);
        throwStatement.expression = this.parseExpression(throwStatement);
        throwStatement.terminator = this.eatStatementTerminator(throwStatement);

        return throwStatement;
    }

    // #region Try statement

    private parseTryStatement(parent: Node): TryStatement {
        const tryStatement = new TryStatement();
        tryStatement.parent = parent;
        tryStatement.tryKeyword = this.eat(TokenKind.TryKeyword);
        tryStatement.statements = this.parseList(tryStatement, tryStatement.kind);

        while (this.getToken().kind === TokenKind.CatchKeyword) {
            if (tryStatement.catchStatements === null) {
                tryStatement.catchStatements = [];
            }
            tryStatement.catchStatements.push(this.parseCatchStatement(tryStatement));
        }

        tryStatement.endKeyword = this.eat(TokenKind.EndKeyword);
        tryStatement.endTryKeyword = this.eatOptional(TokenKind.TryKeyword);
        tryStatement.terminator = this.eatStatementTerminator(tryStatement);

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
        expressionStatement.terminator = this.eatStatementTerminator(expressionStatement);

        return expressionStatement;
    }

    private parseEmptyStatement(parent: Node): EmptyStatement {
        const emptyStatement = new EmptyStatement();
        emptyStatement.parent = parent;
        emptyStatement.terminator = this.eatStatementTerminator(emptyStatement);

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
            functionDeclaration.returnType = this.parseTypeReference(functionDeclaration);
        }

        functionDeclaration.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        functionDeclaration.parameters = this.parseList(functionDeclaration, ParseContextKind.DataDeclarationSequence);
        functionDeclaration.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);
        functionDeclaration.statements = this.parseList(functionDeclaration, functionDeclaration.kind);
        functionDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
        functionDeclaration.endFunctionKeyword = this.eatOptional(TokenKind.FunctionKeyword);

        return functionDeclaration;
    }

    private parseDataDeclarationList(parent: Node): DataDeclarationList {
        const dataDeclarationList = new DataDeclarationList();
        dataDeclarationList.parent = parent;
        dataDeclarationList.dataDeclarationKeyword = this.eat(TokenKind.ConstKeyword, TokenKind.GlobalKeyword, TokenKind.FieldKeyword, TokenKind.LocalKeyword);
        dataDeclarationList.children = this.parseList(dataDeclarationList, ParseContextKind.DataDeclarationSequence);

        return dataDeclarationList;
    }

    // #region Data declaration sequence members

    private isDataDeclarationSequenceTerminator(token: Tokens): boolean {
        return !this.isDataDeclarationSequenceMemberStart(token);
    }

    private isDataDeclarationSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            // TODO: Is Period (global scope member access) allowed?
            case TokenKind.Identifier:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private parseDataDeclarationSequenceMember(parent: Node) {
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
            if (this.isTypeReferenceStart(this.getToken())) {
                dataDeclaration.type = this.parseTypeReference(dataDeclaration);
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

    // #endregion

    // #region Type parameter sequence

    private isTypeParameterSequenceTerminator(token: Tokens): boolean {
        return !this.isTypeParameterSequenceMemberStart(token);
    }

    private isTypeParameterSequenceMemberStart(token: Tokens): boolean {
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

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)}`);
    }

    private parseTypeParameter(parent: Node): TypeParameter {
        const typeParameter = new TypeParameter();
        typeParameter.parent = parent;
        typeParameter.name = this.eat(TokenKind.Identifier);

        return typeParameter;
    }

    // #endregion

    protected isInvokeExpressionStart(token: Tokens, expression: Expressions): boolean {
        switch (token.kind) {
            case TokenKind.OpeningParenthesis: {
                return true;
            }
        }

        /**
         * Parentheses-less invocations are only valid in expression statements. For this purpose, 
         * the expression statements in single line If statements do not count as expression statements.
         */
        const parent = expression.parent!;
        if (parent.kind === NodeKind.ExpressionStatement &&
            !this.isInlineStatement(parent as ExpressionStatement)) {
            return this.isExpressionSequenceMemberStart(token);
        }

        return false;
    }

    private isInlineStatement(statement: Statement): boolean {
        const parent = statement.parent!;
        let ifStatement: IfStatement | undefined = undefined;

        if (parent.kind === NodeKind.IfStatement) {
            ifStatement = parent as IfStatement;
        } else if (parent.kind === NodeKind.ElseStatement) {
            ifStatement = parent.parent as IfStatement;
        }

        return ifStatement !== undefined &&
            ifStatement.isSingleLine;
    }

    // #endregion

    // #region Core

    protected isListTerminator(parseContext: ParseContext, token: Tokens): boolean {
        parseContext = parseContext as ParserParseContext;

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
                return this.isWhileLoopStatementsListTerminator(token);
            }
            case NodeKind.RepeatLoop: {
                return this.isRepeatLoopStatementsListTerminator(token);
            }
            case NodeKind.ForLoop: {
                return this.isForLoopStatementsListTerminator(token);
            }
            case ParseContextKind.DataDeclarationSequence: {
                return this.isDataDeclarationSequenceTerminator(token);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.isTypeParameterSequenceTerminator(token);
            }
        }

        return super.isListTerminatorCore(parseContext, token);
    }

    protected isValidListElement(parseContext: ParseContext, token: Tokens): boolean {
        parseContext = parseContext as ParserParseContext;

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
            case ParseContextKind.DataDeclarationSequence: {
                return this.isDataDeclarationSequenceMemberStart(token);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.isTypeParameterSequenceMemberStart(token);
            }
        }

        return super.isValidListElementCore(parseContext, token);
    }

    protected parseListElement(parseContext: ParseContext, parent: Node) {
        parseContext = parseContext as ParserParseContext;

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
            case ParseContextKind.DataDeclarationSequence: {
                return this.parseDataDeclarationSequenceMember(parent);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.parseTypeParameterSequenceMember(parent);
            }
        }

        return super.parseListElementCore(parseContext, parent);
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

    private eatStatementTerminator(statement: Statement) {
        if (!this.isInlineStatement(statement)) {
            return this.eat(TokenKind.Newline, TokenKind.Semicolon);
        }

        return null;
    }

    // #endregion
}

// #region Parse contexts

interface ParserParseContextElementMap extends ParseContextElementMapBase {
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
    [ParseContextKind.DataDeclarationSequence]: ReturnType<Parser['parseDataDeclarationSequenceMember']>;
    [ParseContextKind.TypeParameterSequence]: ReturnType<Parser['parseTypeParameterSequenceMember']>;
}

type ParserParseContext = keyof ParserParseContextElementMap;

declare module './ParserBase' {
    enum ParseContextKind {
        DataDeclarationSequence = 'DataDeclarationSequence',
        TypeParameterSequence = 'TypeParameters',
    }

    interface ParseContextElementMap extends ParserParseContextElementMap { }
}

// #endregion
