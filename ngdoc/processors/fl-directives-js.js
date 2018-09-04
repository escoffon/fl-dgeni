module.exports = function flDirectivesJSProcessor() {
    return {
        $runAfter: ['adding-extra-docs'],
        $runBefore: ['extra-docs-added'],
        $process: process
    };

    function process(docs) {
        docs.push({
            docType: 'jssource',
            template: 'fl-directives.template.js',
            outputPath: 'fl-directives.js',
            path: 'fl-directives.js',
            id: 'fl-directives-js'
        });

    }
};
