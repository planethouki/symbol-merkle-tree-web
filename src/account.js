const messageElement = document.getElementById("messageTextArea");

async function drawGraph() {

    messageElement.value = "fetching...";

    const identifier = document.getElementById("inputId").value;

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
        `${BASE_URL}/accounts/${identifier}`,
        {
            mode: 'cors'
        }
    );
    const reqMerkle = new Request(
        `${BASE_URL}/accounts/${identifier}/merkle`,
        {
            mode: 'cors'
        }
    );

    let successString = "";
    let errorString = "";

    const { myChart, merkle } = await fetch(reqMerkle).then((res) => {
            if (res.ok) {
                return res.json();
            }
            return res.json().then((m) => {
                throw new Error(JSON.stringify(m));
            });
        })
        .then((merkle) => {
            const depthNodes = {}
            for (let depth = 0; depth < merkle.tree.length; depth++) {
                const node = merkle.tree[depth];
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
                    const previousTree = merkle.tree[depth - 1];
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
                    const previousTree = merkle.tree[depth - 1];
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
                merkle
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

    const info = await fetch(req)
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

    if (info === null) {
        errorString += "マークルツリー上にそのアカウントは存在しません。";
        messageElement.value = errorString;
        return;
    }

    const hexAddress = info.account.address;
    successString += `hexAddress: ${hexAddress}\n`;
    const merklePathKey = await sha3(hexAddress);
    successString += `key: ${merklePathKey}\n`;

    const leafValue = merkle.tree[merkle.tree.length - 1].value;
    successString += `value: ${leafValue}`

    messageElement.value = successString;

}


document.getElementById("buttonSubmit").onclick = _.debounce(drawGraph, 200);
