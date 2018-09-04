module.exports = function flJQueryJSProcessor() {
    return {
        $runAfter: ['adding-extra-docs'],
        $runBefore: ['extra-docs-added'],
        $process: process
    };

    function process(docs) {
        docs.push({
            docType: 'jssource',
            template: 'fl-jquery.template.js',
            outputPath: 'fl-jquery.js',
            path: 'fl-jquery.js',
            id: 'fl-jquery-js'
        });

    }
};
