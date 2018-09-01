import path = require('path');
import { executeParserTestCases } from './shared';

const name = 'Parser';

executeParserTestCases(name, path.resolve(__dirname, '..', 'vscode', 'test', 'colorize-fixtures'));
executeParserTestCases(name, path.resolve(__dirname, 'cases', name));
