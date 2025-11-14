/**
 * Vietnamese text font fallback system for PDFium
 * 
 * This module implements a simplified fallback font system to support Vietnamese text
 * in FreeText annotations when downloading PDF files. Since the full FPDF_SetSystemFontInfo
 * API requires complex C++ callback integration, this implementation uses a different approach.
 */

import { WrappedPdfiumModule } from '@embedpdf/pdfium';
import { Logger, PdfCharset } from '@embedpdf/models';

/**
 * Charset constants as defined in PDFium
 * @deprecated Use PdfCharset from @embedpdf/models instead
 */

/**
 * Font mapping for different charsets
 */
interface FontMapping {
  charset: PdfCharset;
  fontUrl: string;
  fontName: string;
}

/**
 * Font cache entry
 */
interface FontCacheEntry {
  url: string;
  data: Uint8Array | null;
  loading: boolean;
  loaded: boolean;
}

/**
 * Vietnamese Font System for PDFium
 * 
 * Provides font preloading and management for better Vietnamese text support.
 * Note: This is a preparatory system for future integration with PDFium's font callbacks.
 */
export class VietnameseFontSystem {
  private fontMappings: FontMapping[] = [];
  private fontCache = new Map<string, FontCacheEntry>();
  private initialized = false;
  
  constructor(
    private pdfiumModule: WrappedPdfiumModule,
    private logger: Logger,
  ) {}

  /**
   * Initialize the font system with Vietnamese font support
   */
  public initialize(): boolean {
    try {
      console.log('🔧 [Vietnamese Font System] Starting initialization...');
      
      this.setupDefaultFontMappings();
      console.log(`📋 [Vietnamese Font System] Set up ${this.fontMappings.length} default font mappings`);
      
      this.initialized = true;
      console.log('✅ [Vietnamese Font System] Font system initialized successfully');
      
      this.logger.debug('VietnameseFontSystem', 'Font', 'Font system initialized successfully');
      
      // Log instructions for user
      this.logger.info(
        'VietnameseFontSystem', 
        'Font', 
        'Vietnamese font support initialized. Configure fonts using configureFallbackFont() and preloadFont() methods.'
      );
      
      // Log current mappings
      this.logStatus();
      
      return true;
    } catch (error) {
      console.error('❌ [Vietnamese Font System] Failed to initialize font system:', error);
      this.logger.error('VietnameseFontSystem', 'Font', 'Failed to initialize font system:', error);
      return false;
    }
  }

  /**
   * Cleanup the font system
   */
  public destroy(): void {
    this.fontCache.clear();
    this.fontMappings = [];
    this.initialized = false;
  }

  /**
   * Setup default font mappings for Vietnamese and other charsets
   */
  private setupDefaultFontMappings(): void {
    this.fontMappings = [
      {
        charset: PdfCharset.VIETNAMESE_CHARSET,
        fontUrl: '/fonts/NotoSans-Regular.ttf',
        fontName: 'Noto Sans Vietnamese',
      },
      {
        charset: PdfCharset.DEFAULT_CHARSET,
        fontUrl: '/fonts/NotoSans-Regular.ttf',
        fontName: 'Noto Sans',
      },
      {
        charset: PdfCharset.ANSI_CHARSET,
        fontUrl: '/fonts/NotoSans-Regular.ttf', 
        fontName: 'Noto Sans',
      },
      {
        charset: PdfCharset.EASTEUROPE_CHARSET,
        fontUrl: '/fonts/NotoSans-Regular.ttf',
        fontName: 'Noto Sans Eastern European',
      },
      {
        charset: PdfCharset.RUSSIAN_CHARSET,
        fontUrl: '/fonts/NotoSans-Regular.ttf',
        fontName: 'Noto Sans Cyrillic',
      },
    ];
  }

