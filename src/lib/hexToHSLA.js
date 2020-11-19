const hexToHSLA = (H) => {
    let ex = /^#([\da-f]{4}){1,2}$/i;
    if (ex.test(H)) {
        let r = 0,
            g = 0,
            b = 0,
            a = 1;
        // 4 digits
        if (H.length == 5) {
            r = '0x' + H[1] + H[1];
            g = '0x' + H[2] + H[2];
            b = '0x' + H[3] + H[3];
            a = '0x' + H[4] + H[4];
            // 8 digits
        } else if (H.length == 9) {
            r = '0x' + H[1] + H[2];
            g = '0x' + H[3] + H[4];
            b = '0x' + H[5] + H[6];
            a = '0x' + H[7] + H[8];
        }

        // normal conversion to HSLA
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta == 0) h = 0;
        else if (cmax == r) h = ((g - b) / delta) % 6;
        else if (cmax == g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0) h += 360;

        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        a = (a / 255).toFixed(3);

        return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
    } else {
        return 'Invalid input color';
    }
};

export default hexToHSLA;
