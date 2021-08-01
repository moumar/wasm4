function readPixel (sprite, x, y, bpp, stride) {
    switch (bpp) {
    case 1:
        var byte = sprite[(y*stride + x) >> 3];
        var shift = 7 - (x & 0x07);
        return (byte >> shift) & 0b1;
    case 2:
        var byte = sprite[(y*stride + x) >> 2];
        var shift = 6 - ((x & 0x03) << 1);
        return (byte >> shift) & 0b11;
    case 4:
        var byte = sprite[(y*stride + x) >> 1];
        return (x & 1) ? byte & 0b1111 : byte >> 4;
    }
    return 0;
}

const FONT = new Uint8Array([ 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x38,0x38,0x38,0x30,0x30,0x00,0x30,0x00,0x6c,0x6c,0x6c,0x00,0x00,0x00,0x00,0x00,0x6c,0xfe,0x6c,0x6c,0x6c,0xfe,0x6c,0x00,0x10,0x7c,0xd0,0x7c,0x16,0xfc,0x10,0x00,0x62,0xa4,0xc8,0x10,0x26,0x4a,0x8c,0x00,0x70,0xd8,0xd8,0x70,0xda,0xcc,0x7e,0x00,0x30,0x30,0x30,0x00,0x00,0x00,0x00,0x00,0x0c,0x18,0x30,0x30,0x30,0x18,0x0c,0x00,0x60,0x30,0x18,0x18,0x18,0x30,0x60,0x00,0x00,0x6c,0x38,0xfe,0x38,0x6c,0x00,0x00,0x00,0x18,0x18,0x7e,0x18,0x18,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x30,0x30,0x60,0x00,0x00,0x00,0x7e,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x30,0x30,0x00,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x00,0x38,0x4c,0xc6,0xc6,0xc6,0x64,0x38,0x00,0x18,0x38,0x18,0x18,0x18,0x18,0x7e,0x00,0x7c,0xc6,0x0e,0x3c,0x78,0xe0,0xfe,0x00,0x7e,0x0c,0x18,0x3c,0x06,0xc6,0x7c,0x00,0x1c,0x3c,0x6c,0xcc,0xfe,0x0c,0x0c,0x00,0xfc,0xc0,0xfc,0x06,0x06,0xc6,0x7c,0x00,0x3c,0x60,0xc0,0xfc,0xc6,0xc6,0x7c,0x00,0xfe,0xc6,0x0c,0x18,0x30,0x30,0x30,0x00,0x78,0xc4,0xe4,0x78,0x9e,0x86,0x7c,0x00,0x7c,0xc6,0xc6,0x7e,0x06,0x0c,0x78,0x00,0x00,0x30,0x30,0x00,0x30,0x30,0x00,0x00,0x00,0x30,0x30,0x00,0x30,0x30,0x60,0x00,0x0c,0x18,0x30,0x60,0x30,0x18,0x0c,0x00,0x00,0x00,0xfe,0x00,0xfe,0x00,0x00,0x00,0x60,0x30,0x18,0x0c,0x18,0x30,0x60,0x00,0x7c,0xfe,0xc6,0x0c,0x38,0x00,0x38,0x00,0x7c,0x82,0xba,0xaa,0xbe,0x80,0x7c,0x00,0x38,0x6c,0xc6,0xc6,0xfe,0xc6,0xc6,0x00,0xfc,0xc6,0xc6,0xfc,0xc6,0xc6,0xfc,0x00,0x3c,0x66,0xc0,0xc0,0xc0,0x66,0x3c,0x00,0xf8,0xcc,0xc6,0xc6,0xc6,0xcc,0xf8,0x00,0xfe,0xc0,0xc0,0xfc,0xc0,0xc0,0xfe,0x00,0xfe,0xc0,0xc0,0xfc,0xc0,0xc0,0xc0,0x00,0x3e,0x60,0xc0,0xce,0xc6,0x66,0x3e,0x00,0xc6,0xc6,0xc6,0xfe,0xc6,0xc6,0xc6,0x00,0x7e,0x18,0x18,0x18,0x18,0x18,0x7e,0x00,0x06,0x06,0x06,0x06,0x06,0xc6,0x7c,0x00,0xc6,0xcc,0xd8,0xf0,0xf8,0xdc,0xce,0x00,0x60,0x60,0x60,0x60,0x60,0x60,0x7e,0x00,0xc6,0xee,0xfe,0xfe,0xd6,0xc6,0xc6,0x00,0xc6,0xe6,0xf6,0xfe,0xde,0xce,0xc6,0x00,0x7c,0xc6,0xc6,0xc6,0xc6,0xc6,0x7c,0x00,0xfc,0xc6,0xc6,0xc6,0xfc,0xc0,0xc0,0x00,0x7c,0xc6,0xc6,0xc6,0xde,0xcc,0x7a,0x00,0xfc,0xc6,0xc6,0xce,0xf8,0xdc,0xce,0x00,0x78,0xcc,0xc0,0x7c,0x06,0xc6,0x7c,0x00,0x7e,0x18,0x18,0x18,0x18,0x18,0x18,0x00,0xc6,0xc6,0xc6,0xc6,0xc6,0xc6,0x7c,0x00,0xc6,0xc6,0xc6,0xee,0x7c,0x38,0x10,0x00,0xc6,0xc6,0xd6,0xfe,0xfe,0xee,0xc6,0x00,0xc6,0xee,0x7c,0x38,0x7c,0xee,0xc6,0x00,0x66,0x66,0x66,0x3c,0x18,0x18,0x18,0x00,0xfe,0x0e,0x1c,0x38,0x70,0xe0,0xfe,0x00,0x3c,0x30,0x30,0x30,0x30,0x30,0x3c,0x00,0x80,0x40,0x20,0x10,0x08,0x04,0x02,0x00,0x78,0x18,0x18,0x18,0x18,0x18,0x78,0x00,0x38,0x6c,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xfe,0x10,0x08,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x7c,0x06,0x7e,0xc6,0x7e,0x00,0xc0,0xc0,0xfc,0xc6,0xc6,0xc6,0x7c,0x00,0x00,0x00,0x7e,0xc0,0xc0,0xc0,0x7e,0x00,0x06,0x06,0x7e,0xc6,0xc6,0xc6,0x7e,0x00,0x00,0x00,0x7c,0xc6,0xfe,0xc0,0x7c,0x00,0x0e,0x18,0x7e,0x18,0x18,0x18,0x18,0x00,0x00,0x00,0x7e,0xc6,0xc6,0x7e,0x06,0x7c,0xc0,0xc0,0xfc,0xc6,0xc6,0xc6,0xc6,0x00,0x18,0x00,0x38,0x18,0x18,0x18,0x7e,0x00,0x0c,0x00,0x1c,0x0c,0x0c,0x0c,0x0c,0x78,0xc0,0xc0,0xce,0xfc,0xf8,0xdc,0xce,0x00,0x38,0x18,0x18,0x18,0x18,0x18,0x7e,0x00,0x00,0x00,0xfc,0xb6,0xb6,0xb6,0xb6,0x00,0x00,0x00,0xfc,0xc6,0xc6,0xc6,0xc6,0x00,0x00,0x00,0x7c,0xc6,0xc6,0xc6,0x7c,0x00,0x00,0x00,0xfc,0xc6,0xc6,0xfc,0xc0,0xc0,0x00,0x00,0x7e,0xc6,0xc6,0x7e,0x06,0x06,0x00,0x00,0x6e,0x70,0x60,0x60,0x60,0x00,0x00,0x00,0x7c,0xc0,0x7c,0x06,0xfc,0x00,0x18,0x18,0x7e,0x18,0x18,0x18,0x18,0x00,0x00,0x00,0xc6,0xc6,0xc6,0xc6,0x7e,0x00,0x00,0x00,0x66,0x66,0x66,0x3c,0x18,0x00,0x00,0x00,0xb6,0xb6,0xb6,0xb6,0x7e,0x00,0x00,0x00,0xc6,0xfe,0x38,0xfe,0xc6,0x00,0x00,0x00,0xc6,0xc6,0xc6,0x7e,0x06,0x7c,0x00,0x00,0xfe,0x1c,0x38,0x70,0xfe,0x00,0x0c,0x18,0x18,0x30,0x18,0x18,0x0c,0x00,0x18,0x18,0x18,0x18,0x18,0x18,0x18,0x00,0x60,0x30,0x30,0x18,0x30,0x30,0x60,0x00,0x00,0x00,0x70,0xba,0x1c,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x6c,0x6c,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x18,0x00,0x18,0x18,0x38,0x38,0x38,0x00,0x10,0x7c,0xd6,0xd0,0xd6,0x7c,0x10,0x00,0x3c,0x66,0x60,0xfc,0x60,0x60,0xfe,0x00,0x00,0x5a,0x24,0x24,0x24,0x5a,0x00,0x00,0x66,0x66,0x3c,0x7e,0x18,0x7e,0x18,0x00,0x18,0x18,0x18,0x00,0x18,0x18,0x18,0x00,0x3c,0x66,0x78,0x24,0x1e,0x66,0x3c,0x00,0x6c,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x3c,0x42,0x99,0xa1,0xa1,0x99,0x42,0x3c,0x78,0x3c,0x6c,0x3c,0x00,0x00,0x00,0x00,0x00,0x36,0x6c,0xd8,0x6c,0x36,0x00,0x00,0x00,0x00,0x7e,0x06,0x06,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x3c,0x42,0xb9,0xa5,0xb9,0xa5,0x42,0x3c,0x7c,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x10,0x28,0x10,0x00,0x00,0x00,0x00,0x00,0x18,0x18,0x7e,0x18,0x18,0x00,0x7e,0x00,0x38,0x0c,0x18,0x3c,0x00,0x00,0x00,0x00,0x3c,0x18,0x0c,0x38,0x00,0x00,0x00,0x00,0x08,0x10,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xcc,0xcc,0xcc,0xcc,0xf6,0xc0,0x3e,0x6a,0x4a,0x6a,0x3e,0x0a,0x0a,0x00,0x00,0x00,0x00,0x30,0x30,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x08,0x30,0x18,0x38,0x18,0x3c,0x00,0x00,0x00,0x00,0x38,0x6c,0x6c,0x38,0x00,0x00,0x00,0x00,0x00,0xd8,0x6c,0x36,0x6c,0xd8,0x00,0x00,0x42,0xc4,0x48,0x52,0x26,0x4e,0x82,0x00,0x42,0xc4,0x48,0x56,0x22,0x44,0x8e,0x00,0xe2,0x44,0x28,0xd2,0x26,0x4e,0x82,0x00,0x38,0x00,0x38,0x60,0xc6,0xfe,0x7c,0x00,0x20,0x10,0x38,0x6c,0xc6,0xfe,0xc6,0x00,0x08,0x10,0x38,0x6c,0xc6,0xfe,0xc6,0x00,0x38,0x6c,0x38,0x6c,0xc6,0xfe,0xc6,0x00,0x34,0x58,0x38,0x6c,0xc6,0xfe,0xc6,0x00,0x6c,0x00,0x38,0x6c,0xc6,0xfe,0xc6,0x00,0x10,0x28,0x38,0x6c,0xc6,0xfe,0xc6,0x00,0x3e,0x78,0xd8,0xde,0xf8,0xd8,0xde,0x00,0x3c,0x66,0xc0,0xc0,0x66,0x3c,0x08,0x30,0x20,0x10,0xfe,0xc0,0xfc,0xc0,0xfe,0x00,0x08,0x10,0xfe,0xc0,0xfc,0xc0,0xfe,0x00,0x38,0x6c,0xfe,0xc0,0xfc,0xc0,0xfe,0x00,0x6c,0x00,0xfe,0xc0,0xfc,0xc0,0xfe,0x00,0x10,0x08,0x7e,0x18,0x18,0x18,0x7e,0x00,0x08,0x10,0x7e,0x18,0x18,0x18,0x7e,0x00,0x18,0x3c,0x7e,0x18,0x18,0x18,0x7e,0x00,0x66,0x00,0x7e,0x18,0x18,0x18,0x7e,0x00,0x78,0x6c,0x66,0xf6,0x66,0x6c,0x78,0x00,0x34,0x58,0xe6,0xf6,0xfe,0xde,0xce,0x00,0x20,0x10,0x7c,0xc6,0xc6,0xc6,0x7c,0x00,0x08,0x10,0x7c,0xc6,0xc6,0xc6,0x7c,0x00,0x38,0x6c,0x7c,0xc6,0xc6,0xc6,0x7c,0x00,0x34,0x58,0x7c,0xc6,0xc6,0xc6,0x7c,0x00,0x6c,0x00,0x7c,0xc6,0xc6,0xc6,0x7c,0x00,0x00,0x44,0x28,0x10,0x28,0x44,0x00,0x00,0x7c,0xc6,0xce,0xd6,0xe6,0xc6,0x7c,0x00,0x20,0x10,0xc6,0xc6,0xc6,0xc6,0x7c,0x00,0x08,0x10,0xc6,0xc6,0xc6,0xc6,0x7c,0x00,0x38,0x6c,0x00,0xc6,0xc6,0xc6,0x7c,0x00,0x6c,0x00,0xc6,0xc6,0xc6,0xc6,0x7c,0x00,0x08,0x10,0x66,0x66,0x3c,0x18,0x18,0x00,0xc0,0xfc,0xc6,0xc6,0xc6,0xfc,0xc0,0x00,0x3c,0x66,0x66,0x6c,0x66,0x76,0x6c,0x00,0x20,0x10,0x7c,0x06,0x7e,0xc6,0x7e,0x00,0x08,0x10,0x7c,0x06,0x7e,0xc6,0x7e,0x00,0x38,0x6c,0x7c,0x06,0x7e,0xc6,0x7e,0x00,0x34,0x58,0x7c,0x06,0x7e,0xc6,0x7e,0x00,0x6c,0x00,0x7c,0x06,0x7e,0xc6,0x7e,0x00,0x10,0x28,0x7c,0x06,0x7e,0xc6,0x7e,0x00,0x00,0x00,0x7c,0x16,0x7e,0xd0,0x7c,0x00,0x00,0x00,0x7e,0xc0,0xc0,0x7e,0x08,0x30,0x20,0x10,0x7c,0xc6,0xfe,0xc0,0x7c,0x00,0x08,0x10,0x7c,0xc6,0xfe,0xc0,0x7c,0x00,0x38,0x6c,0x7c,0xc6,0xfe,0xc0,0x7c,0x00,0x6c,0x00,0x7c,0xc6,0xfe,0xc0,0x7c,0x00,0x20,0x10,0x00,0x38,0x18,0x18,0x7e,0x00,0x08,0x10,0x00,0x38,0x18,0x18,0x7e,0x00,0x38,0x6c,0x00,0x38,0x18,0x18,0x7e,0x00,0x6c,0x00,0x38,0x18,0x18,0x18,0x7e,0x00,0x64,0x78,0x98,0x7c,0xc6,0xc6,0x7c,0x00,0x34,0x58,0xfc,0xc6,0xc6,0xc6,0xc6,0x00,0x20,0x10,0x7c,0xc6,0xc6,0xc6,0x7c,0x00,0x08,0x10,0x7c,0xc6,0xc6,0xc6,0x7c,0x00,0x38,0x6c,0x7c,0xc6,0xc6,0xc6,0x7c,0x00,0x34,0x58,0x7c,0xc6,0xc6,0xc6,0x7c,0x00,0x6c,0x00,0x7c,0xc6,0xc6,0xc6,0x7c,0x00,0x00,0x18,0x00,0x7e,0x00,0x18,0x00,0x00,0x00,0x00,0x7c,0xce,0xd6,0xe6,0x7c,0x00,0x20,0x10,0xc6,0xc6,0xc6,0xc6,0x7e,0x00,0x08,0x10,0xc6,0xc6,0xc6,0xc6,0x7e,0x00,0x38,0x6c,0x00,0xc6,0xc6,0xc6,0x7e,0x00,0x6c,0x00,0xc6,0xc6,0xc6,0xc6,0x7e,0x00,0x08,0x10,0xc6,0xc6,0xc6,0x7e,0x06,0x7c,0xc0,0xc0,0xfc,0xc6,0xc6,0xfc,0xc0,0xc0,0x6c,0x00,0xc6,0xc6,0xc6,0x7e,0x06,0x7c ]);

