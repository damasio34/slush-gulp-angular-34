module.exports = function(gulp, install, conflict, template, rename, _, inflections, inquirer, mkdirp){
	var fs = require('fs');
	gulp.task('angular-route', function (done) {

		if(!this.args[0])
		{
			console.log('******    Incorrect usage of the sub-generator!!           ******');
			console.log('******    Try slush meanjs:angular-route <route-name>      ******');
			console.log('******    Ex: slush meanjs:angular-route article           ******');
			return done();
		}
		var moduleName = this.args[0];
		var modulesFolder = process.cwd() + '/public/modules/';

	     var prompts = [{
			type: 'list',
			name: 'moduleName',
			default: 'core',
			message: 'Which module does this route belongs to?',
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
	            
	             // modulename
	            answers.slugifiedName = _.slugify(_.humanize(moduleName));
	            answers.moduleName = answers.moduleName;
				answers.controllerName = answers.controllerName;

				answers.slugifiedModuleName = _.slugify(answers.moduleName);
				answers.humanizedModuleName = _.humanize(answers.moduleName);

				answers.classifiedName = _.classify(answers.slugifiedName);
				answers.humanizedName = _.humanize(answers.slugifiedName);
				
				var prompts = [{
					name: 'routePath',
					message: 'What do you want your route path to be?',
					default: answers.slugifiedName
				}, {
					name: 'viewName',
					message: 'What do you want to call your view?',
					default: answers.slugifiedName
				}, {
					name: 'controllerName',
					message: 'What do you want to call your controller?',
					default: answers.classifiedName
				}];

				inquirer.prompt(prompts,function (ans) {
		        	if (!answers) {
		                return done();
		            }
		            answers.routePath = ans.routePath;
					answers.viewName = ans.viewName;
					answers.controllerName = ans.controllerName;

					answers.slugifiedRoutePath = _.slugify(answers.routePath);
					
					answers.slugifiedViewName = _.slugify(answers.viewName);
					answers.humanizedViewName = _.humanize(answers.viewName);

					answers.slugifiedControllerName = _.slugify(_.humanize(answers.controllerName));
					answers.classifiedControllerName = _.classify(answers.slugifiedControllerName);
					answers.humanizedControllerName = _.humanize(answers.slugifiedControllerName);

					var routesFilePath = process.cwd() + '/public/modules/' + answers.slugifiedModuleName + '/config/' + answers.slugifiedModuleName +  '.client.routes.js';

					if (fs.existsSync(routesFilePath)) {
						 gulp.src(__dirname + '/../templates/angular-route/_.client.route.js')
					        .pipe(template(answers))
					        .pipe(rename(function(file) {
				                    if (file.basename.indexOf('_') == 0) {
				                        file.basename = file.basename.replace('_','temp');
				                    }
				             }))
					        .pipe(conflict('./'))
					        .pipe(gulp.dest('./'))
					        .on('end', function () {
				                var routesFileContent = fs.readFileSync(routesFilePath, "utf8");
						        var compiledTemplate = fs.readFileSync('temp.client.route.js', "utf8");
						        fs.writeFile(routesFilePath,routesFileContent.replace('$stateProvider.', compiledTemplate),function(){
							        fs.unlinkSync('./temp.client.route.js');
							    });
				            });	
			         }
			         else
			         {
			         	//create the req folders
			         	mkdirp('public/modules/' + answers.slugifiedModuleName + '/config');
			         	gulp.src(__dirname + '/../templates/angular-route/_.client.routes.js')
					        .pipe(template(answers))
					        .pipe(rename(function(file) {
				                    if (file.basename.indexOf('_') == 0) {
				                        file.basename = file.basename.replace('_', answers.slugifiedModuleName);
				                    }
				             }))
					        .pipe(conflict('public/modules/' + answers.slugifiedModuleName + '/config/'))
					        .pipe(gulp.dest('public/modules/' + answers.slugifiedModuleName + '/config/'));	
			         }

			         gulp.src(__dirname + '/../templates/angular-route/_.client.controller.js')
					        .pipe(template(answers))
					        .pipe(rename(function(file) {
				                    if (file.basename.indexOf('_') == 0) {
				                        file.basename = file.basename.replace('_', answers.slugifiedModuleName);
				                    }
				             }))
					        .pipe(conflict('public/modules/' + answers.slugifiedModuleName + '/controllers/'))
					        .pipe(gulp.dest('public/modules/' + answers.slugifiedModuleName + '/controllers/'));
					        
				     gulp.src(__dirname + '/../templates/angular-route/_.client.controller.test.js')
					        .pipe(template(answers))
					        .pipe(rename(function(file) {
				                    if (file.basename.indexOf('_') == 0) {
				                        file.basename = file.basename.replace('_', answers.slugifiedModuleName);
				                    }
				             }))
					        .pipe(conflict('public/modules/' + answers.slugifiedModuleName + '/tests/'))
					        .pipe(gulp.dest('public/modules/' + answers.slugifiedModuleName + '/tests/'));

				     gulp.src(__dirname + '/../templates/angular-route/_.client.view.html')
					        .pipe(template(answers))
					        .pipe(rename(function(file) {
				                    if (file.basename.indexOf('_') == 0) {
				                        file.basename = file.basename.replace('_', answers.slugifiedModuleName);
				                    }
				             }))
					        .pipe(conflict('public/modules/' + answers.slugifiedModuleName + '/views/'))
					        .pipe(gulp.dest('public/modules/' + answers.slugifiedModuleName + '/views/'))
					        .on('end', function () {
				               done();
				            });	


	        	});
				
	            
	});
	});
	return gulp;
};