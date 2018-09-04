module.exports = function appModuleScriptProcessor() {
    return {
        $runAfter: ['adding-extra-docs'],
        $runBefore: ['extra-docs-added'],
        $process: process
    };

    function process(docs) {
        docs.push({
            docType: 'appModuleScript',
            template: 'app-module.template.js',
            outputPath: 'app.module.js',
            path: 'app.module.js',
            id: 'app.module'
        });
    }
};
