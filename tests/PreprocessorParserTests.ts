import path = require('path');

import { executePreprocessorParserTestCases, executeTokenizerTestCases } from './shared';

const name = 'PreprocessorParser';
const casesPath = path.resolve(__dirname, 'cases', name);

executeTokenizerTestCases(name, casesPath);
executePreprocessorParserTestCases(name, casesPath);
