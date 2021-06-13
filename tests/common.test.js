const loadModule = require('./module-loader').loadModule

describe('common', () => {
    let module

    beforeAll(() => {
        const div = document.createElement('div')
        div.id = 'navPageList'
        document.body.appendChild(div)
        module = loadModule('./src/common.js', null, { document } )
    });

    describe('endian', () => {
        test('normal', () => {
            expect(module.endian('1234')).toBe('3412')
        });
    });

    describe('uint8ArrayToHex', () => {
        test('Uint8Array', () => {
            const uint16 = Uint8Array.from('12345');
            expect(module.uint8ArrayToHex(uint16)).toBe('0102030405')
        })
    })

    describe('hexToUint8Array', () => {
        test('normal', () => {
            const result = module.hexToUint8Array('0102030405')
            expect(result.length).toBe(5)
            expect(result[0]).toBe(1)
            expect(result[1]).toBe(2)
            expect(result[2]).toBe(3)
            expect(result[3]).toBe(4)
            expect(result[4]).toBe(5)
        })
    })

    describe('parseNodeVersion', () => {
        test('normal', () => {
            const a = module.parseNodeVersion(16777472);
            expect(a).toBe('1.0.1.0')
        })
    })
});

