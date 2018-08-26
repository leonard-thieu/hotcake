import path = require('path');

import { executePreprocessorParserTestCases, executePreprocessorTokenizerTestCases } from "./shared";

const name = 'MonkeyX';
const casesPath = path.resolve('..', '..', 'blitz-research', 'monkey');

executePreprocessorTokenizerTestCases(name, casesPath);
executePreprocessorParserTestCases(name, casesPath);
