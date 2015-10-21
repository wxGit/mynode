module.exports = function (grunt) {
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //watch:{//监控指定文件被修改后执行发布打包任务，需要手动启动命令才会执行。关闭也需要手动关闭
        //    scripts: {
        //        files: ['pages/**/*.js'],
        //        tasks: ['jshint']
        //    }
        //},

        //JSHint (http://www.jshint.com/docs) js格式化、语法校验
        jshint: {
            all: {
                src: ['resources/js/*.js','!resources/js/valiformdata.js', 'pages/**/*.js'],
                options: {
                    eqeqeq: false,
                    trailing: true
                }
            }
        },
        //HTML校验
        htmlhint: {
            build: {
                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'head-script-disabled': true
                },
                src: ['test/index.html']
            }
        },
        //js压缩
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                compress: {drop_console: true},
                report: "min" //输出压缩率，可选的值有 false(不输出信息)，gzip
            },
            "build_pages_js": {//按原文件结构压缩js
                "files": [{
                    "expand": true,
                    "cwd": 'pages',//js目录下
                    "src": ['**/*.js'],//所有js文件
                    "dest": 'dist/pages'//输出到此目录下
                }]
            },
            "build_res_js": {
                "files": [{
                    "expand": true,
                    "cwd": 'resources',
                    "src": ['js/**/*.js'],
                    "dest": 'dist/resources'
                }]
            }

        },
        cssmin: {//css文件压缩并生成到指定目录
            target: {
                files:[{
                    expand: true,
                    cwd: 'resources/css', src: ['*\*/\*.css', '!*.min.css','!*.src.css'],
                    dest: 'dist/resources/css',
                    ext: '.min.css'
                }]
            }
        },
        //copy指定文件到dist目录
        copy: {
            main: {
                src: ['test/index.html'],
                dest: "dist",
                expand: true
            }
        },
        //将README文件转为HTML
        markdown: {
            all: {
                files: [
                    {
                        expand: true,
                        src: ['md/*.md'],
                        dest: 'test/',
                        ext: '.html'
                    }
                ],
                options: {
                    template: 'test/template.html'
                }
            }
        },
        clean: {//清理指定文件
            clean_dist_dir: {
                src: ["dist"]
            },
            clean_dist_js: {
                src: ["dist/pages/**/*.js"]
            }
        },
        inline: {//将html里面引用的js内容直接内嵌到页面里面，同时压缩页面里面的js和css代码
            //注意需要在页面里面引用js的地址后面添加?__inline参数，否则不会生效
            html: {
                options: {
                    cssmin: true,
                    uglify: true
                },
                src: ['dist/pages/**/*.html']
            }

        },
        // 生成manifest文件
        manifestGenerator: {
            make: {
                options: {
                    includeHtmlImage: true,
                    includeCSS: true,
                    includeCssImage: true,
                    includeJS: true,
                    excludeFiles: ['__inline$']//排除需要内嵌到html里面的js文件
                },
                files: {
                    'dist/ebt.manifest': ['dist/pages/**/*.html','dist/resources/**/*.*']
                }
            }
        },
        //压缩HTML
        htmlmin: {
            options: {
                removeComments: true,
                removeCommentsFromCDATA: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true,
                minifyCSS: true//压缩HTML内嵌的CSS代码
            },
            html: {
                files: [
                    {expand: true, cwd: 'dist/pages', src: ['**/*.html'], dest: 'dist/pages'}
                ]
            }
        },
        zip:{
            'using-cwd': {
                src: ['docs/UI/*.*', 'docs/resources/**/*.*','docs/layout/*.*','docs/index.html'],
                dest: 'dist/Li-Rabbit-Doc-v1.0.1.zip'
            }
        }

    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-watch');
    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('grunt-htmlhint');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-zip');

    grunt.registerTask('aa', ['htmlhint']);

    grunt.registerTask('uglify_js',[ 'uglify:build_pages_js','uglify:build_res_js']);

    // 依次执行 校验html js--》清理-->压缩 js--》CSS压缩-->copy html-->内嵌js--》压缩HTML--》清理pages内部的js文件
    grunt.registerTask('default', ['jshint','htmlhint', 'uglify_js', 'clean:clean_dist_dir','uglify_js',
        'cssmin', 'copy', 'inline', 'htmlmin', 'clean:clean_dist_js','zip']);

    //将markdown文件转成html文件
    grunt.registerTask('markdown', ['markdown']);
    grunt.registerTask('dist-zip', ['zip']);

    //生成mainfest文件
    // Actually load this plugin's task(s).
    grunt.loadNpmTasks('grunt-manifest-generator');
    grunt.registerTask('manifest', ['default', 'manifestGenerator:make']);
    //grunt.registerInitTask("watch",['watch']);
    //
    //grunt.event.on('watch', function(action, filepath, target) {
    //    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    //});

};
