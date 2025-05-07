import { BigNumber } from "bignumber.js";

// Intentionally no 0 and 1 number in DICTIONARY
const DICTIONARY = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789";
const DICTIONARY_LENGTH = BigNumber(DICTIONARY.length);
const SHARECODE_PATTERN = /CSGO(-?[\w]{5}){5}$/;


function bigNumberToByteArray(big: BigNumber) : number[] {
  const str = big.toString(16).padStart(36, "0");
  const bytes = [];

  for (let i = 0; i < str.length; i += 2) {
    bytes.push(parseInt(str.slice(i, i + 2), 16));
  }

  return bytes;
}

export class CrosshairCode {
  constructor(public code: string) { }

  decode(): CrosshairConvars {
    if (!this.code.match(SHARECODE_PATTERN)) {
      throw new Error('Invalid share code');
    }

    let shortenedCode = this.code.replace(/CSGO|-/g, '');
    const chars = Array.from(shortenedCode).reverse();
    let big = BigNumber(0);

    for (let i = 0; i < chars.length; i++) {
      big = big.multipliedBy(DICTIONARY_LENGTH).plus(DICTIONARY.indexOf(chars[i]));
    }

    return this.fromBytes(bigNumberToByteArray(big));
  }

  fromBytes(bytes: number[]) : CrosshairConvars {
    return new CrosshairConvars(
      Int8Array.of(bytes[2])[0] / 10.0,
      (bytes[3] & 7) / 2.0,
      bytes[4],
      bytes[5],
      bytes[6],
      bytes[7],
      bytes[8],
      Int8Array.of(bytes[9])[0] / 10.0,
      bytes[10] & 7,
      bytes[10] & 8 ? 1 : 0,
      ((bytes[10] & 0xF0) >> 4) / 10.0,
      (bytes[11] & 0xF) / 10.0,
      ((bytes[11] & 0xF0) >> 4) / 10.0,
      (bytes[12] & 0x3F) / 10.0,
      (bytes[13] & 0xE) >> 1,
      bytes[13] & 0x10 ? 1 : 0,
      bytes[13] & 0x20 ? 1 : 0,
      bytes[13] & 0x40 ? 1 : 0,
      bytes[13] & 0x80 ? 1 : 0,
      (((bytes[15] & 0x1f) << 8) + bytes[14]) / 10.0
    );
  }
}

export class CrosshairConvars {
  constructor(
    public cl_crosshairgap: number,
    public cl_crosshair_outlinethickness: number,
    public cl_crosshaircolor_r: number,
    public cl_crosshaircolor_g: number,
    public cl_crosshaircolor_b: number,
    public cl_crosshairalpha: number,
    public cl_crosshair_dynamic_splitdist: number,
    public cl_fixedcrosshairgap: number,
    public cl_crosshaircolor: number,
    public cl_crosshair_drawoutline: number,
    public cl_crosshair_dynamic_splitalpha_innermod: number,
    public cl_crosshair_dynamic_splitalpha_outermod: number,
    public cl_crosshair_dynamic_maxdist_splitratio: number,
    public cl_crosshairthickness: number,
    public cl_crosshairstyle: number,
    public cl_crosshairdot: number,
    public cl_crosshairgap_useweaponvalue: number,
    public cl_crosshairusealpha: number,
    public cl_crosshair_t: number,
    public cl_crosshairsize: number,
  ) { }

  toBytes() {
    const bytes = [
      0,
      1,
      (this.cl_crosshairgap * 10) & 0xff,
      (this.cl_crosshair_outlinethickness * 2) & 7,
      this.cl_crosshaircolor_r,
      this.cl_crosshaircolor_g,
      this.cl_crosshaircolor_b,
      this.cl_crosshairalpha,
      this.cl_crosshair_dynamic_splitdist,
      (this.cl_fixedcrosshairgap * 10) & 0xff,
      (this.cl_crosshaircolor & 7) |
          (this.cl_crosshair_drawoutline ? 8 : 0) |
          (this.cl_crosshair_dynamic_splitalpha_innermod * 10) << 4,
      ((this.cl_crosshair_dynamic_splitalpha_outermod * 10) & 0xf) |
          ((this.cl_crosshair_dynamic_maxdist_splitratio * 10) << 4),
      (this.cl_crosshairthickness * 10) & 0x3f,
      ((this.cl_crosshairstyle << 1) & 0xe) |
          (this.cl_crosshairdot ? 0x10 : 0) |
          (this.cl_crosshairgap_useweaponvalue ? 0x20 : 0) |
          (this.cl_crosshairusealpha ? 0x40 : 0) |
          (this.cl_crosshair_t ? 0x80 : 0),
      (this.cl_crosshairsize * 10) & 0xff,
      ((this.cl_crosshairsize * 10) >> 8) & 0x1f,
      0,
      0
    ];

    let sum = 0;
    for (let i = 1; i < bytes.length; ++i) {
        sum += bytes[i];
    }
    bytes[0] = sum & 0xff;

    return bytes;
  };

  encode() : CrosshairCode {
    const bytes = this.toBytes();

    let acc = BigNumber(0);
    let pos = BigNumber(1);
    for (let i = bytes.length; i --> 0;) {
        acc = acc.plus(BigNumber(bytes[i]).multipliedBy(pos));
        pos = pos.multipliedBy(256);
    }

    let result = '';
    for (let i = 0; i < 25; ++i) {
        const digit = acc.modulo(DICTIONARY_LENGTH);
        acc = acc.dividedBy(DICTIONARY_LENGTH);
        result += DICTIONARY.charAt(Number(digit));
    }

    return new CrosshairCode(`CSGO-${result.slice(0, 5)}-${result.slice(5, 10)}-${result.slice(10, 15)}-${result.slice(15, 20)}-${result.slice(20, 25)}`);
};
}
