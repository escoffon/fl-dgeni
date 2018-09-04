var path = require('canonical-path');
var Package = require('dgeni').Package;
var _ = require('lodash');

/*var Dgeni = require('dgeni');
var injector = Dgeni.configureInjector();
var logger = injector.get('log');
*/
module.exports = new Package('fl-dgeni/ngdoc', [
				 require('dgeni-packages/jsdoc'),
				 require('dgeni-packages/nunjucks'),
				 require('dgeni-packages/ngdoc')
			     ])

.factory(require('./services/fl-nunjucks-template-engine'))
.factory(require('./services/fl-utilities'))
.factory(require('./services/external-links'))

// we'll look up templates locally first
    .config(function(templateFinder, templateEngine) {
	    templateFinder.templateFolders
		.unshift(path.resolve(__dirname, 'templates'));
	})

// custom tags:
// - @extends lists the superclass
// - @mixin lists a mixin object (class extension)
// - @controller lists the controller used by a component or directive
// - @classmethod marks a class (as oppsed to instance) method.
// - @bindings lists directive bindings
// - @emits registers an emit event
// - @broadcasts registers an broadcast event
// - @listens registers an event to which we listen
// - @isindex marks the doc as the index (main) doc for a content hierarchy
    .config(function(parseTagsProcessor, log, createDocMessage) {
	parseTagsProcessor.tagDefinitions.push(require('./tags/extends'));
	parseTagsProcessor.tagDefinitions.push(require('./tags/mixin'));
	parseTagsProcessor.tagDefinitions.push(require('./tags/classmethod'));
	parseTagsProcessor.tagDefinitions.push(require('./tags/controller'));
	parseTagsProcessor.tagDefinitions.push(require('./tags/bindings'));

	let emits = require('./tags/emits');
	parseTagsProcessor.tagDefinitions.push(emits(log, createDocMessage));

	let broadcasts = require('./tags/broadcasts');
	parseTagsProcessor.tagDefinitions.push(broadcasts(log, createDocMessage));

	let listens = require('./tags/listens');
	parseTagsProcessor.tagDefinitions.push(listens(log, createDocMessage));

	parseTagsProcessor.tagDefinitions.push(require('./tags/isindex'));
    })

// customize or override path templates
    .config(function(computePathsProcessor) {
		computePathsProcessor.pathTemplates
		    .push({
			      docTypes: ['module'],
			      pathTemplate: '${area}/${name}',
			      outputPathTemplate: 'partials/${area}/${name}.html'
			  });

		computePathsProcessor.pathTemplates
		    .push({
			      docTypes: ['componentGroup'],
			      pathTemplate: '${area}/${moduleName}/${groupType}',
			      outputPathTemplate: 'partials/${area}/${moduleName}/${groupType}.html'
			  });

		computePathsProcessor.pathTemplates
		    .push({
			      docTypes: ['event'],
			      pathTemplate: '${area}/${name}',
			      outputPathTemplate: 'partials/${area}/${name}.html'
			  });

		computePathsProcessor.pathTemplates
		    .push({
			docTypes: ['property'],
			pathTemplate: '${area}/${module}/${docType}/${name}',
			outputPathTemplate: 'partials/${area}/${module}/${docType}/${name}.html'
		    });
	    })

// Support the content and component @ngdoc types
    .config(function(computeIdsProcessor, computePathsProcessor, getAliases) {
		computeIdsProcessor.idTemplates
		    .push({
			      docTypes: ['content', 'indexPage'],
			      getId: function(doc) { return doc.fileInfo.baseName; },
			      getAliases: function(doc) { return [doc.id]; }
			  });

		computePathsProcessor.pathTemplates
		    .push({
			      docTypes: ['content'],
			      getPath: function(doc) {
				  var docPath = path.dirname(doc.fileInfo.relativePath);
				  if (doc.fileInfo.baseName !== 'index') {
				      docPath = path.join(docPath, doc.fileInfo.baseName);
				  }
				  return docPath;
			      },
			      outputPathTemplate: 'partials/${path}.html'
			  });

		computeIdsProcessor.idTemplates
		    .push({
			      docTypes: ['component' ],
			      idTemplate: 'module:${module}.${docType}:${name}',
			      getAliases: getAliases
			  });
		computePathsProcessor.pathTemplates
		    .push({
			      docTypes: ['component' ],
			      pathTemplate: '${area}/${module}/${docType}/${name}',
			      outputPathTemplate: 'partials/${area}/${module}/${docType}/${name}.html'
			  });
	    })

// Support the controller @ngdoc type
    .config(function(computeIdsProcessor, computePathsProcessor, getAliases) {
		computeIdsProcessor.idTemplates
		    .push({
			      docTypes: ['controller' ],
			      idTemplate: 'controller:${name}',
			      getAliases: getAliases
			  });

		computePathsProcessor.pathTemplates
		    .push({
			      docTypes: ['controller' ],
			      pathTemplate: '${area}/${module}/${docType}/${name}',
			      outputPathTemplate: 'partials/${area}/${module}/${docType}/${name}.html'
			  });
	    })

// add the sref filter and @sref tag
    .factory(require('./inline-tag-defs/sref'))
    .config(function(templateEngine, getInjectables, inlineTagProcessor, srefInlineTagDef) {
		templateEngine.filters = templateEngine.filters
		    .concat(getInjectables([
					       require('./rendering/filters/sref')
					   ]));
		inlineTagProcessor.inlineTagDefinitions
		    .push(srefInlineTagDef);
	    })

// additional filters
// - eventAction build a description of an event action
    .config(function(templateEngine, getInjectables, inlineTagProcessor, srefInlineTagDef) {
		templateEngine.filters = templateEngine.filters
		    .concat(getInjectables([
					       require('./rendering/filters/event-action')
					   ]));
	    })

// These processors are used to generate specialized pages
    .processor(require('./processors/index-page'))
    .processor(require('./processors/app-module-script'))
    .processor(require('./processors/ui-bootstrap4'))
    .processor(require('./processors/fl-ngdoc-css'))
    .processor(require('./processors/fl-jquery-js'))
    .processor(require('./processors/fl-directives-js'))
    .processor(require('./processors/fl-sidebar-template'))

    .processor(require('./processors/compute-angular-state'))
    .processor(require('./processors/compute-extend-docs'))
    .processor(require('./processors/compute-mixin-docs'))
    .processor(require('./processors/compute-event-actors'))
    .processor(require('./processors/update-directive-actions'))
    .processor(require('./processors/api-data'))
    .processor(require('./processors/content-data'))

;
