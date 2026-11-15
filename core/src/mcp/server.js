import readline from 'readline';
import { HiveOrchestrator } from '../mesh/orchestrator.js';

export class HiveMcpServer {
  constructor() {
    this.orchestrator = new HiveOrchestrator();
    this.orchestrator.setupDefaultSwarm();
  }

  start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on('line', async (line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      try {
        const request = JSON.parse(trimmed);
        const response = await this.handleMessage(request);
        if (response) {
          process.stdout.write(JSON.stringify(response) + '\n');
        }
      } catch (err) {
        process.stdout.write(JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32700, message: `Parse error: ${err.message}` }
        }) + '\n');
      }
    });

    process.stderr.write('🐝 HiveMesh MCP Server running on stdio\n');
  }

  async handleMessage(req) {
    const { id, method, params } = req;

    if (method === 'initialize') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: {
            name: 'hivemesh-mcp',
            version: '1.0.0'
          }
        }
      };
    }

    if (method === 'tools/list') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools: [
            {
              name: 'hive_dispatch_workflow',
              description: 'Dispatches an autonomous multi-agent swarm (Architect, Coder, SecurityGuard, Tester) to coordinate and complete a complex goal.',
              inputSchema: {
                type: 'object',
                properties: {
                  goal: { type: 'string', description: 'Goal description for the swarm' }
                },
                required: ['goal']
              }
            },
            {
              name: 'hive_get_blackboard',
              description: 'Reads the shared Blackboard snapshot including tasks, active agents, and event ledger.',
              inputSchema: { type: 'object', properties: {} }
            },
            {
              name: 'hive_create_task',
              description: 'Injects a new task into the shared blackboard for agents to claim.',
              inputSchema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  role: { type: 'string', description: 'Target agent role (Architect, Coder, Tester, SecurityGuard)' }
                },
                required: ['title', 'role']
              }
            }
          ]
        }
      };
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      const args = params?.arguments || {};

      try {
        let content = '';

        if (toolName === 'hive_dispatch_workflow') {
          const res = await this.orchestrator.runWorkflow(args.goal);
          content = JSON.stringify(res, null, 2);
        } else if (toolName === 'hive_get_blackboard') {
          const snap = this.orchestrator.blackboard.getSnapshot();
          content = JSON.stringify(snap, null, 2);
        } else if (toolName === 'hive_create_task') {
          const task = this.orchestrator.blackboard.createTask(args.title, args.description || '', args.role);
          content = JSON.stringify(task, null, 2);
        } else {
          return {
            jsonrpc: '2.0',
            id,
            error: { code: -32601, message: `Tool "${toolName}" not found.` }
          };
        }

        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: content }]
          }
        };
      } catch (err) {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            isError: true,
            content: [{ type: 'text', text: `Error: ${err.message}` }]
          }
        };
      }
    }

    return {
      jsonrpc: '2.0',
      id,
      result: {}
    };
  }
}
