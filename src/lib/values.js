const values = {
    'JavaScript Object': {
      lineStart: "",
      prefix:  "   ",
      diviner: ": '",
      postfix: "',\n",
      lineEnd: "}",
      filetype: "js",
    },
    'JavaScript Variables': {
      lineStart: "",
      prefix:  "const ",
      diviner: " = '",
      postfix: "';\n",
      lineEnd: "",
      filetype: "js"
    },
    'SCSS': {
      lineStart: "",
      prefix: "$",
      diviner: ": ",
      postfix: ";\n",
      lineEnd: "",
      filetype: "scss"
    },
    'Less': {
      lineStart: "",
      prefix: "@",
      diviner: ": ",
      postfix: ";\n",
      lineEnd: "",
      filetype: "less"
    },
    'CSS': {
      lineStart: ":root {\n",
      prefix: "   --",
      diviner: ": ",
      postfix: ";\n",
      lineEnd: "}",
      filetype: "css"
    },
    'JSON': {
      lineStart: {},
      prefix: "",
      diviner: "",
      postfix: "",
      lineEnd: "",
      filetype: "json"
    },
  }

export default values;