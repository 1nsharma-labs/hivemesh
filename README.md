<h1 align="center">🐝 HiveMesh</h1>

<p align="center">
  <b>Autonomous Multi-Agent Workspace Orchestration Mesh & Event Blackboard</b><br>
  <i>Powered by Hive — Created by Amit Sharma (@1nsharma)</i><br>
  Coordinate teams of specialized AI agents with causal task dependency graphs and shared memory ledgers via Model Context Protocol (MCP).
</p>

<p align="center">
  <a href="https://github.com/1nsharma-labs/hivemesh/actions"><img src="https://img.shields.io/badge/build-passing-brightgreen.svg" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/hivemesh"><img src="https://img.shields.io/badge/npm-v1.0.0-blue.svg" alt="npm version"></a>
  <a href="https://github.com/1nsharma-labs/hivemesh/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-green.svg" alt="License"></a>
  <a href="https://1nsharma-labs.github.io/hivemesh/"><img src="https://img.shields.io/badge/Live_Demo-Swarm_Dashboard-orange.svg" alt="Live Demo"></a>
  <a href="https://polar.sh/1nsharma-labs"><img src="https://img.shields.io/badge/Sponsor-Polar.sh-purple.svg" alt="Sponsor"></a>
</p>

---

## 🌟 Why HiveMesh?

Most multi-agent frameworks are bloated, heavily Python-dependent, brittle, and lack clean synchronization primitives.

**HiveMesh** is a zero-runtime-dependency Multi-Agent Workspace Mesh inspired directly by [**1nsharma/Hive**](https://github.com/1nsharma/Hive) (Collaborative AI workspace platform with multi-agent coordination).

### Key Features
* 🐝 **Shared Blackboard Architecture:** Uses a decentralized event blackboard where agents asynchronously claim, execute, and verify tasks based on strict causal dependency DAGs.
* 🤖 **Role-Specialized Autonomous Swarms:** Out-of-the-box swarm orchestration (`Architect -> Coder -> SecurityGuard -> Tester`) executing complex goals in parallel.
* 🔮 **Native Model Context Protocol (MCP) Server:** Allows **Claude Desktop** and **Cursor** to dispatch tasks, inspect agent swarms, and read blackboard state.
* ⚡ **Zero External Dependencies:** Native Node 24 ESM, sub-millisecond task claiming, and in-memory or SQLite storage.
* 🔒 **Enterprise Deadlock & Consensus Guard (BSL 1.1):** Detects and resolves circular task dependency deadlocks across enterprise multi-agent pipelines.

---

## 🚀 Quick Start

### Installation

```bash
# Run on-demand without installing
npx -y hivemesh help

# Or install globally
npm install -g hivemesh
```

---

## 💻 CLI Commands

### 1. Dispatch Autonomous Swarm
```bash
hivemesh run "Build micro-gateway with JWT auth and Prometheus metrics"
```

### 2. Inspect Shared Blackboard Tasks
```bash
hivemesh board
```

---

## 🔮 Model Context Protocol (MCP) Integration

HiveMesh includes a native MCP stdio server. Add it to your `claude_desktop_config.json` or Cursor MCP settings:

```json
{
  "mcpServers": {
    "hivemesh": {
      "command": "npx",
      "args": ["-y", "hivemesh", "mcp"]
    }
  }
}
```

Now Claude Desktop and Cursor can directly execute:
* `hive_dispatch_workflow`: Dispatches an autonomous multi-agent swarm on a goal.
* `hive_get_blackboard`: Reads active tasks, agent statuses, and memory facts.
* `hive_create_task`: Injects new tasks into the blackboard.

---

## 💼 Commercial & Enterprise Support

HiveMesh follows an **Open-Core** model:
* **Community Core (Apache 2.0):** 100% Free for local swarms, blackboard tasks, CLI tools, and full MCP server.
* **Enterprise Edition (BSL 1.1):** Includes the **Agent Deadlock Guard** (`ee/consensus/deadlockGuard.js`) for high-concurrency 100+ agent swarms with Byzantine consensus and SLA support.

### Direct Contact & Payment
* **Lead Architect:** **Amit Sharma** ([@1nsharma](https://github.com/1nsharma))
* **Enterprise Inquiries & Bounties:** [polar.sh/1nsharma-labs](https://polar.sh/1nsharma-labs)
* **Official Contact:** [tech@mowglai.com](mailto:tech@mowglai.com)
* **Global Sponsorship & Cards:** [polar.sh/1nsharma-labs](https://polar.sh/1nsharma-labs) &bull; [github.com/sponsors/1nsharma](https://github.com/sponsors/1nsharma)

---

## 🌐 The 1nsharma Ecosystem

* [**1nsharma/Hive**](https://github.com/1nsharma/Hive) — Foundational Collaborative AI Workspace Platform.
* [**DevDaemon**](https://github.com/1nsharma-labs/devdaemon) — Autonomous Terminal Error Interceptor & Workspace Healer.
* [**DroidArmor**](https://github.com/1nsharma-labs/droidarmor) — Autonomous AI Mobile Agent & Fast ADB Automation for Android.
* [**SlashGraph**](https://github.com/1nsharma-labs/slashgraph) — Universal Codebase & System Architecture Intelligence Graph.
* [**OmniMCP**](https://github.com/1nsharma-labs/omnimcp) — Universal Model Context Protocol Hub for Mobile, Desktop, Workspace & Memory.
* [**TokenArmor**](https://github.com/1nsharma-labs/tokenarmor) — Open-Source AI Gateway & Token FinOps Firewall.
* [**1nsharma/SLASH**](https://github.com/1nsharma/SLASH) — Unified System & Digital Network Intelligence Graph.
* [**1nsharma/Urlmind**](https://github.com/1nsharma/Urlmind) — Understand Anything on the Internet from a Single URL.

---

<p align="center">
  Crafted with ❤️ by <a href="https://github.com/1nsharma"><b>Amit Sharma</b></a> (@1nsharma-labs)
</p>
