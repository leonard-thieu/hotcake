import path = require('path');

import { executeParserTestCases, executePreprocessorTokenizerTestCases } from './shared';

const name = 'Parser';
const casesPath = path.resolve(__dirname, '..', 'vscode', 'test', 'colorize-fixtures');

executeParserTestCases(name, casesPath);
