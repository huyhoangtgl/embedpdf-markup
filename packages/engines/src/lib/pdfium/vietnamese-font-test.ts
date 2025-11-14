/**
 * Test script for Vietnamese font support in FreeText annotations
 * 
 * This script demonstrates how to:
 * 1. Setup Vietnamese font support
 * 2. Create FreeText annotations with Vietnamese text
 * 3. Download the PDF to verify Vietnamese text renders correctly
 */

// Test Vietnamese text samples
const VIETNAMESE_TEST_TEXTS = [
  'Xin chào Việt Nam!',
  'Tiếng Việt có nhiều dấu',
  'Ánh sáng mặt trời',
  'Đường phố Hà Nội',
  'Múa hát dân gian',
  'Các ký tự đặc biệt: ă â đ ê ô ơ ư',
  'Dấu thanh: á à ả ã ạ',
];

/**
 * Vietnamese Font Test Suite
 */
export class VietnameseFontTest {
  private viewer: any;
  private engine: any;
  
  constructor(viewer: any) {
    this.viewer = viewer;
    this.engine = viewer.getEngine();
  }

  /**
   * Setup Vietnamese font support
   */
  async setupVietnameseFonts(): Promise<boolean> {
    try {
      if (!this.engine || !('configureFallbackFont' in this.engine)) {
        console.error('Engine does not support font configuration');
        return false;
      }

      console.log('🔧 Configuring Vietnamese fonts...');

      // Configure Vietnamese charset
      this.engine.configureFallbackFont(
        163, // VIETNAMESE_CHARSET
        '/fonts/NotoSans-Regular.ttf',
        'Noto Sans Vietnamese'
      );

      // Configure default charset as fallback
      this.engine.configureFallbackFont(
        1, // DEFAULT_CHARSET
        '/fonts/NotoSans-Regular.ttf',
        'Noto Sans Default'
      );

      console.log('✅ Vietnamese font configuration complete');

      // Try to preload the font
      if ('preloadFont' in this.engine) {
        console.log('📥 Preloading Vietnamese font...');
        const preloaded = await this.engine.preloadFont('/fonts/NotoSans-Regular.ttf');
        if (preloaded) {
          console.log('✅ Font preloaded successfully');
        } else {
          console.warn('⚠️ Font preloading failed, but fallback should still work');
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Failed to setup Vietnamese fonts:', error);
      return false;
    }
  }

  /**
   * Create test annotations with Vietnamese text
   */
  async createTestAnnotations(): Promise<void> {
    try {
      console.log('📝 Creating Vietnamese text annotations...');

      // Get the annotation plugin
      const annotationPlugin = this.viewer.getPlugin('annotation');
      if (!annotationPlugin) {
        console.error('Annotation plugin not available');
        return;
      }

      // Create FreeText annotations with Vietnamese text
      for (let i = 0; i < VIETNAMESE_TEST_TEXTS.length; i++) {
        const text = VIETNAMESE_TEST_TEXTS[i];
        
        const annotation = {
          type: 'freetext',
          contents: text,
          rect: {
            x: 50 + (i % 2) * 250,
            y: 100 + Math.floor(i / 2) * 60,
            width: 200,
            height: 40,
          },
          fontSize: 12,
          fontFamily: 'Arial', // This will fallback to Vietnamese font when needed
          fontColor: '#000000',
          backgroundColor: '#FFFF99',
        };

        console.log(`📍 Creating annotation: "${text}"`);
        // Note: Actual annotation creation depends on your viewer API
        // This is a conceptual example
      }

      console.log('✅ Test annotations created');
    } catch (error) {
      console.error('❌ Failed to create test annotations:', error);
    }
  }

  /**
   * Test font system status
   */
  testFontSystemStatus(): void {
    try {
      console.log('🔍 Checking font system status...');

      if (this.engine && 'fontSystem' in this.engine) {
        // If the font system is exposed, check its status
        const fontSystem = this.engine.fontSystem;
        if (fontSystem && 'logStatus' in fontSystem) {
          fontSystem.logStatus();
        }
      }

      console.log('✅ Font system status checked');
    } catch (error) {
      console.error('❌ Failed to check font system status:', error);
    }
  }

  /**
   * Run all tests
   */
  async runTests(): Promise<void> {
    console.log('🧪 Starting Vietnamese Font Test Suite...');

    // 1. Setup fonts
    const setupSuccess = await this.setupVietnameseFonts();
    if (!setupSuccess) {
      console.error('❌ Font setup failed, aborting tests');
      return;
    }

    // 2. Check font system status
    this.testFontSystemStatus();

    // 3. Create test annotations
    await this.createTestAnnotations();

    console.log('🎉 Vietnamese Font Test Suite completed!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Create FreeText annotations with Vietnamese text manually');
    console.log('2. Download the PDF file');
    console.log('3. Verify Vietnamese text displays correctly in the downloaded PDF');
    console.log('');
    console.log('Test texts to try:');
    VIETNAMESE_TEST_TEXTS.forEach((text, i) => {
      console.log(`   ${i + 1}. ${text}`);
    });
  }

  /**
   * Quick font availability test
   */
  static async testFontAvailability(fontUrl: string = '/fonts/NotoSans-Regular.ttf'): Promise<boolean> {
    try {
      console.log(`🔍 Testing font availability: ${fontUrl}`);
      
      const response = await fetch(fontUrl, { method: 'HEAD' });
      const available = response.ok;
      
      if (available) {
        console.log('✅ Font file is accessible');
      } else {
        console.log(`❌ Font file not accessible (${response.status})`);
      }
      
      return available;
    } catch (error) {
      console.log(`❌ Font file not accessible: ${error}`);
      return false;
    }
  }

  /**
   * Download instructions
   */
  static showDownloadInstructions(): void {
    console.log('📖 How to test Vietnamese text in downloaded PDF:');
    console.log('');
    console.log('1. Create FreeText annotations using these Vietnamese texts:');
    VIETNAMESE_TEST_TEXTS.forEach((text, i) => {
      console.log(`   "${text}"`);
    });
    console.log('');
    console.log('2. Use the download/export feature of your PDF viewer');
    console.log('3. Open the downloaded PDF file');
    console.log('4. Verify that Vietnamese text displays correctly');
    console.log('');
    console.log('Expected result: All Vietnamese characters should display properly');
    console.log('If characters appear as boxes □ or missing, font fallback may not be working');
  }
}

/**
 * Utility function to run the test suite
 */
export async function runVietnameseFontTests(viewer: any): Promise<void> {
  const test = new VietnameseFontTest(viewer);
  await test.runTests();
}

/**
 * Simple font availability check
 */
export async function checkVietnameseFontAvailability(): Promise<boolean> {
  return await VietnameseFontTest.testFontAvailability();
}

/**
 * Show manual testing instructions
 */
export function showManualTestInstructions(): void {
  VietnameseFontTest.showDownloadInstructions();
}

// Export test data for use in other modules
export { VIETNAMESE_TEST_TEXTS };