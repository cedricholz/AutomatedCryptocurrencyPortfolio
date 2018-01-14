export const decodeUTF8 = string => {
    return utf8decode(string);
};

export const encodeUTF8 = string => {
    return utf8encode(string);
};

function encodeCodePoint(codePoint) {
    if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
        return stringFromCharCode(codePoint);
    }
    let symbol = '';
    if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
        symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
    }
    else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
        checkScalarValue(codePoint);
        symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
        symbol += createByte(codePoint, 6);
    }
    else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
        symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
        symbol += createByte(codePoint, 12);
        symbol += createByte(codePoint, 6);
    }
    symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
    return symbol;
}

function createByte(codePoint, shift) {
    return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
}

function utf8encode(string) {
    let codePoints = ucs2decode(string);
    let length = codePoints.length;
    let index = -1;
    let codePoint;
    let byteString = '';
    while (++index < length) {
        codePoint = codePoints[index];
        byteString += encodeCodePoint(codePoint);
    }
    return byteString;
}


let stringFromCharCode = String.fromCharCode;

function ucs2encode(array) {
    let length = array.length;
    let index = -1;
    let value;
    let output = "";
    while (++index < length) {
        value = array[index];
        if (value > 0xffff) {
            value -= 0x10000;
            output += stringFromCharCode(((value >>> 10) & 0x3ff) | 0xd800);
            value = 0xdc00 | (value & 0x3ff);
        }
        output += stringFromCharCode(value);
    }
    return output;
}

function utf8decode(byteString) {
    let byteArray = ucs2decode(byteString);
    let byteCount = byteArray.length;
    let byteIndex = 0;
    let codePoints = [];
    let tmp;
    while ((tmp = decodeSymbol()) !== false) {
        codePoints.push(tmp);
    }
    return ucs2encode(codePoints);
}

function ucs2decode(string) {
    let output = [];
    let counter = 0;
    let length = string.length;
    let value;
    let extra;
    while (counter < length) {
        value = string.charCodeAt(counter++);
        if (value >= 0xd800 && value <= 0xdbff && counter < length) {
            // high surrogate, and there is a next character
            extra = string.charCodeAt(counter++);
            if ((extra & 0xfc00) === 0xdc00) {
                // low surrogate
                output.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
            } else {
                // unmatched surrogate; only append this code unit, in case the next
                // code unit is the high surrogate of a surrogate pair
                output.push(value);
                counter--;
            }
        } else {
            output.push(value);
        }
    }
    return output;
}

function decodeSymbol() {
    let byte1;
    let byte2;
    let byte3;
    let byte4;
    let codePoint;

    if (byteIndex > byteCount) {
        throw Error("Invalid byte index");
    }

    if (byteIndex === byteCount) {
        return false;
    }

    // Read first byte
    byte1 = byteArray[byteIndex] & 0xff;
    byteIndex++;

    // 1-byte sequence (no continuation bytes)
    if ((byte1 & 0x80) === 0) {
        return byte1;
    }

    // 2-byte sequence
    if ((byte1 & 0xe0) === 0xc0) {
        byte2 = readContinuationByte();
        codePoint = ((byte1 & 0x1f) << 6) | byte2;
        if (codePoint >= 0x80) {
            return codePoint;
        } else {
            throw Error("Invalid continuation byte");
        }
    }

    // 3-byte sequence (may include unpaired surrogates)
    if ((byte1 & 0xf0) === 0xe0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        codePoint = ((byte1 & 0x0f) << 12) | (byte2 << 6) | byte3;
        if (codePoint >= 0x0800) {
            checkScalarValue(codePoint);
            return codePoint;
        } else {
            throw Error("Invalid continuation byte");
        }
    }

    // 4-byte sequence
    if ((byte1 & 0xf8) === 0xf0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        byte4 = readContinuationByte();
        codePoint =
            ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
        if (codePoint >= 0x010000 && codePoint <= 0x10ffff) {
            return codePoint;
        }
    }

    throw Error("Invalid UTF-8 detected");
}
