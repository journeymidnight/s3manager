/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2012 Joel Martin
 * Copyright (C) 2016 Samuel Mannehed for Cendio AB
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * See README.md for usage and integration instructions.
 */

/* jslint white: false, browser: true */
/* global window, $D, Util, WebUtil, RFB, Display */

var XK_VoidSymbol =                0xffffff, /* Void symbol */

XK_BackSpace =                   0xff08, /* Back space, back char */
XK_Tab =                         0xff09,
XK_Linefeed =                    0xff0a, /* Linefeed, LF */
XK_Clear =                       0xff0b,
XK_Return =                      0xff0d, /* Return, enter */
XK_Pause =                       0xff13, /* Pause, hold */
XK_Scroll_Lock =                 0xff14,
XK_Sys_Req =                     0xff15,
XK_Escape =                      0xff1b,
XK_Delete =                      0xffff, /* Delete, rubout */

/* Cursor control & motion */

XK_Home =                        0xff50,
XK_Left =                        0xff51, /* Move left, left arrow */
XK_Up =                          0xff52, /* Move up, up arrow */
XK_Right =                       0xff53, /* Move right, right arrow */
XK_Down =                        0xff54, /* Move down, down arrow */
XK_Prior =                       0xff55, /* Prior, previous */
XK_Page_Up =                     0xff55,
XK_Next =                        0xff56, /* Next */
XK_Page_Down =                   0xff56,
XK_End =                         0xff57, /* EOL */
XK_Begin =                       0xff58, /* BOL */


/* Misc functions */

XK_Select =                      0xff60, /* Select, mark */
XK_Print =                       0xff61,
XK_Execute =                     0xff62, /* Execute, run, do */
XK_Insert =                      0xff63, /* Insert, insert here */
XK_Undo =                        0xff65,
XK_Redo =                        0xff66, /* Redo, again */
XK_Menu =                        0xff67,
XK_Find =                        0xff68, /* Find, search */
XK_Cancel =                      0xff69, /* Cancel, stop, abort, exit */
XK_Help =                        0xff6a, /* Help */
XK_Break =                       0xff6b,
XK_Mode_switch =                 0xff7e, /* Character set switch */
XK_script_switch =               0xff7e, /* Alias for mode_switch */
XK_Num_Lock =                    0xff7f,

/* Keypad functions, keypad numbers cleverly chosen to map to ASCII */

XK_KP_Space =                    0xff80, /* Space */
XK_KP_Tab =                      0xff89,
XK_KP_Enter =                    0xff8d, /* Enter */
XK_KP_F1 =                       0xff91, /* PF1, KP_A, ... */
XK_KP_F2 =                       0xff92,
XK_KP_F3 =                       0xff93,
XK_KP_F4 =                       0xff94,
XK_KP_Home =                     0xff95,
XK_KP_Left =                     0xff96,
XK_KP_Up =                       0xff97,
XK_KP_Right =                    0xff98,
XK_KP_Down =                     0xff99,
XK_KP_Prior =                    0xff9a,
XK_KP_Page_Up =                  0xff9a,
XK_KP_Next =                     0xff9b,
XK_KP_Page_Down =                0xff9b,
XK_KP_End =                      0xff9c,
XK_KP_Begin =                    0xff9d,
XK_KP_Insert =                   0xff9e,
XK_KP_Delete =                   0xff9f,
XK_KP_Equal =                    0xffbd, /* Equals */
XK_KP_Multiply =                 0xffaa,
XK_KP_Add =                      0xffab,
XK_KP_Separator =                0xffac, /* Separator, often comma */
XK_KP_Subtract =                 0xffad,
XK_KP_Decimal =                  0xffae,
XK_KP_Divide =                   0xffaf,

XK_KP_0 =                        0xffb0,
XK_KP_1 =                        0xffb1,
XK_KP_2 =                        0xffb2,
XK_KP_3 =                        0xffb3,
XK_KP_4 =                        0xffb4,
XK_KP_5 =                        0xffb5,
XK_KP_6 =                        0xffb6,
XK_KP_7 =                        0xffb7,
XK_KP_8 =                        0xffb8,
XK_KP_9 =                        0xffb9,

/*
 * Auxiliary functions; note the duplicate definitions for left and right
 * function keys;  Sun keyboards and a few other manufacturers have such
 * function key groups on the left and/or right sides of the keyboard.
 * We've not found a keyboard with more than 35 function keys total.
 */

XK_F1 =                          0xffbe,
XK_F2 =                          0xffbf,
XK_F3 =                          0xffc0,
XK_F4 =                          0xffc1,
XK_F5 =                          0xffc2,
XK_F6 =                          0xffc3,
XK_F7 =                          0xffc4,
XK_F8 =                          0xffc5,
XK_F9 =                          0xffc6,
XK_F10 =                         0xffc7,
XK_F11 =                         0xffc8,
XK_L1 =                          0xffc8,
XK_F12 =                         0xffc9,
XK_L2 =                          0xffc9,
XK_F13 =                         0xffca,
XK_L3 =                          0xffca,
XK_F14 =                         0xffcb,
XK_L4 =                          0xffcb,
XK_F15 =                         0xffcc,
XK_L5 =                          0xffcc,
XK_F16 =                         0xffcd,
XK_L6 =                          0xffcd,
XK_F17 =                         0xffce,
XK_L7 =                          0xffce,
XK_F18 =                         0xffcf,
XK_L8 =                          0xffcf,
XK_F19 =                         0xffd0,
XK_L9 =                          0xffd0,
XK_F20 =                         0xffd1,
XK_L10 =                         0xffd1,
XK_F21 =                         0xffd2,
XK_R1 =                          0xffd2,
XK_F22 =                         0xffd3,
XK_R2 =                          0xffd3,
XK_F23 =                         0xffd4,
XK_R3 =                          0xffd4,
XK_F24 =                         0xffd5,
XK_R4 =                          0xffd5,
XK_F25 =                         0xffd6,
XK_R5 =                          0xffd6,
XK_F26 =                         0xffd7,
XK_R6 =                          0xffd7,
XK_F27 =                         0xffd8,
XK_R7 =                          0xffd8,
XK_F28 =                         0xffd9,
XK_R8 =                          0xffd9,
XK_F29 =                         0xffda,
XK_R9 =                          0xffda,
XK_F30 =                         0xffdb,
XK_R10 =                         0xffdb,
XK_F31 =                         0xffdc,
XK_R11 =                         0xffdc,
XK_F32 =                         0xffdd,
XK_R12 =                         0xffdd,
XK_F33 =                         0xffde,
XK_R13 =                         0xffde,
XK_F34 =                         0xffdf,
XK_R14 =                         0xffdf,
XK_F35 =                         0xffe0,
XK_R15 =                         0xffe0,

/* Modifiers */

XK_Shift_L =                     0xffe1, /* Left shift */
XK_Shift_R =                     0xffe2, /* Right shift */
XK_Control_L =                   0xffe3, /* Left control */
XK_Control_R =                   0xffe4, /* Right control */
XK_Caps_Lock =                   0xffe5, /* Caps lock */
XK_Shift_Lock =                  0xffe6, /* Shift lock */

XK_Meta_L =                      0xffe7, /* Left meta */
XK_Meta_R =                      0xffe8, /* Right meta */
XK_Alt_L =                       0xffe9, /* Left alt */
XK_Alt_R =                       0xffea, /* Right alt */
XK_Super_L =                     0xffeb, /* Left super */
XK_Super_R =                     0xffec, /* Right super */
XK_Hyper_L =                     0xffed, /* Left hyper */
XK_Hyper_R =                     0xffee, /* Right hyper */

XK_ISO_Level3_Shift =            0xfe03, /* AltGr */

/*
 * Latin 1
 * (ISO/IEC 8859-1 = Unicode U+0020..U+00FF)
 * Byte 3 = 0
 */

