# Vietnamese Font Setup

## NotoSans-Regular.ttf

This font file supports Vietnamese characters and is used by the Vietnamese font system for FreeText annotations.

### Font Details:
- **File**: NotoSans-Regular.ttf  
- **Size**: ~28KB
- **Source**: Google Fonts (Noto Sans)
- **Charset Support**: Vietnamese (charset 163), Latin, and extended character sets

### Usage:
The font is automatically configured for Vietnamese text rendering when the PDF engine initializes:

```javascript
// Automatically configured charsets:
// - Vietnamese (163)
// - Default (1) 
// - ANSI (0)
// - Eastern European (238)
// - Cyrillic (204)
```

### Testing:
To test Vietnamese text rendering:
1. Create a FreeText annotation
2. Enter Vietnamese text: "Xin chào tiếng Việt"  
3. Save/download the PDF
4. Verify text renders correctly in the downloaded file