export class Framebuffer {
    constructor (buffer, ptr, width, height) {
        this.bytes = new Uint8Array(buffer, ptr, width*height);
        this.stride = width;
        this.height = height;
    }

    clearForeground () {
        // TODO(2021-07-10): Optimize by operating on 32 or 64 bit numbers instead of per individual
        // byte?
        const bytes = this.bytes;
        for (let ii = 0, ll = bytes.length; ii < ll; ++ii) {
            bytes[ii] &= 0xf0;
        }
    }

    set (foreground, color, x, y) {
        const idx = this.stride*y + x;
        if (foreground) {
            this.bytes[idx] = (this.bytes[idx] & 0xf0) | color;
        } else {
            this.bytes[idx] = (this.bytes[idx] & 0x0f) | (color << 4)
        }
    }

    drawRect (foreground, color, x, y, width, height) {
        // TODO(2021-07-07): Optimize
        // TODO(2021-07-21): Clipping
        for (let yy = y; yy < y+height; ++yy) {
            for (let xx = x; xx < x+width; ++xx) {
                this.set(foreground, color, xx, yy);
            }
        }
    }

    drawText (charArray, colors, x, y) {
        let currentX = x;
        for (let ii = 0; charArray[ii]; ++ii) {
            const c = charArray[ii];
            switch (c) {
            case 10:
                y += 8;
                currentX = x;
                break;
            default:
                this.blit(true, FONT, colors, currentX, y, 8, 8, 0, (c-32)*8, 8, 1, false, false, false);
                currentX += 8;
                break;
            }
        }
    }

    blit (foreground, sprite, colors, dstX, dstY, width, height, srcX, srcY, srcStride, bpp, flipX, flipY, rotate) {
        const clipXMin = Math.max(0, dstX) - dstX;
        const clipYMin = Math.max(0, dstY) - dstY;
        const clipXMax = Math.min(width, this.stride - dstX);
        const clipYMax = Math.min(height, this.height - dstY);

        if (rotate) {
            flipX = !flipX;
        }

        for (let row = clipYMin; row < clipYMax; ++row) {
            for (let col = clipXMin; col < clipXMax; ++col) {
                let sx, sy;
                if (rotate) {
                    sx = row;
                    sy = col;
                } else {
                    sx = col;
                    sy = row;
                }
                if (flipX) {
                    sx = clipXMax - sx - 1;
                }
                if (flipY) {
                    sy = clipYMax - sy - 1;
                }

                const colorIdx = readPixel(sprite, srcX+sx, srcY+sy, bpp, srcStride);
                const color = (bpp == 4)
                    ? colorIdx
                    : (colors >> (colorIdx << 2)) & 0x0f;
                if (color != 0) {
                    this.set(foreground, color, dstX + col, dstY + row);
                }
            }
        }
    }
}
