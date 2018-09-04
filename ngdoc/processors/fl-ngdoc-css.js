module.exports = function flNgdocCSSProcessor() {
    return {
        $runAfter: ['adding-extra-docs'],
        $runBefore: ['extra-docs-added'],
        $process: process
    };

    function process(docs) {
        docs.push({
            docType: 'csssource',
            template: 'fl-ngdoc.template.css',
            outputPath: 'fl-ngdoc.css',
            path: 'fl-ngdoc.css',
            id: 'fl-ngdoc-css'
        });

    }
};
