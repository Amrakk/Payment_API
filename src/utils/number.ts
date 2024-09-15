const INT32_MIN = -2147483648; // -2^31
const INT32_MAX = 2147483647; // 2^31 - 1

export function isInt32(value: number): boolean {
    return value >= INT32_MIN && value <= INT32_MAX;
}
