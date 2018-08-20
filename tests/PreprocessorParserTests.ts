import glob = require('glob');
import fs = require('fs');
import path = require('path');
import { orderBy } from 'natural-orderby';

import { PreprocessorParser } from '../src/PreprocessorParser';

const skippedCases: string[] = require('./skippedPreprocessorParser.json');

describe('PreprocessorParser', function () {
    let sourcePaths: string[] = [];
    const casesPath = path.join(__dirname, 'cases', 'preprocessorParser');
    const casesGlobPath = path.join(casesPath, '**', '*.monkey');
    sourcePaths.push(...glob.sync(casesGlobPath));
    sourcePaths = orderBy(sourcePaths);

    for (const sourcePath of sourcePaths) {
        const sourceBasename = path.basename(sourcePath);
        
        let _it: Mocha.PendingTestFunction = it;
        if (skippedCases.includes(sourceBasename)) {
            _it = xit;
        }

        // TODO: Should this fail/warn if baselines have changed?
        _it(sourceBasename, function () {
            const contents = fs.readFileSync(sourcePath, 'utf-8');
            const parser = new PreprocessorParser();
            const tree = parser.parse(contents);

            const treePath = sourcePath + '.tree.json';
            const treeJSON = JSON.stringify(tree, null, 2);
            fs.writeFileSync(treePath, treeJSON);
        });
    }
});