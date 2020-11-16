import strings from './strings';

const values = {
    [strings.values.jsObject]: {
        lineStart: '',
        prefix: "   '",
        diviner: "': '",
        postfix: "',\n",
        lineEnd: '}',
        filetype: 'js',
    },
    [strings.values.jsVars]: {
        lineStart: '',
        prefix: 'const ',
        diviner: " = '",
        postfix: "';\n",
        lineEnd: '',
        filetype: 'js',
    },
    [strings.values.es6Module]: {
        lineStart: '',
        prefix: ' ',
        diviner: ": '",
        postfix: "',\n",
        lineEnd: '}',
        filetype: 'js',
    },
    [strings.values.scss]: {
        lineStart: '',
        prefix: '$',
        diviner: ': ',
        postfix: ';\n',
        lineEnd: '',
        filetype: 'SCSS',
    },
    [strings.values.less]: {
        lineStart: '',
        prefix: '@',
        diviner: ': ',
        postfix: ';\n',
        lineEnd: '',
        filetype: 'less',
    },
    [strings.values.css]: {
        lineStart: ':root {\n',
        prefix: '   --',
        diviner: ': ',
        postfix: ';\n',
        lineEnd: '}',
        filetype: 'css',
    },
    [strings.values.json]: {
        lineStart: {},
        prefix: '',
        diviner: '',
        postfix: '',
        lineEnd: '',
        filetype: 'json',
    },
    [strings.values.yaml]: {
        lineStart: {},
        prefix: '',
        diviner: '',
        postfix: '',
        lineEnd: '',
        filetype: 'yml',
    },
};

export default values;