XK_space =                       0x0020, /* U+0020 SPACE */
XK_exclam =                      0x0021, /* U+0021 EXCLAMATION MARK */
XK_quotedbl =                    0x0022, /* U+0022 QUOTATION MARK */
XK_numbersign =                  0x0023, /* U+0023 NUMBER SIGN */
XK_dollar =                      0x0024, /* U+0024 DOLLAR SIGN */
XK_percent =                     0x0025, /* U+0025 PERCENT SIGN */
XK_ampersand =                   0x0026, /* U+0026 AMPERSAND */
XK_apostrophe =                  0x0027, /* U+0027 APOSTROPHE */
XK_quoteright =                  0x0027, /* deprecated */
XK_parenleft =                   0x0028, /* U+0028 LEFT PARENTHESIS */
XK_parenright =                  0x0029, /* U+0029 RIGHT PARENTHESIS */
XK_asterisk =                    0x002a, /* U+002A ASTERISK */
XK_plus =                        0x002b, /* U+002B PLUS SIGN */
XK_comma =                       0x002c, /* U+002C COMMA */
XK_minus =                       0x002d, /* U+002D HYPHEN-MINUS */
XK_period =                      0x002e, /* U+002E FULL STOP */
XK_slash =                       0x002f, /* U+002F SOLIDUS */
XK_0 =                           0x0030, /* U+0030 DIGIT ZERO */
XK_1 =                           0x0031, /* U+0031 DIGIT ONE */
XK_2 =                           0x0032, /* U+0032 DIGIT TWO */
XK_3 =                           0x0033, /* U+0033 DIGIT THREE */
XK_4 =                           0x0034, /* U+0034 DIGIT FOUR */
XK_5 =                           0x0035, /* U+0035 DIGIT FIVE */
XK_6 =                           0x0036, /* U+0036 DIGIT SIX */
XK_7 =                           0x0037, /* U+0037 DIGIT SEVEN */
XK_8 =                           0x0038, /* U+0038 DIGIT EIGHT */
XK_9 =                           0x0039, /* U+0039 DIGIT NINE */
XK_colon =                       0x003a, /* U+003A COLON */
XK_semicolon =                   0x003b, /* U+003B SEMICOLON */
XK_less =                        0x003c, /* U+003C LESS-THAN SIGN */
XK_equal =                       0x003d, /* U+003D EQUALS SIGN */
XK_greater =                     0x003e, /* U+003E GREATER-THAN SIGN */
XK_question =                    0x003f, /* U+003F QUESTION MARK */
XK_at =                          0x0040, /* U+0040 COMMERCIAL AT */
XK_A =                           0x0041, /* U+0041 LATIN CAPITAL LETTER A */
XK_B =                           0x0042, /* U+0042 LATIN CAPITAL LETTER B */
XK_C =                           0x0043, /* U+0043 LATIN CAPITAL LETTER C */
XK_D =                           0x0044, /* U+0044 LATIN CAPITAL LETTER D */
XK_E =                           0x0045, /* U+0045 LATIN CAPITAL LETTER E */
XK_F =                           0x0046, /* U+0046 LATIN CAPITAL LETTER F */
XK_G =                           0x0047, /* U+0047 LATIN CAPITAL LETTER G */
XK_H =                           0x0048, /* U+0048 LATIN CAPITAL LETTER H */
XK_I =                           0x0049, /* U+0049 LATIN CAPITAL LETTER I */
XK_J =                           0x004a, /* U+004A LATIN CAPITAL LETTER J */
XK_K =                           0x004b, /* U+004B LATIN CAPITAL LETTER K */
XK_L =                           0x004c, /* U+004C LATIN CAPITAL LETTER L */
XK_M =                           0x004d, /* U+004D LATIN CAPITAL LETTER M */
XK_N =                           0x004e, /* U+004E LATIN CAPITAL LETTER N */
XK_O =                           0x004f, /* U+004F LATIN CAPITAL LETTER O */
XK_P =                           0x0050, /* U+0050 LATIN CAPITAL LETTER P */
XK_Q =                           0x0051, /* U+0051 LATIN CAPITAL LETTER Q */
XK_R =                           0x0052, /* U+0052 LATIN CAPITAL LETTER R */
XK_S =                           0x0053, /* U+0053 LATIN CAPITAL LETTER S */
XK_T =                           0x0054, /* U+0054 LATIN CAPITAL LETTER T */
XK_U =                           0x0055, /* U+0055 LATIN CAPITAL LETTER U */
XK_V =                           0x0056, /* U+0056 LATIN CAPITAL LETTER V */
XK_W =                           0x0057, /* U+0057 LATIN CAPITAL LETTER W */
XK_X =                           0x0058, /* U+0058 LATIN CAPITAL LETTER X */
XK_Y =                           0x0059, /* U+0059 LATIN CAPITAL LETTER Y */
XK_Z =                           0x005a, /* U+005A LATIN CAPITAL LETTER Z */
XK_bracketleft =                 0x005b, /* U+005B LEFT SQUARE BRACKET */
XK_backslash =                   0x005c, /* U+005C REVERSE SOLIDUS */
XK_bracketright =                0x005d, /* U+005D RIGHT SQUARE BRACKET */
XK_asciicircum =                 0x005e, /* U+005E CIRCUMFLEX ACCENT */
XK_underscore =                  0x005f, /* U+005F LOW LINE */
XK_grave =                       0x0060, /* U+0060 GRAVE ACCENT */
XK_quoteleft =                   0x0060, /* deprecated */
XK_a =                           0x0061, /* U+0061 LATIN SMALL LETTER A */
XK_b =                           0x0062, /* U+0062 LATIN SMALL LETTER B */
XK_c =                           0x0063, /* U+0063 LATIN SMALL LETTER C */
XK_d =                           0x0064, /* U+0064 LATIN SMALL LETTER D */
XK_e =                           0x0065, /* U+0065 LATIN SMALL LETTER E */
XK_f =                           0x0066, /* U+0066 LATIN SMALL LETTER F */
XK_g =                           0x0067, /* U+0067 LATIN SMALL LETTER G */
XK_h =                           0x0068, /* U+0068 LATIN SMALL LETTER H */
XK_i =                           0x0069, /* U+0069 LATIN SMALL LETTER I */
XK_j =                           0x006a, /* U+006A LATIN SMALL LETTER J */
XK_k =                           0x006b, /* U+006B LATIN SMALL LETTER K */
XK_l =                           0x006c, /* U+006C LATIN SMALL LETTER L */
XK_m =                           0x006d, /* U+006D LATIN SMALL LETTER M */
XK_n =                           0x006e, /* U+006E LATIN SMALL LETTER N */
XK_o =                           0x006f, /* U+006F LATIN SMALL LETTER O */
XK_p =                           0x0070, /* U+0070 LATIN SMALL LETTER P */
XK_q =                           0x0071, /* U+0071 LATIN SMALL LETTER Q */
XK_r =                           0x0072, /* U+0072 LATIN SMALL LETTER R */
XK_s =                           0x0073, /* U+0073 LATIN SMALL LETTER S */
XK_t =                           0x0074, /* U+0074 LATIN SMALL LETTER T */
XK_u =                           0x0075, /* U+0075 LATIN SMALL LETTER U */
XK_v =                           0x0076, /* U+0076 LATIN SMALL LETTER V */
XK_w =                           0x0077, /* U+0077 LATIN SMALL LETTER W */
XK_x =                           0x0078, /* U+0078 LATIN SMALL LETTER X */
XK_y =                           0x0079, /* U+0079 LATIN SMALL LETTER Y */
XK_z =                           0x007a, /* U+007A LATIN SMALL LETTER Z */
XK_braceleft =                   0x007b, /* U+007B LEFT CURLY BRACKET */
XK_bar =                         0x007c, /* U+007C VERTICAL LINE */
XK_braceright =                  0x007d, /* U+007D RIGHT CURLY BRACKET */
XK_asciitilde =                  0x007e, /* U+007E TILDE */

