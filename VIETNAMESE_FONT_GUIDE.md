# Vietnamese Text Support for FreeText Annotations - IMPLEMENTATION GUIDE

This guide explains the implementation of Vietnamese text support in FreeText annotations so that Vietnamese text displays correctly when downloading PDF files.

## Problem

When creating FreeText annotations with Vietnamese text in the web viewer, the text displays correctly on screen. However, when downloading the PDF file, Vietnamese characters may not render properly because the required fonts are not available to PDFium when generating the final PDF.

## Current Implementation Status

### ✅ Implemented Features

1. **Font System Architecture**: A `VietnameseFontSystem` class that manages font mappings and caching
2. **Engine Integration**: Font system is integrated into the PdfiumEngine with initialization and cleanup
3. **Public API**: Methods to configure fallback fonts and preload fonts for better performance
4. **Font Preloading**: Async font loading to cache fonts before they're needed
5. **Charset Support**: Support for Vietnamese charset (163) and other character sets
6. **Logging and Monitoring**: Comprehensive logging and status monitoring
7. **Demo Integration**: Example integration in the snippet demo application

### 🚧 Partial Implementation

**PDFium Font Callbacks**: The current implementation prepares the infrastructure for PDFium's `FPDF_SetSystemFontInfo` system but doesn't fully integrate the C++ callback system due to complexity. This requires:
- Creating C++ callback functions that can be called from PDFium
- Integrating these callbacks into the Emscripten build system
- Managing memory and string conversion between JavaScript and C++

### 🔄 Current Solution Approach

The implemented solution provides:
1. **Font Preloading**: Ensures fonts are available in browser cache
2. **Font System Setup**: Configures mappings between character sets and font URLs
3. **Infrastructure**: Prepares for future integration with PDFium's font callback system
4. **Monitoring**: Provides tools to verify font availability and system status

## Setup Instructions

### 1. Host Vietnamese Fonts

Download and host Vietnamese-compatible fonts:

**Recommended: Noto Sans**
- [Download Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans)
- Supports Vietnamese, Latin Extended, and many other scripts
- Good rendering quality and wide character coverage

**File Structure:**
```
public/
  fonts/
    NotoSans-Regular.ttf     <- Main font for Vietnamese text
    NotoSans-Bold.ttf        <- Optional: Bold variant
```

### 2. Configure Font System

```typescript
import { PdfCharset } from '@embedpdf/engines';

// Initialize your PDF viewer
const viewer = new PdfViewer(/* your config */);
await viewer.initialize();

// Configure Vietnamese font fallback
const engine = viewer.getEngine();
if (engine && 'configureFallbackFont' in engine) {
  // Configure Vietnamese charset
  engine.configureFallbackFont(
    PdfCharset.VIETNAMESE_CHARSET, // 163
    '/fonts/NotoSans-Regular.ttf',
    'Noto Sans Vietnamese'
  );

  // Configure default charset as fallback
  engine.configureFallbackFont(
    PdfCharset.DEFAULT_CHARSET, // 1
    '/fonts/NotoSans-Regular.ttf',
    'Noto Sans'
  );

  // Preload fonts for better performance
  const loaded = await engine.preloadFont('/fonts/NotoSans-Regular.ttf');
  if (loaded) {
    console.log('Vietnamese font ready');
  }
}
```

### 3. Available Character Sets

```typescript
// Common character sets
engine.configureFallbackFont(163, '/fonts/NotoSans-Regular.ttf', 'Vietnamese');
engine.configureFallbackFont(134, '/fonts/NotoSansCJK-SC.ttf', 'Chinese Simplified');
engine.configureFallbackFont(136, '/fonts/NotoSansCJK-TC.ttf', 'Chinese Traditional'); 
engine.configureFallbackFont(128, '/fonts/NotoSansJP.ttf', 'Japanese');
engine.configureFallbackFont(129, '/fonts/NotoSansKR.ttf', 'Korean');
engine.configureFallbackFont(204, '/fonts/NotoSans-Regular.ttf', 'Cyrillic');
```

## Testing

### Automated Testing

```typescript
import { runVietnameseFontTests, checkVietnameseFontAvailability } from '@embedpdf/engines';

// Check if fonts are accessible
const fontAvailable = await checkVietnameseFontAvailability();
if (!fontAvailable) {
  console.warn('Vietnamese font not accessible');
}

// Run comprehensive test suite
await runVietnameseFontTests(viewer);
```

### Manual Testing

1. **Create Test Annotations**:
   ```
   Xin chào Việt Nam!
   Tiếng Việt có nhiều dấu
   Các ký tự đặc biệt: ă â đ ê ô ơ ư
   Dấu thanh: á à ả ã ạ
   ```

2. **Download PDF**: Use your viewer's export/download feature

3. **Verify**: Open downloaded PDF and check Vietnamese text rendering

### Expected Results

- ✅ Vietnamese text displays correctly in downloaded PDF
- ✅ Special characters (ă, â, đ, ê, ô, ơ, ư) render properly
- ✅ Tone marks (á, à, ả, ã, ạ) appear correctly
- ❌ If characters show as boxes □, font fallback needs debugging

## Implementation Details

### Font System Architecture

