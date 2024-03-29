function endian(hex) {
    const result = [];
    let len = hex.length - 2;
    while (len >= 0) {
        result.push(hex.substr(len, 2));
        len -= 2;
    }
    return result.join('');
}

async function sha3(hex) {
    const a = await hashwasm.sha3(hexToUint8Array(hex), 256);
    return a.toUpperCase();
}

function uint8ArrayToHex (arrayBuffer) {
    return [...new Uint8Array(arrayBuffer)]
        .map (b => b.toString(16).padStart(2, "0"))
        .join ("")
        .toUpperCase();
}

function hexToUint8Array(hex) {
    return new Uint8Array(hex.toLowerCase().match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }))
}

function bootstrapPopoverInit() {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })
}

function parseNodeVersion(num) {
    const hex = `00000000${Number(num).toString(16)}`.substr(-8)
    const strArray = []
    for (let i = 0; i < 8; i += 2) {
        const octet = Number(`0x${hex[i]}${hex[i + 1]}`).toString(10)
        strArray.push(octet)
    }

    return strArray.join('.')
}

/**
 *
 * @param {string} add
 * @param {string|null|undefined} original
 */
function addHtmlClassText(add, original) {
    if (original === undefined || original === null) {
        return add;
    }

    if (original.length === 0) {
        return add;
    }

    return original + " " + add;
}

function createNav(d) {
    const pageList = [
        { href: "account.html", text: "Account" },
        { href: "namespace.html", text: "Namespace" },
        { href: "mosaic.html", text: "Mosaic" }
    ];
    pageList.forEach((item) => {
        const li = d.createElement("li");
        li.className = "nav-item";
        const a = d.createElement("a");
        a.className = "nav-link";
        a.href = item.href;
        a.innerText = item.text;
        li.appendChild(a);
        d.getElementById("navPageList").appendChild(li);
    });
}

function getDefaultBaseUrlTestnet() {
    return "https://dg0nbr5d1ohfy.cloudfront.net:443";
}

function getDefaultBaseUrlMainnet() {
    return "https://d2jbka2k4ggxp7.cloudfront.net:443";
}

function getBaseUrl() {
    const ls = localStorage.getItem('NODE_URL')
    return ls ?? getDefaultBaseUrlMainnet()
}

function setBaseUrl(url) {
    localStorage.setItem('NODE_URL', url)
}

const BASE_URL = getBaseUrl();

(() => {
    createNav(document)
})();
