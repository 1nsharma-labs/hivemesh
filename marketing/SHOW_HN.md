# Show HN: HiveMesh – Autonomous multi-agent workspace mesh & shared blackboard

Hey Hacker News,

I’m Amit (@1nsharma), founder of 1nsharma-labs. Today I’m releasing **HiveMesh** (Apache 2.0).

### The Problem
Most multi-agent orchestration frameworks (CrewAI, AutoGen) are heavy, have brittle synchronization loops, and lack deterministic event ledgers. Building teams of agents that don't step on each other's toes has been needlessly frustrating.

### What HiveMesh Does
HiveMesh is a zero-runtime-dependency Multi-Agent Workspace Mesh inspired by my earlier architecture project [1nsharma/Hive](https://github.com/1nsharma/Hive):
- **Shared Event Blackboard:** Decoupled task claiming, dependency DAGs, and memory fact propagation.
- **Autonomous Specialized Swarms:** Architect, Coder, SecurityGuard, and Tester collaborating seamlessly on tasks.
- **Native MCP Server:** Dispatch workflows directly from Claude Desktop and Cursor.

- **GitHub:** https://github.com/1nsharma-labs/hivemesh
- **Live In-Browser Swarm Dashboard:** https://1nsharma-labs.github.io/hivemesh/

I'd love your thoughts, feedback, and PRs!
