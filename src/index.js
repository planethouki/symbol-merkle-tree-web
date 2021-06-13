const nodeForm = document.getElementById('nodeUrlSetForm');
nodeForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    setBaseUrl(nodeForm["inputNodeUrl"].value)
    location.reload()
});

document.getElementById('nodeUrlSetDefault').addEventListener('click', () => {
    nodeForm["inputNodeUrl"].value = getDefaultBaseUrl()
});

(async () => {
    /**
     * Node Info
     */
    const nodePromise = fetch(`${BASE_URL}/node/info`)
        .then(res => res.json())
    const networkPromise = fetch(`${BASE_URL}/network/properties`)
        .then(res => res.json())
        .then(info => info.network)
    const chainPromise = fetch(`${BASE_URL}/chain/info`)
        .then(res => res.json())
    const serverPromise = fetch(`${BASE_URL}/node/server`)
        .then(res => res.json())
        .then(server => server.serverInfo.deployment)
    const { error, result } = await Promise
        .all([nodePromise, networkPromise, chainPromise, serverPromise])
        .then(([node, network, chain, server]) => {
            return { result: { node, network, chain, server } }
        })
        .catch((error) => {
            console.error(error)
            return { error }
        })

    if (error) {
        document.getElementById("node-info").innerText = error.toString()
        return
    }

    const nodeInfo = [
        { key: "使用ノード", value: BASE_URL },
        { key: "Node Version", value: parseNodeVersion(result.node.version) },
        { key: "Generation Hash", value: result.node.networkGenerationHashSeed },
        { key: "Height", value: result.chain.height },
        { key: "Network", value: result.network.identifier },
        { key: "Deployment", value: `${result.server.deploymentTool}@${result.server.deploymentToolVersion}` },
        { key: "Last Updated", value: result.server.lastUpdatedDate },
    ]

    const tbody = document.createElement('tbody')
    for (let i = 0; i < nodeInfo.length; i++) {
        const tr = document.createElement('tr')
        const td1 = document.createElement('td')
        const td2 = document.createElement('td')
        td1.innerText = nodeInfo[i].key
        td1.className = "pe-3"
        td2.innerText = nodeInfo[i].value
        tr.appendChild(td1)
        tr.appendChild(td2)
        tbody.appendChild(tr)
    }
    const table = document.createElement('table')
    table.className = "table table-sm"
    table.appendChild(tbody)

    document.getElementById("node-info").appendChild(table)
})();
