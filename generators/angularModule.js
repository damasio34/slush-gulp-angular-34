module.exports = function(gulp, install, conflict, template, rename, _, inflections, inquirer, mkdirp){
	gulp.task('angular-module', function (done) {

		if(!this.args[0])
		{
			console.log('******    Incorrect usage of the sub-generator!!           ******');
			console.log('******    Try slush meanjs:angular-module <module-name>    ******');
			console.log('******    Ex: slush meanjs:angular-module article          ******');
			return done();
		}
		var moduleName = this.args[0];

	    var prompts = [{
			type: 'checkbox',
			name: 'folders',
			message: 'Which folders would you like your module to include?',
			choices: [{
				value: 'addConfigFolder',
				name: 'config',
				checked: true
			}, {
				value: 'addControllersFolder',
				name: 'controllers',
				checked: true
			}, {
				value: 'addCSSFolder',
				name: 'css',
				checked: false
			}, {
				value: 'addDirectivesFolder',
				name: 'directives',
				checked: false
			}, {
				value: 'addFiltersFolder',
				name: 'filters',
				checked: false
			}, {
				value: 'addImagesFolder',
				name: 'img',
				checked: false
			}, {
				value: 'addServicesFolder',
				name: 'services',
				checked: true
			}, {
				value: 'addTestsFolder',
				name: 'tests',
				checked: true
			}, {
				value: 'addViewsFolder',
				name: 'views',
				checked: true
			}]
		}];
	    //Ask
	    inquirer.prompt(prompts,
	        function (answers) {
	        	if (!answers) {
	                return done();
	            }
	            
	             // modulename
	            answers.slugifiedName = _.slugify(_.humanize(moduleName));


	            answers.addConfigFolder = _.contains(answers.folders, 'addConfigFolder');
				answers.addControllersFolder = _.contains(answers.folders, 'addControllersFolder');
				answers.addCSSFolder = _.contains(answers.folders, 'addCSSFolder');
				answers.addDirectivesFolder = _.contains(answers.folders, 'addDirectivesFolder');
				answers.addFiltersFolder = _.contains(answers.folders, 'addFiltersFolder');
				answers.addImagesFolder = _.contains(answers.folders, 'addImagesFolder');
				answers.addServicesFolder = _.contains(answers.folders, 'addServicesFolder');
				answers.addTestsFolder = _.contains(answers.folders, 'addTestsFolder');
				answers.addViewsFolder = _.contains(answers.folders, 'addViewsFolder');

				// create root folder
				mkdirp('public/modules/' + answers.slugifiedName);
		        
		        // Create module sub-folders
				if (answers.addConfigFolder) mkdirp('public/modules/' + answers.slugifiedName + '/config');
				if (answers.addControllersFolder) mkdirp('public/modules/' + answers.slugifiedName + '/controllers');
				if (answers.addCSSFolder) mkdirp('public/modules/' + answers.slugifiedName + '/css');
				if (answers.addDirectivesFolder) mkdirp('public/modules/' + answers.slugifiedName + '/directives');
				if (answers.addFiltersFolder) mkdirp('public/modules/' + answers.slugifiedName + '/filters');
				if (answers.addImagesFolder) mkdirp('public/modules/' + answers.slugifiedName + '/img');
				if (answers.addServicesFolder) mkdirp('public/modules/' + answers.slugifiedName + '/services');
				if (answers.addTestsFolder) mkdirp('public/modules/' + answers.slugifiedName + '/tests');
				if (answers.addViewsFolder) mkdirp('public/modules/' + answers.slugifiedName + '/views');

			    gulp.src(__dirname + '/../templates/angular-module/**')
			        .pipe(template(answers))
			        .pipe(rename(function(file) {
		                    if (file.basename.indexOf('_') == 0) {
		                        file.basename = file.basename.replace('_',answers.slugifiedName);
		                    }
		             }))
			        .pipe(conflict('public/modules/' + answers.slugifiedName+'/'))
			        .pipe(gulp.dest('public/modules/' + answers.slugifiedName+'/'))
			        .on('end', function () {
		                done();
		            });	
				        
			    });
	});
	return gulp;
}