import glob = require('glob');
import fs = require('fs');
import path = require('path');
import { orderBy } from 'natural-orderby';

export function executeTestCases(type: string, ext: string, testCallback: TestCallback) {
    const skippedCases: string[] = require(`./${type}.skipped.json`);

    describe(type, function () {
        const casesPath = path.join(__dirname, 'cases', type);
        const casesGlobPath = path.join(casesPath, '*.monkey');
        const sourcePaths = orderBy(glob.sync(casesGlobPath));
    
        for (const sourcePath of sourcePaths) {
            const sourceBasename = path.basename(sourcePath);
            const outputPath = sourcePath + `.${ext}.json`;
    
            let _it: Mocha.PendingTestFunction = it;
            if (skippedCases.includes(sourceBasename)) {
                _it = xit;
                try {
                    fs.unlinkSync(outputPath);
                } catch (error) {
                    switch (error.code) {
                        case 'ENOENT': { break; }
                        default: {
                            console.log(error);
                            break;
                        }
                    }
                }
            }
    
            // TODO: Should this fail/warn if baselines have changed?
            _it(sourceBasename, function () {
                const contents = fs.readFileSync(sourcePath, 'utf8');
                const result = testCallback(contents);
    
                const json = JSON.stringify(result, null, 2);
                fs.writeFileSync(outputPath, json);
            });
        }
    });
}

type TestCallback = (contents: string) => any;
