module.exports = function flSidebarTemplateProcessor() {
    return {
        $runAfter: ['adding-extra-docs'],
        $runBefore: ['extra-docs-added'],
        $process: process
    };

    function process(docs) {
        docs.push({
            docType: 'sidebarTemplate',
            template: 'flSidebar.template.html',
            outputPath: 'flSidebar.html',
            path: 'flSidebar.html',
            id: 'sidebar'
        });

    }
};