XK_nobreakspace =                0x00a0, /* U+00A0 NO-BREAK SPACE */
XK_exclamdown =                  0x00a1, /* U+00A1 INVERTED EXCLAMATION MARK */
XK_cent =                        0x00a2, /* U+00A2 CENT SIGN */
XK_sterling =                    0x00a3, /* U+00A3 POUND SIGN */
XK_currency =                    0x00a4, /* U+00A4 CURRENCY SIGN */
XK_yen =                         0x00a5, /* U+00A5 YEN SIGN */
XK_brokenbar =                   0x00a6, /* U+00A6 BROKEN BAR */
XK_section =                     0x00a7, /* U+00A7 SECTION SIGN */
XK_diaeresis =                   0x00a8, /* U+00A8 DIAERESIS */
XK_copyright =                   0x00a9, /* U+00A9 COPYRIGHT SIGN */
XK_ordfeminine =                 0x00aa, /* U+00AA FEMININE ORDINAL INDICATOR */
XK_guillemotleft =               0x00ab, /* U+00AB LEFT-POINTING DOUBLE ANGLE QUOTATION MARK */
XK_notsign =                     0x00ac, /* U+00AC NOT SIGN */
XK_hyphen =                      0x00ad, /* U+00AD SOFT HYPHEN */
XK_registered =                  0x00ae, /* U+00AE REGISTERED SIGN */
XK_macron =                      0x00af, /* U+00AF MACRON */
XK_degree =                      0x00b0, /* U+00B0 DEGREE SIGN */
XK_plusminus =                   0x00b1, /* U+00B1 PLUS-MINUS SIGN */
XK_twosuperior =                 0x00b2, /* U+00B2 SUPERSCRIPT TWO */
XK_threesuperior =               0x00b3, /* U+00B3 SUPERSCRIPT THREE */
XK_acute =                       0x00b4, /* U+00B4 ACUTE ACCENT */
XK_mu =                          0x00b5, /* U+00B5 MICRO SIGN */
XK_paragraph =                   0x00b6, /* U+00B6 PILCROW SIGN */
XK_periodcentered =              0x00b7, /* U+00B7 MIDDLE DOT */
XK_cedilla =                     0x00b8, /* U+00B8 CEDILLA */
XK_onesuperior =                 0x00b9, /* U+00B9 SUPERSCRIPT ONE */
XK_masculine =                   0x00ba, /* U+00BA MASCULINE ORDINAL INDICATOR */
XK_guillemotright =              0x00bb, /* U+00BB RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK */
XK_onequarter =                  0x00bc, /* U+00BC VULGAR FRACTION ONE QUARTER */
XK_onehalf =                     0x00bd, /* U+00BD VULGAR FRACTION ONE HALF */
XK_threequarters =               0x00be, /* U+00BE VULGAR FRACTION THREE QUARTERS */
XK_questiondown =                0x00bf, /* U+00BF INVERTED QUESTION MARK */
XK_Agrave =                      0x00c0, /* U+00C0 LATIN CAPITAL LETTER A WITH GRAVE */
XK_Aacute =                      0x00c1, /* U+00C1 LATIN CAPITAL LETTER A WITH ACUTE */
XK_Acircumflex =                 0x00c2, /* U+00C2 LATIN CAPITAL LETTER A WITH CIRCUMFLEX */
XK_Atilde =                      0x00c3, /* U+00C3 LATIN CAPITAL LETTER A WITH TILDE */
XK_Adiaeresis =                  0x00c4, /* U+00C4 LATIN CAPITAL LETTER A WITH DIAERESIS */
XK_Aring =                       0x00c5, /* U+00C5 LATIN CAPITAL LETTER A WITH RING ABOVE */
XK_AE =                          0x00c6, /* U+00C6 LATIN CAPITAL LETTER AE */
XK_Ccedilla =                    0x00c7, /* U+00C7 LATIN CAPITAL LETTER C WITH CEDILLA */
XK_Egrave =                      0x00c8, /* U+00C8 LATIN CAPITAL LETTER E WITH GRAVE */
XK_Eacute =                      0x00c9, /* U+00C9 LATIN CAPITAL LETTER E WITH ACUTE */
XK_Ecircumflex =                 0x00ca, /* U+00CA LATIN CAPITAL LETTER E WITH CIRCUMFLEX */
XK_Ediaeresis =                  0x00cb, /* U+00CB LATIN CAPITAL LETTER E WITH DIAERESIS */
XK_Igrave =                      0x00cc, /* U+00CC LATIN CAPITAL LETTER I WITH GRAVE */
XK_Iacute =                      0x00cd, /* U+00CD LATIN CAPITAL LETTER I WITH ACUTE */
XK_Icircumflex =                 0x00ce, /* U+00CE LATIN CAPITAL LETTER I WITH CIRCUMFLEX */
XK_Idiaeresis =                  0x00cf, /* U+00CF LATIN CAPITAL LETTER I WITH DIAERESIS */
XK_ETH =                         0x00d0, /* U+00D0 LATIN CAPITAL LETTER ETH */
XK_Eth =                         0x00d0, /* deprecated */
XK_Ntilde =                      0x00d1, /* U+00D1 LATIN CAPITAL LETTER N WITH TILDE */
XK_Ograve =                      0x00d2, /* U+00D2 LATIN CAPITAL LETTER O WITH GRAVE */
XK_Oacute =                      0x00d3, /* U+00D3 LATIN CAPITAL LETTER O WITH ACUTE */
XK_Ocircumflex =                 0x00d4, /* U+00D4 LATIN CAPITAL LETTER O WITH CIRCUMFLEX */
XK_Otilde =                      0x00d5, /* U+00D5 LATIN CAPITAL LETTER O WITH TILDE */
XK_Odiaeresis =                  0x00d6, /* U+00D6 LATIN CAPITAL LETTER O WITH DIAERESIS */
XK_multiply =                    0x00d7, /* U+00D7 MULTIPLICATION SIGN */
XK_Oslash =                      0x00d8, /* U+00D8 LATIN CAPITAL LETTER O WITH STROKE */
XK_Ooblique =                    0x00d8, /* U+00D8 LATIN CAPITAL LETTER O WITH STROKE */
XK_Ugrave =                      0x00d9, /* U+00D9 LATIN CAPITAL LETTER U WITH GRAVE */
XK_Uacute =                      0x00da, /* U+00DA LATIN CAPITAL LETTER U WITH ACUTE */
XK_Ucircumflex =                 0x00db, /* U+00DB LATIN CAPITAL LETTER U WITH CIRCUMFLEX */
XK_Udiaeresis =                  0x00dc, /* U+00DC LATIN CAPITAL LETTER U WITH DIAERESIS */
XK_Yacute =                      0x00dd, /* U+00DD LATIN CAPITAL LETTER Y WITH ACUTE */
XK_THORN =                       0x00de, /* U+00DE LATIN CAPITAL LETTER THORN */
XK_Thorn =                       0x00de, /* deprecated */
XK_ssharp =                      0x00df, /* U+00DF LATIN SMALL LETTER SHARP S */
XK_agrave =                      0x00e0, /* U+00E0 LATIN SMALL LETTER A WITH GRAVE */
XK_aacute =                      0x00e1, /* U+00E1 LATIN SMALL LETTER A WITH ACUTE */
XK_acircumflex =                 0x00e2, /* U+00E2 LATIN SMALL LETTER A WITH CIRCUMFLEX */
XK_atilde =                      0x00e3, /* U+00E3 LATIN SMALL LETTER A WITH TILDE */
XK_adiaeresis =                  0x00e4, /* U+00E4 LATIN SMALL LETTER A WITH DIAERESIS */
XK_aring =                       0x00e5, /* U+00E5 LATIN SMALL LETTER A WITH RING ABOVE */
XK_ae =                          0x00e6, /* U+00E6 LATIN SMALL LETTER AE */
XK_ccedilla =                    0x00e7, /* U+00E7 LATIN SMALL LETTER C WITH CEDILLA */
XK_egrave =                      0x00e8, /* U+00E8 LATIN SMALL LETTER E WITH GRAVE */
XK_eacute =                      0x00e9, /* U+00E9 LATIN SMALL LETTER E WITH ACUTE */
XK_ecircumflex =                 0x00ea, /* U+00EA LATIN SMALL LETTER E WITH CIRCUMFLEX */
XK_ediaeresis =                  0x00eb, /* U+00EB LATIN SMALL LETTER E WITH DIAERESIS */
XK_igrave =                      0x00ec, /* U+00EC LATIN SMALL LETTER I WITH GRAVE */
XK_iacute =                      0x00ed, /* U+00ED LATIN SMALL LETTER I WITH ACUTE */
XK_icircumflex =                 0x00ee, /* U+00EE LATIN SMALL LETTER I WITH CIRCUMFLEX */
XK_idiaeresis =                  0x00ef, /* U+00EF LATIN SMALL LETTER I WITH DIAERESIS */
XK_eth =                         0x00f0, /* U+00F0 LATIN SMALL LETTER ETH */
XK_ntilde =                      0x00f1, /* U+00F1 LATIN SMALL LETTER N WITH TILDE */
XK_ograve =                      0x00f2, /* U+00F2 LATIN SMALL LETTER O WITH GRAVE */
XK_oacute =                      0x00f3, /* U+00F3 LATIN SMALL LETTER O WITH ACUTE */
XK_ocircumflex =                 0x00f4, /* U+00F4 LATIN SMALL LETTER O WITH CIRCUMFLEX */
XK_otilde =                      0x00f5, /* U+00F5 LATIN SMALL LETTER O WITH TILDE */
XK_odiaeresis =                  0x00f6, /* U+00F6 LATIN SMALL LETTER O WITH DIAERESIS */
XK_division =                    0x00f7, /* U+00F7 DIVISION SIGN */
XK_oslash =                      0x00f8, /* U+00F8 LATIN SMALL LETTER O WITH STROKE */
XK_ooblique =                    0x00f8, /* U+00F8 LATIN SMALL LETTER O WITH STROKE */
XK_ugrave =                      0x00f9, /* U+00F9 LATIN SMALL LETTER U WITH GRAVE */
XK_uacute =                      0x00fa, /* U+00FA LATIN SMALL LETTER U WITH ACUTE */
XK_ucircumflex =                 0x00fb, /* U+00FB LATIN SMALL LETTER U WITH CIRCUMFLEX */
XK_udiaeresis =                  0x00fc, /* U+00FC LATIN SMALL LETTER U WITH DIAERESIS */
XK_yacute =                      0x00fd, /* U+00FD LATIN SMALL LETTER Y WITH ACUTE */
XK_thorn =                       0x00fe, /* U+00FE LATIN SMALL LETTER THORN */
XK_ydiaeresis =                  0x00ff; /* U+00FF LATIN SMALL LETTER Y WITH DIAERESIS */

