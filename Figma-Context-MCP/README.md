# Framelink Figma MCP Server

<a href="https://www.framelink.ai/?utm_source=github&utm_medium=readme&utm_campaign=readme" target="_blank" rel="noopener">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://www.framelink.ai/github/HeaderDark.png" />
    <img alt="Framelink" src="https://www.framelink.ai/github/HeaderLight.png" />
  </picture>
</a>

<div align="center">
  <h1>Framelink Figma MCP Server</h1>
  <h3>Give your coding agent access to your Figma data.<br/>Implement designs in any framework in one-shot.</h3>
  <a href="https://npmcharts.com/compare/figma-developer-mcp?interval=30">
    <img alt="weekly downloads" src="https://img.shields.io/npm/dm/figma-developer-mcp.svg">
  </a>
  <a href="https://github.com/GLips/Figma-Context-MCP/blob/main/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/github/license/GLips/Figma-Context-MCP" />
  </a>
  <a href="https://framelink.ai/discord">
    <img alt="Discord" src="https://img.shields.io/discord/1352337336913887343?color=7389D8&label&logo=discord&logoColor=ffffff" />
  </a>
  <br />
  <a href="https://twitter.com/glipsman">
    <img alt="Twitter" src="https://img.shields.io/twitter/url?url=https%3A%2F%2Fx.com%2Fglipsman&label=%40glipsman" />
  </a>
</div>

---

## Features

- **Seamless Figma Integration**: Access Figma design data directly from your IDE or coding agent.
- **Optimized for AI Tools**: Designed for Cursor, Windsurf, Cline, and other AI-powered coding tools.
- **Simplified Figma API**: Translates Figma API responses into concise, relevant context for code generation.
- **Cross-Platform**: Works on MacOS, Linux, and Windows.
- **Easy Setup**: Quick configuration with your Figma API key.

---

## Demo

[Watch a demo of building a UI in Cursor with Figma design data](https://youtu.be/6G9yb-LrEqg)

[![Watch the video](https://img.youtube.com/vi/6G9yb-LrEqg/maxresdefault.jpg)](https://youtu.be/6G9yb-LrEqg)

---

## How it Works

1. Open your IDE's chat (e.g. agent mode in Cursor).
2. Paste a link to a Figma file, frame, or group.
3. Ask Cursor to do something with the Figma file—e.g. implement the design.
4. Cursor fetches the relevant metadata from Figma and uses it to write your code.

This MCP server is specifically designed for use with Cursor. Before responding with context from the [Figma API](https://www.figma.com/developers/api), it simplifies and translates the response so only the most relevant layout and styling information is provided to the model.

Reducing the amount of context provided to the model helps make the AI more accurate and the responses more relevant.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- A [Figma API access token](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens)

### Installation & Configuration

Many code editors and other AI clients use a configuration file to manage MCP servers.

The `figma-developer-mcp` server can be configured by adding the following to your configuration file:

#### MacOS / Linux

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR-KEY", "--stdio"]
    }
  }
}
```

#### Windows

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "figma-developer-mcp", "--figma-api-key=YOUR-KEY", "--stdio"]
    }
  }
}
```

> **Note:** Replace `YOUR-KEY` with your actual Figma API key.

For more information, see the [Framelink docs](https://www.framelink.ai/docs/quickstart?utm_source=github&utm_medium=readme&utm_campaign=readme).

---

## Usage

1. Start your IDE and ensure the MCP server is configured as above.
2. Open the chat or agent mode.
3. Paste a Figma file, frame, or group link.
4. Ask your coding agent to implement or analyze the design.

**Example:**
- _"Implement this Figma frame as a React component."_
- _"Extract all color styles from this Figma file."_

---

## Contributing

Contributions are welcome! To contribute:
1. Fork this repository.
2. Create a new branch for your feature or fix.
3. Make your changes and commit them.
4. Open a pull request describing your changes.

Please see the [issues page](https://github.com/GLips/Figma-Context-MCP/issues) for ideas and discussion.

---

## License

This project is licensed under the [MIT License](https://github.com/GLips/Figma-Context-MCP/blob/main/LICENSE).

---

## Support & Contact

- [Framelink Docs](https://www.framelink.ai/docs/quickstart?utm_source=github&utm_medium=readme&utm_campaign=readme)
- [Discord Community](https://framelink.ai/discord)
- [Twitter: @glipsman](https://twitter.com/glipsman)

For bug reports or feature requests, please open an [issue](https://github.com/GLips/Figma-Context-MCP/issues).

---

## Star History

<a href="https://star-history.com/#GLips/Figma-Context-MCP"><img src="https://api.star-history.com/svg?repos=GLips/Figma-Context-MCP&type=Date" alt="Star History Chart" width="600" /></a>

---

## Learn More

The Framelink Figma MCP server is simple but powerful. Get the most out of it by learning more at the [Framelink](https://framelink.ai?utm_source=github&utm_medium=readme&utm_campaign=readme) site.
