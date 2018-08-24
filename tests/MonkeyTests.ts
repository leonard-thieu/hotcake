import path = require('path');

import { executePreprocessorParserTestCases, executeTokenizerTestCases } from "./shared";

const name = 'MonkeyX';
const casesPath = path.resolve('..', '..', 'blitz-research', 'monkey');

executeTokenizerTestCases(name, casesPath);
executePreprocessorParserTestCases(name, casesPath);
