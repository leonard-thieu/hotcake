const path = require('path');
const fs = require('fs');

function deleteFilesRecursive(targetPath, targetExtensions) {
    if (fs.existsSync(targetPath) && fs.lstatSync(targetPath).isDirectory()) {
        fs.readdirSync(targetPath).forEach(function (file) {
            const curPath = path.join(targetPath, file);

            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFilesRecursive(curPath, targetExtensions);
            } else {
                for (const targetExtension of targetExtensions) {
                    if (file.endsWith(targetExtension)) {
                        console.log(`Deleting '${curPath}'`);
                        fs.unlinkSync(curPath);
                        break;
                    }
                }
            }
        });
    }
}

deleteFilesRecursive('src', ['.js', '.js.map']);
deleteFilesRecursive('tests', ['.js', '.js.map', 'yaml']);
deleteFilesRecursive('vscode/client/src', ['.js', '.js.map']);
deleteFilesRecursive('vscode/server/src', ['.js', '.js.map']);
deleteFilesRecursive('vscode/syntaxes', ['.tmLanguage.json']);
