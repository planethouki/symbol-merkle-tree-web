const BASE_URL = "https://dg0nbr5d1ohfy.cloudfront.net";

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

(() => {
    /**
     * Create Nav
     */
    const pageList = [
        { href: "account.html", text: "Account" },
        { href: "namespace.html", text: "Namespace" },
        { href: "mosaic.html", text: "Mosaic" }
    ];
    pageList.forEach((item) => {
        const li = document.createElement("li");
        li.className = "nav-item";
        const a = document.createElement("a");
        a.className = "nav-link";
        a.href = item.href;
        a.innerText = item.text;
        li.appendChild(a);
        document.getElementById("navPageList").appendChild(li);
    });

    /**
     * Node URL
     */
    document.getElementById("node-url").innerText = BASE_URL;
})();
