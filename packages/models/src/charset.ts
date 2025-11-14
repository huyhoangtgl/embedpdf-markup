/**
 * Character set constants as defined in PDFium for font selection
 * @public
 */
export const enum PdfCharset {
  /** ANSI character set (Latin) */
  ANSI_CHARSET = 0,
  /** Default system character set */
  DEFAULT_CHARSET = 1,
  /** Symbol character set */
  SYMBOL_CHARSET = 2,
  /** Mac Roman character set */
  MAC_CHARSET = 77,
  /** Japanese Shift-JIS character set */
  SHIFTJIS_CHARSET = 128,
  /** Korean Hangeul character set */
  HANGEUL_CHARSET = 129,
  /** Korean Johab character set */
  JOHAB_CHARSET = 130,
  /** Chinese GB2312 character set */
  GB2312_CHARSET = 134,
  /** Chinese Big5 character set */
  CHINESEBIG5_CHARSET = 136,
  /** Greek character set */
  GREEK_CHARSET = 161,
  /** Turkish character set */
  TURKISH_CHARSET = 162,
  /** Vietnamese character set */
  VIETNAMESE_CHARSET = 163,
  /** Hebrew character set */
  HEBREW_CHARSET = 177,
  /** Arabic character set */
  ARABIC_CHARSET = 178,
  /** Baltic character set */
  BALTIC_CHARSET = 186,
  /** Russian/Cyrillic character set */
  RUSSIAN_CHARSET = 204,
  /** Thai character set */
  THAI_CHARSET = 222,
  /** Eastern European character set */
  EASTEUROPE_CHARSET = 238,
  /** OEM character set */
  OEM_CHARSET = 255,
}