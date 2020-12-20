const BASE_URL = "https://d2o8j5pgb7wqnq.cloudfront.net";

const messageElement = document.getElementById("messageTextArea");

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

async function drawGraph() {

    messageElement.value = "fetching...";

    const accountIdentifier = document.getElementById("inputAddressPublicKey").value;

    const chartConfig = [
        {
            container: "#tree-simple"
        }
    ]

    const rootNode = {
        text: { name: "root" }
    }

    chartConfig.push(rootNode);

    const req = new Request(
        `${BASE_URL}/accounts/${accountIdentifier}`,
        {
            mode: 'cors'
        }
    );
    const reqMerkle = new Request(
        `${BASE_URL}/accounts/${accountIdentifier}/merkle`,
        {
            mode: 'cors'
        }
    );

    let successString = "";
    let errorString = "";

    const { myChart, accountMerkle } = await fetch(reqMerkle).then((res) => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then((m) => {
                throw new Error(JSON.stringify(m));
            });
        })
        .then((accountMerkle) => {
            const depthNodes = {}
            for (let depth = 0; depth < accountMerkle.tree.length; depth++) {
                const node = accountMerkle.tree[depth];
                const depthStr = depth.toString();
                if (depth === 0) {
                    depthNodes[depthStr] = node.links.map((link) => {
                        return {
                            parent: rootNode,
                            text: {name: link.bit}
                        }
                    });
                } else if (node.type === 255) {
                    const leafHash = node.leafHash;
                    const previousTree = accountMerkle.tree[depth - 1];
                    const previousTreeNodeIndex = previousTree.links.findIndex((previousTreeLink) => {
                        return previousTreeLink.link === leafHash;
                    });
                    const parent = depthNodes[depth - 1][previousTreeNodeIndex];
                    parent.HTMLclass = "red";
                    depthNodes[depthStr] = [
                        {
                            parent,
                            text: {
                                name: node.path,
                                desc: `value = ${node.value}`
                            }
                        }
                    ]
                } else {
                    const branchHash = node.branchHash;
                    const previousTree = accountMerkle.tree[depth - 1];
                    const previousTreeNodeIndex = previousTree.links.findIndex((previousTreeLink) => {
                        return previousTreeLink.link === branchHash;
                    });
                    const parent = depthNodes[depth - 1][previousTreeNodeIndex];
                    parent.HTMLclass = "red";
                    depthNodes[depthStr] = node.links.map((link) => {
                        return {
                            parent,
                            text: {name: link.bit}
                        }
                    });
                }
                chartConfig.push(...depthNodes[depthStr]);
            }
            successString += "success\n";
            return {
                myChart: new Treant(chartConfig),
                accountMerkle
            };
        })
        .catch((e) => {
            errorString += e.message + "\n";
            return {
                myChart: null
            };
        });

    if (myChart === null) {
        messageElement.value = errorString;
        return;
    }

    const accountInfo = await fetch(req)
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then((m) => {
                throw new Error(JSON.stringify(m));
            });
        })
        .catch((e) => {
            errorString += e.message + "\n";
            return null;
        });

    if (accountInfo === null) {
        errorString += "マークルツリー上にそのアカウントは存在しません。";
        messageElement.value = errorString;
        return;
    }

    const hexAddress = accountInfo.account.address;
    successString += `hexAddress: ${hexAddress}\n`;
    const accountKey = await sha3(hexAddress);
    successString += `key: ${accountKey}\n`;

    const accountValue = accountMerkle.tree[accountMerkle.tree.length - 1].value;
    successString += `value: ${accountValue}`

    messageElement.value = successString;

}
