var fs = require('fs'),
    yaml = require('js-yaml'),
    nunjucks = require('nunjucks');

var apiParameters = getApiParameters();

var nunjucksEnv = createNunjucksEnvironment(apiParameters);

renderHtmlFile('index.html', nunjucksEnv);

function getApiParameters() {
    var paramsFilePath = process.env.FILE_API_PARAMETERS_YML ? process.env.FILE_API_PARAMETERS_YML : '/home/fileapi/project/api/current/app/config/parameters.yml';
    if (!fs.existsSync(paramsFilePath)) {
        throw 'parameters.yml does not exist at: ' + paramsFilePath;
    }

    return yaml.safeLoad(fs.readFileSync(paramsFilePath, 'utf8')).parameters;
}

function createNunjucksEnvironment(apiParameters) {
    var nunjucksEnv = nunjucks.configure('src/', {
        tags: {
            blockStart: '{%',
            blockEnd: '%}',
            variableStart: '{{',
            variableEnd: '}}',
            commentStart: '{#',
            commentEnd: '#}'
        }
    });

    nunjucksEnv.addGlobal('base_host', apiParameters.base_host);
    nunjucksEnv.addGlobal('protocol', apiParameters.protocol);
    nunjucksEnv.addGlobal('api_base', apiParameters.protocol + 'api.' + apiParameters.base_host);

    return nunjucksEnv;
}

function renderHtmlFile(sourceFile, nunjucksEnv) {
    var output = nunjucksEnv.render(sourceFile);

    if (!fs.existsSync('dist/')) {
        fs.mkdirSync('dist/');
    }

    fs.writeFileSync('dist/' + sourceFile, output);
}
