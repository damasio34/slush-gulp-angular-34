module.exports = function (gulp, install, conflict, template, rename, _, inflections, inquirer, mkdirp) {
	var fs = require('fs');
	gulp.task('angular-service', function (done) {

		if (!this.args[0]) {
			console.log('******    Incorrect usage of the sub-generator!!                ******');
			console.log('******    Try slush meanjs:angular-service <service-name>       ******');
			console.log('******    Ex: slush meanjs:angular-service article              ******');
			return done();
		}
		var moduleName = this.args[0];
		var modulesFolder = process.cwd() + '/public/modules/';

		var prompts = [{
			type: 'list',
			name: 'moduleName',
			default: 'core',
			message: 'Which module does this service belongs to?',
			choices: []
		}];

		// Add module choices
        fs.readdirSync(modulesFolder).forEach(function(folder) {
            var stat = fs.statSync(modulesFolder + '/' + folder);

            if (stat.isDirectory()) {
                prompts[0].choices.push({
                	value: folder,
                	name: folder
                });
            }
        });

		//Ask
		inquirer.prompt(prompts,
			function (answers) {
				if (!answers) {
					return done();
				}
				
				answers.slugifiedModuleName = _.slugify(_.humanize(moduleName));
				answers.slugifiedName = _.slugify(moduleName);
				answers.classifiedName = _.classify(answers.slugifiedName);
				answers.humanizedName = _.humanize(answers.slugifiedName);
				        
				gulp.src(__dirname + '/../templates/angular-service/_.client.service.js')
			        .pipe(template(answers))
			        .pipe(rename(function(file) {
			        	    if (file.basename.indexOf('_') == 0) {
		                        file.basename = file.basename.replace('_', answers.slugifiedName);
		                    }
		             }))
			        .pipe(conflict('public/modules/' + answers.slugifiedModuleName + '/services/'))
			        .pipe(gulp.dest('public/modules/' + answers.slugifiedModuleName + '/services/'))
			        .on('end', function () {
		               done();
		            });	
			});
	});
	return gulp;
};