  /**
   * Add a custom font mapping
   */
  public addFontMapping(charset: PdfCharset, fontUrl: string, fontName: string): void {
    console.log(`🔧 [Font Mapping] Adding font mapping: charset=${charset}, url=${fontUrl}, name=${fontName}`);
    
    if (!this.initialized) {
      console.warn('⚠️ [Font Mapping] Font system not initialized');
      this.logger.warn('VietnameseFontSystem', 'Font', 'Font system not initialized');
      return;
    }

    // Remove existing mapping for this charset
    const beforeCount = this.fontMappings.length;
    this.fontMappings = this.fontMappings.filter(m => m.charset !== charset);
    const afterFilterCount = this.fontMappings.length;
    
    if (beforeCount > afterFilterCount) {
      console.log(`🔄 [Font Mapping] Removed existing mapping for charset ${charset}`);
    }
    
    // Add new mapping
    this.fontMappings.push({ charset, fontUrl, fontName });
    console.log(`✅ [Font Mapping] Successfully added font mapping. Total mappings: ${this.fontMappings.length}`);
    
    this.logger.debug('VietnameseFontSystem', 'Font', `Added font mapping: charset ${charset} -> ${fontUrl}`);
  }

  /**
   * Preload a font to cache for better performance
   */
  public async preloadFont(fontUrl: string): Promise<boolean> {
    console.log(`📥 [Font Preload] Starting preload for: ${fontUrl}`);
    
    if (!this.initialized) {
      console.warn('⚠️ [Font Preload] Font system not initialized');
      this.logger.warn('VietnameseFontSystem', 'Font', 'Font system not initialized');
      return false;
    }

    // Check if already loaded
    const existing = this.fontCache.get(fontUrl);
    if (existing?.loaded) {
      console.log(`✅ [Font Preload] Font already loaded: ${fontUrl}`);
      this.logger.debug('VietnameseFontSystem', 'Font', `Font already loaded: ${fontUrl}`);
      return true;
    }

    // Check if currently loading
    if (existing?.loading) {
      console.log(`⏳ [Font Preload] Font already loading: ${fontUrl}`);
      this.logger.debug('VietnameseFontSystem', 'Font', `Font already loading: ${fontUrl}`);
      return false;
    }

    // Initialize cache entry
    console.log(`🔄 [Font Preload] Initializing cache entry for: ${fontUrl}`);
    this.fontCache.set(fontUrl, {
      url: fontUrl,
      data: null,
      loading: true,
      loaded: false,
    });

    try {
      console.log(`🌐 [Font Preload] Fetching font from: ${fontUrl}`);
      this.logger.debug('VietnameseFontSystem', 'Font', `Preloading font: ${fontUrl}`);
      
      // Convert relative URLs to absolute URLs for worker context
      let absoluteFontUrl = fontUrl;
      if (fontUrl.startsWith('/') && typeof window === 'undefined') {
        // We're in a worker context, construct absolute URL
        const baseUrl = self.location.origin || 'http://localhost:3020';
        absoluteFontUrl = new URL(fontUrl, baseUrl).href;
        console.log(`🔄 [Font Preload] Converted to absolute URL: ${absoluteFontUrl}`);
      }
      
      const response = await fetch(absoluteFontUrl);
      console.log(`📡 [Font Preload] Fetch response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const fontData = new Uint8Array(await response.arrayBuffer());
      console.log(`💾 [Font Preload] Font data loaded: ${fontData.length} bytes`);
      
      // Update cache
      this.fontCache.set(fontUrl, {
        url: fontUrl,
        data: fontData,
        loading: false,
        loaded: true,
      });

      console.log(`✅ [Font Preload] Successfully preloaded font: ${fontUrl} (${fontData.length} bytes)`);
      this.logger.debug('VietnameseFontSystem', 'Font', `Successfully preloaded font: ${fontUrl} (${fontData.length} bytes)`);
      return true;

    } catch (error) {
      console.error(`❌ [Font Preload] Failed to preload font ${fontUrl}:`, error);
      this.logger.error('VietnameseFontSystem', 'Font', `Failed to preload font ${fontUrl}:`, error);
      
      // Update cache with error state
      this.fontCache.set(fontUrl, {
        url: fontUrl,
        data: null,
        loading: false,
        loaded: false,
      });
      
      return false;
    }
  }

  /**
   * Get font data from cache (for potential future use with PDFium callbacks)
   */
  public getFontData(fontUrl: string): Uint8Array | null {
    const entry = this.fontCache.get(fontUrl);
    return entry?.loaded ? entry.data : null;
  }

  /**
   * Get all configured font mappings
   */
  public getFontMappings(): FontMapping[] {
    return [...this.fontMappings];
  }

  /**
   * Check if a font URL is loaded
   */
  public isFontLoaded(fontUrl: string): boolean {
    return this.fontCache.get(fontUrl)?.loaded ?? false;
  }

  /**
   * Get font mapping for a specific charset
   */
  public getFontForCharset(charset: PdfCharset): FontMapping | null {
    return this.fontMappings.find(m => m.charset === charset) ?? null;
  }

  /**
   * Clear font cache
   */
  public clearCache(): void {
    this.fontCache.clear();
    this.logger.debug('VietnameseFontSystem', 'Font', 'Font cache cleared');
  }

  /**
   * Get cache statistics
   */
  public getCacheStats() {
    const total = this.fontCache.size;
    const loaded = Array.from(this.fontCache.values()).filter(entry => entry.loaded).length;
    const loading = Array.from(this.fontCache.values()).filter(entry => entry.loading).length;
    
    return {
      total,
      loaded,
      loading,
      failed: total - loaded - loading,
    };
  }

  /**
   * Preload all configured fonts
   */
  public async preloadAllFonts(): Promise<{ success: number; failed: number }> {
    const uniqueUrls = [...new Set(this.fontMappings.map(m => m.fontUrl))];
    
    this.logger.debug('VietnameseFontSystem', 'Font', `Preloading ${uniqueUrls.length} fonts...`);
    
    const results = await Promise.allSettled(
      uniqueUrls.map(url => this.preloadFont(url))
    );
    
    const success = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
    const failed = results.length - success;
    
    this.logger.debug(
      'VietnameseFontSystem', 
      'Font', 
      `Preloaded fonts: ${success} successful, ${failed} failed`
    );
    
    return { success, failed };
  }

  /**
   * Log current font system status
   */
  public logStatus(): void {
    console.log('📊 [Font Status] === Font System Status ===');
    
    if (!this.initialized) {
      console.log('❌ [Font Status] Font system not initialized');
      this.logger.info('VietnameseFontSystem', 'Font', 'Font system not initialized');
      return;
    }

    const stats = this.getCacheStats();
    const mappings = this.fontMappings.length;

    console.log(`📋 [Font Status] Font mappings configured: ${mappings}`);
    console.log(`💾 [Font Status] Font cache: ${stats.loaded}/${stats.total} fonts loaded, ${stats.loading} loading, ${stats.failed} failed`);

    this.logger.info(
      'VietnameseFontSystem',
      'Font',
      `Font system status: ${mappings} mappings configured, ${stats.loaded}/${stats.total} fonts loaded`
    );

    // Log each mapping
    console.log('🗂️ [Font Status] Font mappings:');
    this.fontMappings.forEach((mapping, index) => {
      const loaded = this.isFontLoaded(mapping.fontUrl) ? '✅' : '❌';
      console.log(`   ${index + 1}. ${loaded} Charset ${mapping.charset}: ${mapping.fontName} (${mapping.fontUrl})`);
      this.logger.debug(
        'VietnameseFontSystem',
        'Font',
        `${loaded} Charset ${mapping.charset}: ${mapping.fontName} (${mapping.fontUrl})`
      );
    });
    
    console.log('===============================');
  }
}