var UI;

(function () {
    "use strict";

    // Load supporting scripts
    window.onscriptsload = function () { UI.load(); };
    Util.load_scripts(["webutil.js", "base64.js", "websock.js", "des.js",
                       "keysymdef.js", "keyboard.js", "input.js", "display.js",
                       "rfb.js", "keysym.js", "inflator.js"]);

    UI = {

        rfb_state: 'loaded',

        resizeTimeout: null,
        popupStatusTimeout: null,
        hideKeyboardTimeout: null,

        settingsOpen: false,
        connSettingsOpen: false,
        clipboardOpen: false,
        keyboardVisible: false,

        isTouchDevice: false,
        isSafari: false,
        rememberedClipSetting: null,
        lastKeyboardinput: null,
        defaultKeyboardinputLen: 100,

        shiftDown: false,
        ctrlDown: false,
        altDown: false,
        altGrDown: false,

        // Setup rfb object, load settings from browser storage, then call
        // UI.init to setup the UI/menus
        load: function(callback) {
            WebUtil.initSettings(UI.start, callback);
        },

        // Render default UI and initialize settings menu
        start: function(callback) {
            UI.isTouchDevice = 'ontouchstart' in document.documentElement;

            // Stylesheet selection dropdown
            var sheet = WebUtil.selectStylesheet();
            var sheets = WebUtil.getStylesheets();
            var i;
            for (i = 0; i < sheets.length; i += 1) {
                UI.addOption($D('noVNC_setting_stylesheet'),sheets[i].title, sheets[i].title);
            }

            // Logging selection dropdown
            var llevels = ['error', 'warn', 'info', 'debug'];
            for (i = 0; i < llevels.length; i += 1) {
                UI.addOption($D('noVNC_setting_logging'),llevels[i], llevels[i]);
            }

            // Settings with immediate effects
            UI.initSetting('logging', 'warn');
            WebUtil.init_logging(UI.getSetting('logging'));

            UI.initSetting('stylesheet', 'default');
            WebUtil.selectStylesheet(null);
            // call twice to get around webkit bug
            WebUtil.selectStylesheet(UI.getSetting('stylesheet'));

            // if port == 80 (or 443) then it won't be present and should be
            // set manually
            var port = window.location.port;
            if (!port) {
                if (window.location.protocol.substring(0,5) == 'https') {
                    port = 443;
                }
                else if (window.location.protocol.substring(0,4) == 'http') {
                    port = 80;
                }
            }

            /* Populate the controls if defaults are provided in the URL */
            UI.initSetting('host', window.location.hostname);
            UI.initSetting('port', port);
            UI.initSetting('password', '');
            UI.initSetting('encrypt', (window.location.protocol === "https:"));
            UI.initSetting('true_color', true);
            UI.initSetting('cursor', !UI.isTouchDevice);
            UI.initSetting('resize', 'off');
            UI.initSetting('shared', true);
            UI.initSetting('view_only', false);
            UI.initSetting('path', 'websockify');
            UI.initSetting('repeaterID', '');
            UI.initSetting('token', '');

            var autoconnect = WebUtil.getConfigVar('autoconnect', false);
            if (autoconnect === 'true' || autoconnect == '1') {
                autoconnect = true;
                UI.connect();
            } else {
                autoconnect = false;
            }

            UI.updateVisualState();

            $D('noVNC_setting_host').focus();

            // Show mouse selector buttons on touch screen devices
            if (UI.isTouchDevice) {
                // Show mobile buttons
                $D('noVNC_mobile_buttons').style.display = "inline";
                UI.setMouseButton();
                // Remove the address bar
                setTimeout(function() { window.scrollTo(0, 1); }, 100);
                UI.forceSetting('clip', true);
            } else {
                UI.initSetting('clip', false);
            }

            UI.setViewClip();
            UI.setBarPosition();

            Util.addEvent(window, 'resize', function () {
                UI.applyResizeMode();
                UI.setViewClip();
                UI.updateViewDrag();
                UI.setBarPosition();
            } );

            UI.isSafari = (navigator.userAgent.indexOf('Safari') != -1 &&
                           navigator.userAgent.indexOf('Chrome') == -1);

            // Only show the button if fullscreen is properly supported
            // * Safari doesn't support alphanumerical input while in fullscreen
            if (!UI.isSafari &&
                (document.documentElement.requestFullscreen ||
                 document.documentElement.mozRequestFullScreen ||
                 document.documentElement.webkitRequestFullscreen ||
                 document.body.msRequestFullscreen)) {
                $D('noVNC_fullscreen_button').style.display = "inline";
                Util.addEvent(window, 'fullscreenchange', UI.updateFullscreenButton);
                Util.addEvent(window, 'mozfullscreenchange', UI.updateFullscreenButton);
                Util.addEvent(window, 'webkitfullscreenchange', UI.updateFullscreenButton);
                Util.addEvent(window, 'msfullscreenchange', UI.updateFullscreenButton);
            }

            Util.addEvent(window, 'load', UI.keyboardinputReset);

            Util.addEvent(window, 'beforeunload', function () {
                if (UI.rfb && UI.rfb_state === 'normal') {
                    return "You are currently connected.";
                }
            } );

            // Show description by default when hosted at for kanaka.github.com
            if (location.host === "kanaka.github.io") {
                // Open the description dialog
                $D('noVNC_description').style.display = "block";
            } else {
                // Show the connect panel on first load unless autoconnecting
                if (autoconnect === UI.connSettingsOpen) {
                    UI.toggleConnectPanel();
                }
            }

            // Add mouse event click/focus/blur event handlers to the UI
            UI.addMouseHandlers();

            if (typeof callback === "function") {
                callback(UI.rfb);
            }
        },

        initRFB: function() {
            try {
                UI.rfb = new RFB({'target': $D('noVNC_canvas'),
                                  'onUpdateState': UI.updateState,
                                  'onXvpInit': UI.updateXvpButton,
                                  'onClipboard': UI.clipboardReceive,
                                  'onFBUComplete': UI.initialResize,
                                  'onFBResize': UI.updateViewDrag,
                                  'onDesktopName': UI.updateDocumentTitle});
                return true;
            } catch (exc) {
                UI.updateState(null, 'fatal', null, 'Unable to create RFB client -- ' + exc);
                return false;
            }
        },

        addMouseHandlers: function() {
            // Setup interface handlers that can't be inline
            $D("noVNC_view_drag_button").onclick = UI.toggleViewDrag;
            $D("noVNC_mouse_button0").onclick = function () { UI.setMouseButton(1); };
            $D("noVNC_mouse_button1").onclick = function () { UI.setMouseButton(2); };
            $D("noVNC_mouse_button2").onclick = function () { UI.setMouseButton(4); };
            $D("noVNC_mouse_button4").onclick = function () { UI.setMouseButton(0); };
            $D("noVNC_keyboard_button").onclick = UI.showKeyboard;

            $D("noVNC_keyboardinput").oninput = UI.keyInput;
            $D("noVNC_keyboardinput").onblur = UI.hideKeyboard;
            $D("noVNC_keyboardinput").onsubmit = function () { return false; };

            $D("noVNC_toggleExtraKeys_button").onclick = UI.toggleExtraKeys;
            $D("noVNC_toggleCtrl_button").onclick = UI.toggleCtrl;
            $D("noVNC_toggleAlt_button").onclick = UI.toggleAlt;
            $D("noVNC_sendTab_button").onclick = UI.sendTab;
            $D("noVNC_sendEsc_button").onclick = UI.sendEsc;

            $D("noVNC_sendCtrlAltDel_button").onclick = UI.sendCtrlAltDel;
            $D("noVNC_xvpShutdown_button").onclick = function() { UI.rfb.xvpShutdown(); },
            $D("noVNC_xvpReboot_button").onclick = function() { UI.rfb.xvpReboot(); },
            $D("noVNC_xvpReset_button").onclick = function() { UI.rfb.xvpReset(); },
            $D("noVNC_status").onclick = UI.popupStatus;
            $D("noVNC_popup_status").onclick = UI.closePopup;
            $D("noVNC_toggleXvp_button").onclick = UI.toggleXvpPanel;
            $D("noVNC_clipboard_button").onclick = UI.toggleClipboardPanel;
            $D("noVNC_fullscreen_button").onclick = UI.toggleFullscreen;
            $D("noVNC_settings_button").onclick = UI.toggleSettingsPanel;
            $D("noVNC_connectPanel_button").onclick = UI.toggleConnectPanel;
            $D("noVNC_disconnect_button").onclick = UI.disconnect;
            $D("noVNC_description_button").onclick = UI.toggleConnectPanel;

            $D("noVNC_clipboard_text").onfocus = UI.displayBlur;
            $D("noVNC_clipboard_text").onblur = UI.displayFocus;
            $D("noVNC_clipboard_text").onchange = UI.clipboardSend;
            $D("noVNC_clipboard_clear_button").onclick = UI.clipboardClear;

            $D("noVNC_settings_menu").onmouseover = UI.displayBlur;
            $D("noVNC_settings_menu").onmouseover = UI.displayFocus;
            $D("noVNC_settings_apply").onclick = UI.settingsApply;

            $D("noVNC_connect_button").onclick = UI.connect;

            $D("noVNC_setting_resize").onchange = UI.enableDisableViewClip;
        },

/* ------^-------
 *     /INIT
 * ==============
 *     VISUAL
 * ------v------*/

        updateState: function(rfb, state, oldstate, msg) {
            UI.rfb_state = state;
            var klass;
            switch (state) {
                case 'failed':
                case 'fatal':
                    klass = "noVNC_status_error";
                    break;
                case 'normal':
                    klass = "noVNC_status_normal";
                    break;
                case 'disconnected':
                    $D('noVNC_logo').style.display = "block";
                    $D('noVNC_screen').style.display = "none";
                    /* falls through */
                case 'loaded':
                    klass = "noVNC_status_normal";
                    break;
                case 'password':
                    UI.toggleConnectPanel();

                    $D('noVNC_connect_button').value = "Send Password";
                    $D('noVNC_connect_button').onclick = UI.setPassword;
                    $D('noVNC_setting_password').focus();

                    klass = "noVNC_status_warn";
                    break;
                default:
                    klass = "noVNC_status_warn";
                    break;
            }

            if (typeof(msg) !== 'undefined') {
                $D('noVNC_control_bar').setAttribute("class", klass);
                $D('noVNC_status').innerHTML = msg;
            }

            UI.updateVisualState();
        },

        // Disable/enable controls depending on connection state
        updateVisualState: function() {
            var connected = UI.rfb && UI.rfb_state === 'normal';

            //Util.Debug(">> updateVisualState");
            $D('noVNC_setting_encrypt').disabled = connected;
            $D('noVNC_setting_true_color').disabled = connected;
            if (Util.browserSupportsCursorURIs()) {
                $D('noVNC_setting_cursor').disabled = connected;
            } else {
                UI.updateSetting('cursor', !UI.isTouchDevice);
                $D('noVNC_setting_cursor').disabled = true;
            }

            UI.enableDisableViewClip();
            $D('noVNC_setting_resize').disabled = connected;
            $D('noVNC_setting_shared').disabled = connected;
            $D('noVNC_setting_view_only').disabled = connected;
            $D('noVNC_setting_path').disabled = connected;
            $D('noVNC_setting_repeaterID').disabled = connected;

            if (connected) {
                UI.setViewClip();
                UI.setMouseButton(1);
                $D('noVNC_clipboard_button').style.display = "inline";
                $D('noVNC_keyboard_button').style.display = "inline";
                $D('noVNC_extra_keys').style.display = "";
                $D('noVNC_sendCtrlAltDel_button').style.display = "inline";
            } else {
                UI.setMouseButton();
                $D('noVNC_clipboard_button').style.display = "none";
                $D('noVNC_keyboard_button').style.display = "none";
                $D('noVNC_extra_keys').style.display = "none";
                $D('noVNC_sendCtrlAltDel_button').style.display = "none";
                UI.updateXvpButton(0);
            }

            // State change disables viewport dragging.
            // It is enabled (toggled) by direct click on the button
            UI.updateViewDrag(false);

            switch (UI.rfb_state) {
                case 'fatal':
                case 'failed':
                case 'disconnected':
                    $D('noVNC_connectPanel_button').style.display = "";
                    $D('noVNC_disconnect_button').style.display = "none";
                    UI.connSettingsOpen = false;
                    UI.toggleConnectPanel();
                    break;
                case 'loaded':
                    $D('noVNC_connectPanel_button').style.display = "";
                    $D('noVNC_disconnect_button').style.display = "none";
                    break;
                default:
                    $D('noVNC_connectPanel_button').style.display = "none";
                    $D('noVNC_disconnect_button').style.display = "";
                    break;
            }

            //Util.Debug("<< updateVisualState");
        },

        popupStatus: function(text) {
            var psp = $D('noVNC_popup_status');

            clearTimeout(UI.popupStatusTimeout);

            if (typeof text === 'string') {
                psp.innerHTML = text;
            } else {
                psp.innerHTML = $D('noVNC_status').innerHTML;
            }
            psp.style.display = "block";
            psp.style.left = window.innerWidth/2 -
                parseInt(window.getComputedStyle(psp).width)/2 -30 + "px";

            // Show the popup for a maximum of 1.5 seconds
            UI.popupStatusTimeout = setTimeout(function() {
                UI.closePopup();
            }, 1500);
        },

        closePopup: function() {
            clearTimeout(UI.popupStatusTimeout);
            $D('noVNC_popup_status').style.display = "none";
        },

/* ------^-------
 *    /VISUAL
 * ==============
 *    SETTINGS
 * ------v------*/

        // Initial page load read/initialization of settings
        initSetting: function(name, defVal) {
            // Check Query string followed by cookie
            var val = WebUtil.getConfigVar(name);
            if (val === null) {
                val = WebUtil.readSetting(name, defVal);
            }
            UI.updateSetting(name, val);
            return val;
        },

        // Update cookie and form control setting. If value is not set, then
        // updates from control to current cookie setting.
        updateSetting: function(name, value) {

            // Save the cookie for this session
            if (typeof value !== 'undefined') {
                WebUtil.writeSetting(name, value);
            }

            // Update the settings control
            value = UI.getSetting(name);

            var ctrl = $D('noVNC_setting_' + name);
            if (ctrl.type === 'checkbox') {
                ctrl.checked = value;

            } else if (typeof ctrl.options !== 'undefined') {
                for (var i = 0; i < ctrl.options.length; i += 1) {
                    if (ctrl.options[i].value === value) {
                        ctrl.selectedIndex = i;
                        break;
                    }
                }
            } else {
                /*Weird IE9 error leads to 'null' appearring
                in textboxes instead of ''.*/
                if (value === null) {
                    value = "";
                }
                ctrl.value = value;
            }
        },

        // Save control setting to cookie
        saveSetting: function(name) {
            var val, ctrl = $D('noVNC_setting_' + name);
            if (ctrl.type === 'checkbox') {
                val = ctrl.checked;
            } else if (typeof ctrl.options !== 'undefined') {
                val = ctrl.options[ctrl.selectedIndex].value;
            } else {
                val = ctrl.value;
            }
            WebUtil.writeSetting(name, val);
            //Util.Debug("Setting saved '" + name + "=" + val + "'");
            return val;
        },

        // Force a setting to be a certain value
        forceSetting: function(name, val) {
            UI.updateSetting(name, val);
            return val;
        },

        // Read form control compatible setting from cookie
        getSetting: function(name) {
            var ctrl = $D('noVNC_setting_' + name);
            var val = WebUtil.readSetting(name);
            if (typeof val !== 'undefined' && val !== null && ctrl.type === 'checkbox') {
                if (val.toString().toLowerCase() in {'0':1, 'no':1, 'false':1}) {
                    val = false;
                } else {
                    val = true;
                }
            }
            return val;
        },

        // Save/apply settings when 'Apply' button is pressed
        settingsApply: function() {
            //Util.Debug(">> settingsApply");
            UI.saveSetting('encrypt');
            UI.saveSetting('true_color');
            if (Util.browserSupportsCursorURIs()) {
                UI.saveSetting('cursor');
            }

            UI.saveSetting('resize');

            if (UI.getSetting('resize') === 'downscale' || UI.getSetting('resize') === 'scale') {
                UI.forceSetting('clip', false);
            }

            UI.saveSetting('clip');
            UI.saveSetting('shared');
            UI.saveSetting('view_only');
            UI.saveSetting('path');
            UI.saveSetting('repeaterID');
            UI.saveSetting('stylesheet');
            UI.saveSetting('logging');

            // Settings with immediate (non-connected related) effect
            WebUtil.selectStylesheet(UI.getSetting('stylesheet'));
            WebUtil.init_logging(UI.getSetting('logging'));
            UI.setViewClip();
            UI.updateViewDrag();
            //Util.Debug("<< settingsApply");
        },

        // Open menu
        openSettingsMenu: function() {
            // Close the description panel
            $D('noVNC_description').style.display = "none";
            // Close clipboard panel if open
            if (UI.clipboardOpen === true) {
                UI.toggleClipboardPanel();
            }
            // Close connection settings if open
            if (UI.connSettingsOpen === true) {
                UI.toggleConnectPanel();
            }
            // Close XVP panel if open
            if (UI.xvpOpen === true) {
                UI.toggleXvpPanel();
            }
            $D('noVNC_settings').style.display = "block";
            $D('noVNC_settings_button').className = "noVNC_status_button_selected";
            UI.settingsOpen = true;
        },

        // Close menu (without applying settings)
        closeSettingsMenu: function() {
            $D('noVNC_settings').style.display = "none";
            $D('noVNC_settings_button').className = "noVNC_status_button";
            UI.settingsOpen = false;
        },

        // Toggle the settings menu:
        //   On open, settings are refreshed from saved cookies.
        //   On close, settings are applied
        toggleSettingsPanel: function() {
            // Close the description panel
            $D('noVNC_description').style.display = "none";
            if (UI.settingsOpen) {
                UI.settingsApply();
                UI.closeSettingsMenu();
            } else {
                UI.updateSetting('encrypt');
                UI.updateSetting('true_color');
                if (Util.browserSupportsCursorURIs()) {
                    UI.updateSetting('cursor');
                } else {
                    UI.updateSetting('cursor', !UI.isTouchDevice);
                    $D('noVNC_setting_cursor').disabled = true;
                }
                UI.updateSetting('clip');
                UI.updateSetting('resize');
                UI.updateSetting('shared');
                UI.updateSetting('view_only');
                UI.updateSetting('path');
                UI.updateSetting('repeaterID');
                UI.updateSetting('stylesheet');
                UI.updateSetting('logging');

                UI.openSettingsMenu();
            }
        },

/* ------^-------
 *   /SETTINGS
 * ==============
 *      XVP
 * ------v------*/

        // Show the XVP panel
        toggleXvpPanel: function() {
            // Close the description panel
            $D('noVNC_description').style.display = "none";
            // Close settings if open
            if (UI.settingsOpen === true) {
                UI.settingsApply();
                UI.closeSettingsMenu();
            }
            // Close connection settings if open
            if (UI.connSettingsOpen === true) {
                UI.toggleConnectPanel();
            }
            // Close clipboard panel if open
            if (UI.clipboardOpen === true) {
                UI.toggleClipboardPanel();
            }
            // Toggle XVP panel
            if (UI.xvpOpen === true) {
                $D('noVNC_xvp').style.display = "none";
                $D('noVNC_toggleXvp_button').className = "noVNC_status_button";
                UI.xvpOpen = false;
            } else {
                $D('noVNC_xvp').style.display = "block";
                $D('noVNC_toggleXvp_button').className = "noVNC_status_button_selected";
                UI.xvpOpen = true;
            }
        },

        // Disable/enable XVP button
        updateXvpButton: function(ver) {
            if (ver >= 1) {
                $D('noVNC_toggleXvp_button').style.display = 'inline';
            } else {
                $D('noVNC_toggleXvp_button').style.display = 'none';
                // Close XVP panel if open
                if (UI.xvpOpen === true) {
                    UI.toggleXvpPanel();
                }
            }
        },

/* ------^-------
 *     /XVP
 * ==============
 *   CLIPBOARD
 * ------v------*/

        // Show the clipboard panel
        toggleClipboardPanel: function() {
            // Close the description panel
            $D('noVNC_description').style.display = "none";
            // Close settings if open
            if (UI.settingsOpen === true) {
                UI.settingsApply();
                UI.closeSettingsMenu();
            }
            // Close connection settings if open
            if (UI.connSettingsOpen === true) {
                UI.toggleConnectPanel();
            }
            // Close XVP panel if open
            if (UI.xvpOpen === true) {
                UI.toggleXvpPanel();
            }
            // Toggle Clipboard Panel
            if (UI.clipboardOpen === true) {
                $D('noVNC_clipboard').style.display = "none";
                $D('noVNC_clipboard_button').className = "noVNC_status_button";
                UI.clipboardOpen = false;
            } else {
                $D('noVNC_clipboard').style.display = "block";
                $D('noVNC_clipboard_button').className = "noVNC_status_button_selected";
                UI.clipboardOpen = true;
            }
        },

        clipboardReceive: function(rfb, text) {
            Util.Debug(">> UI.clipboardReceive: " + text.substr(0,40) + "...");
            $D('noVNC_clipboard_text').value = text;
            Util.Debug("<< UI.clipboardReceive");
        },

        clipboardClear: function() {
            $D('noVNC_clipboard_text').value = "";
            UI.rfb.clipboardPasteFrom("");
        },

        clipboardSend: function() {
            var text = $D('noVNC_clipboard_text').value;
            Util.Debug(">> UI.clipboardSend: " + text.substr(0,40) + "...");
            UI.rfb.clipboardPasteFrom(text);
            Util.Debug("<< UI.clipboardSend");
        },

/* ------^-------
 *  /CLIPBOARD
 * ==============
 *  CONNECTION
 * ------v------*/

        // Show the connection settings panel/menu
        toggleConnectPanel: function() {
            // Close the description panel
            $D('noVNC_description').style.display = "none";
            // Close connection settings if open
            if (UI.settingsOpen === true) {
                UI.settingsApply();
                UI.closeSettingsMenu();
                $D('noVNC_connectPanel_button').className = "noVNC_status_button";
            }
            // Close clipboard panel if open
            if (UI.clipboardOpen === true) {
                UI.toggleClipboardPanel();
            }
            // Close XVP panel if open
            if (UI.xvpOpen === true) {
                UI.toggleXvpPanel();
            }

            // Toggle Connection Panel
            if (UI.connSettingsOpen === true) {
                $D('noVNC_controls').style.display = "none";
                $D('noVNC_connectPanel_button').className = "noVNC_status_button";
                UI.connSettingsOpen = false;
                UI.saveSetting('host');
                UI.saveSetting('port');
                UI.saveSetting('token');
                //UI.saveSetting('password');
            } else {
                $D('noVNC_controls').style.display = "block";
                $D('noVNC_connectPanel_button').className = "noVNC_status_button_selected";
                UI.connSettingsOpen = true;
                $D('noVNC_setting_host').focus();
            }
        },

        connect: function() {
            UI.closeSettingsMenu();
            UI.toggleConnectPanel();

            var host = $D('noVNC_setting_host').value;
            var port = $D('noVNC_setting_port').value;
            var password = $D('noVNC_setting_password').value;
            var token = $D('noVNC_setting_token').value;
            var path = $D('noVNC_setting_path').value;

            //if token is in path then ignore the new token variable
            if (token) {
                path = WebUtil.injectParamIfMissing(path, "token", token);
            }

            if ((!host) || (!port)) {
                throw new Error("Must set host and port");
            }

            if (!UI.initRFB()) return;

            UI.rfb.set_encrypt(UI.getSetting('encrypt'));
            UI.rfb.set_true_color(UI.getSetting('true_color'));
            UI.rfb.set_local_cursor(UI.getSetting('cursor'));
            UI.rfb.set_shared(UI.getSetting('shared'));
            UI.rfb.set_view_only(UI.getSetting('view_only'));
            UI.rfb.set_repeaterID(UI.getSetting('repeaterID'));

            UI.rfb.connect(host, port, password, path);

            //Close dialog.
            setTimeout(function () { UI.setBarPosition; } );
            $D('noVNC_logo').style.display = "none";
            $D('noVNC_screen').style.display = "inline";
        },

        disconnect: function() {
            UI.closeSettingsMenu();
            UI.rfb.disconnect();

            // Restore the callback used for initial resize
            UI.rfb.set_onFBUComplete(UI.initialResize);

            $D('noVNC_logo').style.display = "block";
            $D('noVNC_screen').style.display = "none";

            // Don't display the connection settings until we're actually disconnected
        },

        setPassword: function() {
            UI.rfb.sendPassword($D('noVNC_setting_password').value);
            //Reset connect button.
            $D('noVNC_connect_button').value = "Connect";
            $D('noVNC_connect_button').onclick = UI.connect;
            //Hide connection panel.
            UI.toggleConnectPanel();
            return false;
        },

/* ------^-------
 *  /CONNECTION
 * ==============
 *   FULLSCREEN
 * ------v------*/

        toggleFullscreen: function() {
            if (document.fullscreenElement || // alternative standard method
                document.mozFullScreenElement || // currently working methods
                document.webkitFullscreenElement ||
                document.msFullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (document.body.msRequestFullscreen) {
                    document.body.msRequestFullscreen();
                }
            }
            UI.enableDisableViewClip();
            UI.updateFullscreenButton();
        },

        updateFullscreenButton: function() {
            if (document.fullscreenElement || // alternative standard method
                document.mozFullScreenElement || // currently working methods
                document.webkitFullscreenElement ||
                document.msFullscreenElement ) {
                $D('noVNC_fullscreen_button').className = "noVNC_status_button_selected";
            } else {
                $D('noVNC_fullscreen_button').className = "noVNC_status_button";
            }
        },

/* ------^-------
 *  /FULLSCREEN
 * ==============
 *     RESIZE
 * ------v------*/

        // Apply remote resizing or local scaling
        applyResizeMode: function() {
            if (!UI.rfb) return;

            var screen = UI.screenSize();

            if (screen && UI.rfb_state === 'normal' && UI.rfb.get_display()) {

                var display = UI.rfb.get_display();
                var resizeMode = UI.getSetting('resize');

                if (resizeMode === 'remote') {

                    // Request changing the resolution of the remote display to
                    // the size of the local browser viewport.

                    // In order to not send multiple requests before the browser-resize
                    // is finished we wait 0.5 seconds before sending the request.
                    clearTimeout(UI.resizeTimeout);
                    UI.resizeTimeout = setTimeout(function(){

                        // Limit the viewport to the size of the browser window
                        display.set_maxWidth(screen.w);
                        display.set_maxHeight(screen.h);

                        Util.Debug('Attempting requestDesktopSize(' +
                                   screen.w + ', ' + screen.h + ')');

                        // Request a remote size covering the viewport
                        UI.rfb.requestDesktopSize(screen.w, screen.h);
                    }, 500);

                } else if (resizeMode === 'scale' || resizeMode === 'downscale') {
                    var downscaleOnly = resizeMode === 'downscale';
                    var scaleRatio = display.autoscale(screen.w, screen.h, downscaleOnly);
                    UI.rfb.get_mouse().set_scale(scaleRatio);
                    Util.Debug('Scaling by ' + UI.rfb.get_mouse().get_scale());
                }
            }
        },

        // The screen is always the same size as the available viewport
        // in the browser window minus the height of the control bar
        screenSize: function() {
            var screen = $D('noVNC_screen');

            // Hide the scrollbars until the size is calculated
            screen.style.overflow = "hidden";

            var pos = Util.getPosition(screen);
            var w = pos.width;
            var h = pos.height;

            screen.style.overflow = "visible";

            if (isNaN(w) || isNaN(h)) {
                return false;
            } else {
                return {w: w, h: h};
            }
        },

        // Normally we only apply the current resize mode after a window resize
        // event. This means that when a new connection is opened, there is no
        // resize mode active.
        // We have to wait until the first FBU because this is where the client
        // will find the supported encodings of the server. Some calls later in
        // the chain is dependant on knowing the server-capabilities.
        initialResize: function(rfb, fbu) {
            UI.applyResizeMode();
            // After doing this once, we remove the callback.
            UI.rfb.set_onFBUComplete(function() { });
        },

/* ------^-------
 *    /RESIZE
 * ==============
 *    CLIPPING
 * ------v------*/

        // Set and configure viewport clipping
        setViewClip: function(clip) {
            var display;
            if (UI.rfb) {
                display = UI.rfb.get_display();
            } else {
                UI.forceSetting('clip', clip);
                return;
            }

            var cur_clip = display.get_viewport();

            if (typeof(clip) !== 'boolean') {
                // Use current setting
                clip = UI.getSetting('clip');
            }

            if (clip && !cur_clip) {
                // Turn clipping on
                UI.updateSetting('clip', true);
            } else if (!clip && cur_clip) {
                // Turn clipping off
                UI.updateSetting('clip', false);
                display.set_viewport(false);
                // Disable max dimensions
                display.set_maxWidth(0);
                display.set_maxHeight(0);
                display.viewportChangeSize();
            }
            if (UI.getSetting('clip')) {
                // If clipping, update clipping settings
                display.set_viewport(true);

                var size = UI.screenSize();
                if (size) {
                    display.set_maxWidth(size.w);
                    display.set_maxHeight(size.h);

                    // Hide potential scrollbars that can skew the position
                    $D('noVNC_screen').style.overflow = "hidden";

                    // The x position marks the left margin of the canvas,
                    // remove the margin from both sides to keep it centered
                    var new_w = size.w - (2 * Util.getPosition($D('noVNC_canvas')).x);

                    $D('noVNC_screen').style.overflow = "visible";

                    display.viewportChangeSize(new_w, size.h);
                }
            }
        },

        // Handle special cases where clipping is forced on/off or locked
        enableDisableViewClip: function() {
            var resizeSetting = $D('noVNC_setting_resize');
            var connected = UI.rfb && UI.rfb_state === 'normal';

            if (UI.isSafari) {
                // Safari auto-hides the scrollbars which makes them
                // impossible to use in most cases
                UI.setViewClip(true);
                $D('noVNC_setting_clip').disabled = true;
            } else if (resizeSetting.value === 'downscale' || resizeSetting.value === 'scale') {
                // Disable clipping if we are scaling
                UI.setViewClip(false);
                $D('noVNC_setting_clip').disabled = true;
            } else if (document.msFullscreenElement) {
                // The browser is IE and we are in fullscreen mode.
                // - We need to force clipping while in fullscreen since
                //   scrollbars doesn't work.
                UI.popupStatus("Forcing clipping mode since scrollbars aren't supported by IE in fullscreen");
                UI.rememberedClipSetting = UI.getSetting('clip');
                UI.setViewClip(true);
                $D('noVNC_setting_clip').disabled = true;
            } else if (document.body.msRequestFullscreen && UI.rememberedClip !== null) {
                // Restore view clip to what it was before fullscreen on IE
                UI.setViewClip(UI.rememberedClipSetting);
                $D('noVNC_setting_clip').disabled = connected || UI.isTouchDevice;
            } else {
                $D('noVNC_setting_clip').disabled = connected || UI.isTouchDevice;
                if (UI.isTouchDevice) {
                    UI.setViewClip(true);
                }
            }
        },

/* ------^-------
 *   /CLIPPING
 * ==============
 *    VIEWDRAG
 * ------v------*/

        // Update the viewport drag state
        updateViewDrag: function(drag) {
            if (!UI.rfb) return;

            var viewDragButton = $D('noVNC_view_drag_button');

            // Check if viewport drag is possible. It is only possible
            // if the remote display is clipping the client display.
            if (UI.rfb_state === 'normal' &&
                UI.rfb.get_display().get_viewport() &&
                UI.rfb.get_display().clippingDisplay()) {

                viewDragButton.style.display = "inline";
                viewDragButton.disabled = false;

            } else {
                // The size of the remote display is the same or smaller
                // than the client display. Make sure viewport drag isn't
                // active when it can't be used.
                if (UI.rfb.get_viewportDrag) {
                    viewDragButton.className = "noVNC_status_button";
                    UI.rfb.set_viewportDrag(false);
                }

                // The button is disabled instead of hidden on touch devices
                if (UI.rfb_state === 'normal' && UI.isTouchDevice) {
                    viewDragButton.style.display = "inline";
                    viewDragButton.disabled = true;
                } else {
                    viewDragButton.style.display = "none";
                }
                return;
            }

            if (typeof(drag) !== "undefined" &&
                typeof(drag) !== "object") {
                if (drag) {
                    viewDragButton.className = "noVNC_status_button_selected";
                    UI.rfb.set_viewportDrag(true);
                } else {
                    viewDragButton.className = "noVNC_status_button";
                    UI.rfb.set_viewportDrag(false);
                }
            }
        },

        toggleViewDrag: function() {
            if (!UI.rfb) return;

            var viewDragButton = $D('noVNC_view_drag_button');
            if (UI.rfb.get_viewportDrag()) {
                viewDragButton.className = "noVNC_status_button";
                UI.rfb.set_viewportDrag(false);
            } else {
                viewDragButton.className = "noVNC_status_button_selected";
                UI.rfb.set_viewportDrag(true);
            }
        },

/* ------^-------
 *   /VIEWDRAG
 * ==============
 *    KEYBOARD
 * ------v------*/

        // On touch devices, show the OS keyboard
        showKeyboard: function() {
            var kbi = $D('noVNC_keyboardinput');
            var skb = $D('noVNC_keyboard_button');
            var l = kbi.value.length;
            if(UI.keyboardVisible === false) {
                kbi.focus();
                try { kbi.setSelectionRange(l, l); } // Move the caret to the end
                catch (err) {} // setSelectionRange is undefined in Google Chrome
                UI.keyboardVisible = true;
                skb.className = "noVNC_status_button_selected";
            } else if(UI.keyboardVisible === true) {
                kbi.blur();
                skb.className = "noVNC_status_button";
                UI.keyboardVisible = false;
            }
        },

        hideKeyboard: function() {
            $D('noVNC_keyboard_button').className = "noVNC_status_button";
            //Weird bug in iOS if you change keyboardVisible
            //here it does not actually occur so next time
            //you click keyboard icon it doesnt work.
            UI.hideKeyboardTimeout = setTimeout(function() {
                UI.keyboardVisible = false;
            },100);
        },

        keepKeyboard: function() {
            clearTimeout(UI.hideKeyboardTimeout);
            if(UI.keyboardVisible === true) {
                $D('noVNC_keyboardinput').focus();
                $D('noVNC_keyboard_button').className = "noVNC_status_button_selected";
            } else if(UI.keyboardVisible === false) {
                $D('noVNC_keyboardinput').blur();
                $D('noVNC_keyboard_button').className = "noVNC_status_button";
            }
        },

        keyboardinputReset: function() {
            var kbi = $D('noVNC_keyboardinput');
            kbi.value = new Array(UI.defaultKeyboardinputLen).join("_");
            UI.lastKeyboardinput = kbi.value;
        },

        // When normal keyboard events are left uncought, use the input events from
        // the keyboardinput element instead and generate the corresponding key events.
        // This code is required since some browsers on Android are inconsistent in
        // sending keyCodes in the normal keyboard events when using on screen keyboards.
        keyInput: function(event) {

            if (!UI.rfb) return;

            var newValue = event.target.value;

            if (!UI.lastKeyboardinput) {
                UI.keyboardinputReset();
            }
            var oldValue = UI.lastKeyboardinput;

            var newLen;
            try {
                // Try to check caret position since whitespace at the end
                // will not be considered by value.length in some browsers
                newLen = Math.max(event.target.selectionStart, newValue.length);
            } catch (err) {
                // selectionStart is undefined in Google Chrome
                newLen = newValue.length;
            }
            var oldLen = oldValue.length;

            var backspaces;
            var inputs = newLen - oldLen;
            if (inputs < 0) {
                backspaces = -inputs;
            } else {
                backspaces = 0;
            }

            // Compare the old string with the new to account for
            // text-corrections or other input that modify existing text
            var i;
            for (i = 0; i < Math.min(oldLen, newLen); i++) {
                if (newValue.charAt(i) != oldValue.charAt(i)) {
                    inputs = newLen - i;
                    backspaces = oldLen - i;
                    break;
                }
            }

            // Send the key events
            for (i = 0; i < backspaces; i++) {
                UI.rfb.sendKey(XK_BackSpace);
            }
            for (i = newLen - inputs; i < newLen; i++) {
                UI.rfb.sendKey(newValue.charCodeAt(i));
            }

            // Control the text content length in the keyboardinput element
            if (newLen > 2 * UI.defaultKeyboardinputLen) {
                UI.keyboardinputReset();
            } else if (newLen < 1) {
                // There always have to be some text in the keyboardinput
                // element with which backspace can interact.
                UI.keyboardinputReset();
                // This sometimes causes the keyboard to disappear for a second
                // but it is required for the android keyboard to recognize that
                // text has been added to the field
                event.target.blur();
                // This has to be ran outside of the input handler in order to work
                setTimeout(function() { UI.keepKeyboard(); }, 0);
            } else {
                UI.lastKeyboardinput = newValue;
            }
        },

        toggleExtraKeys: function() {
            UI.keepKeyboard();
            if(UI.extraKeysVisible === false) {
                $D('noVNC_toggleCtrl_button').style.display = "inline";
                $D('noVNC_toggleAlt_button').style.display = "inline";
                $D('noVNC_sendTab_button').style.display = "inline";
                $D('noVNC_sendEsc_button').style.display = "inline";
                $D('noVNC_toggleExtraKeys_button').className = "noVNC_status_button_selected";
                UI.extraKeysVisible = true;
            } else if(UI.extraKeysVisible === true) {
                $D('noVNC_toggleCtrl_button').style.display = "";
                $D('noVNC_toggleAlt_button').style.display = "";
                $D('noVNC_sendTab_button').style.display = "";
                $D('noVNC_sendEsc_button').style.display = "";
                $D('noVNC_toggleExtraKeys_button').className = "noVNC_status_button";
                UI.extraKeysVisible = false;
            }
        },

        sendEsc: function() {
            UI.keepKeyboard();
            UI.rfb.sendKey(XK_Escape);
        },

        sendTab: function() {
            UI.keepKeyboard();
            UI.rfb.sendKey(XK_Tab);
        },

        toggleCtrl: function() {
            UI.keepKeyboard();
            if(UI.ctrlOn === false) {
                UI.rfb.sendKey(XK_Control_L, true);
                $D('noVNC_toggleCtrl_button').className = "noVNC_status_button_selected";
                UI.ctrlOn = true;
            } else if(UI.ctrlOn === true) {
                UI.rfb.sendKey(XK_Control_L, false);
                $D('noVNC_toggleCtrl_button').className = "noVNC_status_button";
                UI.ctrlOn = false;
            }
        },

        toggleAlt: function() {
            UI.keepKeyboard();
            if(UI.altOn === false) {
                UI.rfb.sendKey(XK_Alt_L, true);
                $D('noVNC_toggleAlt_button').className = "noVNC_status_button_selected";
                UI.altOn = true;
            } else if(UI.altOn === true) {
                UI.rfb.sendKey(XK_Alt_L, false);
                $D('noVNC_toggleAlt_button').className = "noVNC_status_button";
                UI.altOn = false;
            }
        },

        sendCtrlAltDel: function() {
            UI.rfb.sendCtrlAltDel();
        },

/* ------^-------
 *   /KEYBOARD
 * ==============
 *     MISC
 * ------v------*/

        setMouseButton: function(num) {
            if (typeof num === 'undefined') {
                // Disable mouse buttons
                num = -1;
            }
            if (UI.rfb) {
                UI.rfb.get_mouse().set_touchButton(num);
            }

            var blist = [0, 1,2,4];
            for (var b = 0; b < blist.length; b++) {
                var button = $D('noVNC_mouse_button' + blist[b]);
                if (blist[b] === num) {
                    button.style.display = "";
                } else {
                    button.style.display = "none";
                }
            }
        },

        displayBlur: function() {
            if (!UI.rfb) return;

            UI.rfb.get_keyboard().set_focused(false);
            UI.rfb.get_mouse().set_focused(false);
        },

        displayFocus: function() {
            if (!UI.rfb) return;

            UI.rfb.get_keyboard().set_focused(true);
            UI.rfb.get_mouse().set_focused(true);
        },

        // Display the desktop name in the document title
        updateDocumentTitle: function(rfb, name) {
            document.title = name + " - noVNC";
        },

        //Helper to add options to dropdown.
        addOption: function(selectbox, text, value) {
            var optn = document.createElement("OPTION");
            optn.text = text;
            optn.value = value;
            selectbox.options.add(optn);
        },

        setBarPosition: function() {
            $D('noVNC_control_bar').style.top = (window.pageYOffset) + 'px';
            $D('noVNC_mobile_buttons').style.left = (window.pageXOffset) + 'px';

            var vncwidth = $D('noVNC_container').style.offsetWidth;
            $D('noVNC_control_bar').style.width = vncwidth + 'px';
        }

/* ------^-------
 *    /MISC
 * ==============
 */
    };
})();

window.UI = UI;
