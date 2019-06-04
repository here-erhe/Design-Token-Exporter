![alt text](images/gitcover.jpg)

# Design Token Exporter

Export Design tokens from your Sketch project. You can export colors, text, spacing tokens and text style objects. 

- You can choose fileformat: SCSS, CSS, LESS, JSON, JavaScript (Object/Variables)
- You can choose colorformat: HEX or RGBA
- You can choose text tokens: font family, font size, font weight, line height or letter spacing 
- You can choose units: Absolute (px) or Relative (rem)
- You can choose naming (kebab-case, camelCase or part of layer name)

## Features 

1. Export color tokens
2. Export text tokens
3. Export spacing tokens
4. Export textstyles

### Export color tokens

Select layers and go to `Plugins -> Design Token Exporter -> Export color tokens`

**Example output (SCSS, HEX)**

```
$primary1: #4a90e2;
$primary2: #336fb4;
$primary3: #2b619f;
$secondary1: #c1425a;
$secondary2: #9d3348;
$secondary3: #6d2130;
$grey1: #dadada;
$grey2: #a9a9a9;
$grey3: #6f6f6f;
```

### Export text tokens

Select layers and go to `Plugins -> Design Token Exporter -> Export text tokens`

**Example output (JSON, Font size, Absolute(px))**

```
{
	"fontSize": {
		"xxl": "64px",
		"xl": "48px",
		"l": "32px",
		"m": "24px",
		"s": "16px",
		"xs": "12px"
	}
}
```

### Export spacing tokens

Select layers and go to `Plugins -> Design Token Exporter -> Export spacing tokens`

**Example output (CSS, Relative(rem))**

```
:root {
   --spacing-xxs: 0.25rem;
   --spacing-xs: 0.5rem;
   --spacing-s: 1rem;
   --spacing-m: 1.5rem;
   --spacing-l: 3rem;
   --spacing-xl: 4rem;
   --spacing-xxl: 8rem;
}
```

### Export textstyles

Select layers and go to `Plugins -> Design Token Exporter -> Export textstyles`

**Example output (CSS, Relative(rem))**

```
const textStyles = {
	h1: {
		fontFamily: "Museo Sans",
		fontSize: "64px",
		fontWeight: 300,
		lineHeight: "64px",
		letterSpacing: "normal",
		textTransform: "none",
	},
	h2: {
		fontFamily: "Museo Sans",
		fontSize: "48px",
		fontWeight: 300,
		lineHeight: "48px",
		letterSpacing: "normal",
		textTransform: "none",
	},
	body: {
		fontFamily: "Museo Sans",
		fontSize: "16px",
		fontWeight: 500,
		lineHeight: "24px",
		letterSpacing: "normal",
		textTransform: "none",
	},
	caption: {
		fontFamily: "Museo Sans",
		fontSize: "12px",
		fontWeight: 500,
		lineHeight: "18px",
		letterSpacing: "normal",
		textTransform: "none",
	}
}
```

## How to install 

Some text

## Feedback

Some text

## License

This project is licensed under the terms of the MIT license.