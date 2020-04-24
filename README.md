# NEO Nodes

This project is the frontend website of the product NEO-nodes. NEO-nodes is a network monitor system for NEO blockchain.

## Features

- Monitor nodes worldwide and viewing on the graph.
- Track each node's specific version, latency, exception, memory pool etc..
- Monitor each node's API usability status.
- Analysis client user behavior data.

## Software Requirements

- node.js v8.11.0+, latest version are recommended
- npm v3+
- Google Chrome browser version >= 55.0.2883.0
- vscode are preferred editor, but feel free to use whatever your familiars

## Local Development
In order to run this project locally, you'll need to create a environment variables file `.env.local` (detail listed below) and a backend server to be running as well, which can be found on [NeoMonitor-Server](https://github.com/alienworks/NeoMonitor-Server) and the tool [NeoMatrix](https://github.com/alienworks/neo-matrix).

To run the backend server, follow the instruction provided at each specific README file.

Below are the instruction for this project.

- Install dependencies `npm install`
- Run lint `npm run lint`
- Run lint fix `npm run lint:fix`
- Start development `npm run serve`

### Environment variables
The environment variables are provided using `.env.local` file, create it to setup API access. To learn more advanced usage of environment variables, please refers to [VueJS Guide: Mode and env](https://cli.vuejs.org/guide/mode-and-env.html#environment-variables) doc page.

The following environment variables are available:

| Name              | Description                        |
| ----------------- | ---------------------------------- |
| VUE_APP_SOCKETAPI | URL of the NEO-nodes WebSocket API |
| VUE_APP_RESTAPI   | URL of the NEO-nodes REST API      |

**Note:** URL can be found on the backend project.

### Update notes
For user have use version before 1.3, version >= 1.3 have to change environment variable's URL format. i.e.

```python
# before v1.3
VUE_APP_RESTAPI = protocal://hostname:port/api/nodes
# after v1.3
VUE_APP_RESTAPI = protocal://hostname:port/api
```