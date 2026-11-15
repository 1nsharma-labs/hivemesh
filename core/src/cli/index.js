#!/usr/bin/env node
import { HiveOrchestrator } from '../mesh/orchestrator.js';
import { HiveMcpServer } from '../mcp/server.js';

const BANNER = `
   _   _ _           __  __           _     
  | | | (_)_   _____|  \\/  | ___  ___| |__  
  | |_| | \\ \\ / / _ \\ |\\/| |/ _ \\/ __| '_ \\ 
  |  _  | |\\ V /  __/ |  | |  __/\\__ \\ | | |
  |_| |_|_| \\_/ \\___|_|  |_|\\___||___/_| |_|
                                            
  Autonomous Multi-Agent Workspace Orchestration Mesh & Event Blackboard
  Powered by Hive • Created by Amit Sharma (@1nsharma) • 1nsharma-labs
`;

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  if (command === 'help' || command === '--help' || command === '-h') {
    console.log(BANNER);
    console.log(`Usage: hivemesh <command> [options]\n`);
    console.log(`Commands:`);
    console.log(`  run "<goal>"      Dispatch autonomous multi-agent swarm to coordinate and complete a goal`);
    console.log(`  board             Inspect current shared blackboard task states and event history`);
    console.log(`  mcp               Launch Model Context Protocol (MCP) server for Claude / Cursor`);
    console.log(`\nExamples:`);
    console.log(`  hivemesh run "Build user authentication service"`);
    console.log(`  hivemesh board\n`);
    process.exit(0);
  }

  if (command === 'mcp') {
    const server = new HiveMcpServer();
    server.start();
    return;
  }

  console.log(BANNER);

  const orchestrator = new HiveOrchestrator();
  orchestrator.setupDefaultSwarm();

  if (command === 'run') {
    const goal = args.slice(1).join(' ') || 'Build production-ready micro-service';
    console.log(`🎯 Goal: "${goal}"`);
    console.log(`🐝 Activating Multi-Agent Swarm (Architect, Coder, SecurityGuard, Tester)...\n`);

    const result = await orchestrator.runWorkflow(goal);

    console.log(`📊 Swarm Execution Completed in ${result.rounds} rounds (${result.durationMs}ms):\n`);
    result.trace.forEach(t => {
      console.log(`  Round ${t.round}: [${t.role}] claimed & completed -> "${t.title}"`);
    });

    console.log(`\n✅ All ${result.completedTasks}/${result.totalTasks} tasks verified and merged.\n`);
  } else if (command === 'board') {
    const snap = orchestrator.blackboard.getSnapshot();
    console.log(`📋 Shared Blackboard Status:`);
    console.log(`  Total Tasks: ${snap.totalTasks} | Completed: ${snap.completed} | Pending: ${snap.pending}`);
    console.log(`  Events Logged: ${snap.eventsCount}\n`);
  } else {
    console.error(`Unknown command: "${command}". Run "hivemesh help" for usage.`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