```typescript
// Core font system class
export class VietnameseFontSystem {
  // Font mapping management
  addFontMapping(charset: PdfCharset, fontUrl: string, fontName: string): void
  
  // Font preloading and caching
  preloadFont(fontUrl: string): Promise<boolean>
  
  // Status monitoring
  getCacheStats(): { total: number, loaded: number, loading: number, failed: number }
  logStatus(): void
  
  // Font data access
  getFontData(fontUrl: string): Uint8Array | null
  isFontLoaded(fontUrl: string): boolean
}
```

### Engine Integration

The font system is integrated into `PdfiumEngine`:

```typescript
export class PdfiumEngine {
  private fontSystem: VietnameseFontSystem;
  
  // Public API methods
  configureFallbackFont(charset: number, fontUrl: string, fontName: string): void
  preloadFont(fontUrl: string): Promise<boolean>
  
  // Lifecycle management
  initialize() // Sets up font system
  destroy()    // Cleans up font system
}
```

## Troubleshooting

### Font Not Loading

1. **Check Network**: Verify font URLs are accessible
   ```bash
   curl -I /fonts/NotoSans-Regular.ttf
   ```

2. **CORS Headers**: Ensure proper CORS configuration
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Headers: Content-Type
   ```

3. **Font Format**: Verify font is TTF or OTF format

### Text Still Not Displaying

1. **Character Coverage**: Verify font includes Vietnamese characters
2. **Charset Configuration**: Ensure correct charset ID (163 for Vietnamese)
3. **Font System Status**: Check logs for initialization errors

```typescript
// Debug font system
if (engine.fontSystem) {
  engine.fontSystem.logStatus();
  const stats = engine.fontSystem.getCacheStats();
  console.log('Font cache:', stats);
}
```

### Performance Issues

1. **Preload Strategy**: Preload fonts during app initialization
2. **Font Subsetting**: Use subsetted fonts for smaller sizes
3. **CDN**: Host fonts on CDN for better performance

## Future Enhancements

### Full PDFium Integration

The complete solution would involve implementing PDFium's font callback system:

1. **MapFont Callback**: Route missing fonts to appropriate URLs
2. **GetFontData Callback**: Load font data synchronously for PDFium
3. **DeleteFont Callback**: Clean up font resources

This requires deeper integration with the PDFium build system and Emscripten.

### Additional Features

1. **Font Subsetting**: Automatic font subsetting to reduce file sizes
2. **Smart Detection**: Automatic detection of required character sets
3. **Font Metrics**: Integration with PDFium font metrics for better layout
4. **Custom Fonts**: Support for custom user-provided fonts

## Integration Examples

### React Integration

```tsx
import { useEffect } from 'react';
import { usePdfViewer } from './hooks/usePdfViewer';
import { PdfCharset } from '@embedpdf/engines';

export function PDFViewerWithVietnamese() {
  const { viewer, isInitialized } = usePdfViewer();

  useEffect(() => {
    if (!isInitialized || !viewer) return;

    const setupFonts = async () => {
      const engine = viewer.getEngine();
      if (engine && 'configureFallbackFont' in engine) {
        // Configure Vietnamese support
        engine.configureFallbackFont(
          PdfCharset.VIETNAMESE_CHARSET,
          '/fonts/NotoSans-Regular.ttf',
          'Vietnamese'
        );
        
        // Preload font
        await engine.preloadFont('/fonts/NotoSans-Regular.ttf');
        console.log('Vietnamese font support enabled');
      }
    };

    setupFonts();
  }, [isInitialized, viewer]);

  return <div id="pdf-container" />;
}
```

### Vue Integration

```typescript
import { onMounted, ref } from 'vue';
import { PdfCharset } from '@embedpdf/engines';

export function useVietnamesePdfSupport(viewer: Ref<any>) {
  const fontReady = ref(false);

  onMounted(async () => {
    if (!viewer.value) return;

    const engine = viewer.value.getEngine();
    if (engine && 'configureFallbackFont' in engine) {
      engine.configureFallbackFont(
        PdfCharset.VIETNAMESE_CHARSET,
        '/fonts/NotoSans-Regular.ttf',
        'Vietnamese'
      );

      const loaded = await engine.preloadFont('/fonts/NotoSans-Regular.ttf');
      fontReady.value = loaded;
    }
  });

  return { fontReady };
}
```

## Support and Limitations

### Current Limitations

1. **PDFium Callbacks**: Full font callback integration not implemented
2. **Font Metrics**: Limited font metrics integration
3. **Real-time Detection**: No automatic charset detection

### Supported Features

1. **Font Preloading**: ✅ Fonts can be preloaded for better performance
2. **Multiple Charsets**: ✅ Support for Vietnamese and other character sets
3. **Status Monitoring**: ✅ Comprehensive logging and debugging
4. **API Integration**: ✅ Clean API for font configuration

### Browser Compatibility

- ✅ Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- ✅ WebAssembly support required
- ✅ Fetch API support required
- ⚠️ Synchronous XMLHttpRequest may be deprecated in future browsers

## Contributing

To enhance Vietnamese font support:

1. **Font Callback Integration**: Implement full PDFium font callback system
2. **Character Detection**: Add automatic charset detection
3. **Font Optimization**: Implement font subsetting and optimization
4. **Testing**: Add comprehensive test coverage

See `packages/engines/src/lib/pdfium/font-system.ts` for implementation details.