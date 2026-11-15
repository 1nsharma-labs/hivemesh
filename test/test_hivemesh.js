import assert from 'assert';
import { SharedBlackboard } from '../core/src/board/blackboard.js';
import { AgentWorker } from '../core/src/agents/agentWorker.js';
import { HiveOrchestrator } from '../core/src/mesh/orchestrator.js';
import { EnterpriseLicenseVerifier } from '../ee/license/verifier.js';
import { AgentDeadlockGuard } from '../ee/consensus/deadlockGuard.js';

console.log('🧪 Running HiveMesh Test Suite...\n');

// 1. SharedBlackboard Tests
console.log('▶ Testing SharedBlackboard (Task Queue & Causal Event Ledger)...');
const bb = new SharedBlackboard();
const t1 = bb.createTask('Design', 'Design system', 'Architect');
const t2 = bb.createTask('Build', 'Build code', 'Coder', [t1.id]);

assert(t1.status === 'PENDING', 't1 should be pending');
assert(t2.dependencies[0] === t1.id, 't2 should depend on t1');

// Cannot claim t2 before t1 is completed
const invalidClaim = bb.claimTask(t2.id, 'coder-1');
assert(invalidClaim.success === false, 't2 cannot be claimed before dependency t1');
console.log('  ✔ Task dependency enforcement verified');

// Complete t1
bb.claimTask(t1.id, 'arch-1');
bb.completeTask(t1.id, { architecture: 'Ready' });
assert(bb.tasks.get(t1.id).status === 'COMPLETED', 't1 should be completed');

// Now t2 can be claimed
const validClaim = bb.claimTask(t2.id, 'coder-1');
assert(validClaim.success === true, 't2 should be claimed successfully');
console.log('  ✔ Task lifecycle (create -> dependency -> claim -> complete) verified');

// Test Memory Facts
bb.setFact('CLUSTER_IP', '10.0.0.1');
assert(bb.getFact('CLUSTER_IP') === '10.0.0.1', 'Fact should be stored and retrieved');
console.log('  ✔ Shared memory facts verified');

// 2. Swarm Orchestration Tests
console.log('\n▶ Testing HiveOrchestrator (Multi-Agent Swarm Workflow)...');
const orchestrator = new HiveOrchestrator();
orchestrator.setupDefaultSwarm();
assert(orchestrator.agents.size === 4, 'Should register 4 agents');

const result = await orchestrator.runWorkflow('Build production API Gateway');
assert(result.completed === true, 'Workflow should complete');
assert(result.completedTasks === 4, 'All 4 tasks should be completed');
assert(result.rounds >= 1, 'Should take at least 1 round');
console.log(`  ✔ Swarm completed ${result.completedTasks} tasks across 4 specialized agents in ${result.rounds} round(s) (${result.durationMs}ms)`);

// 3. Enterprise Edition Tests
console.log('\n▶ Testing Enterprise Edition (Deadlock Guard & Licensing)...');
const sampleKey = EnterpriseLicenseVerifier.generateSampleKey('hive-enterprise@corp.internal');
const verif = EnterpriseLicenseVerifier.verifyKey(sampleKey);
assert(verif.valid === true, 'Enterprise license should verify');
console.log(`  ✔ Verified enterprise license for: ${verif.licensee}`);

const deadlockGuard = new AgentDeadlockGuard(sampleKey);
// Create circular deadlock: taskA -> taskB -> taskA
const deadlockMap = new Map();
deadlockMap.set('taskA', { id: 'taskA', dependencies: ['taskB'] });
deadlockMap.set('taskB', { id: 'taskB', dependencies: ['taskA'] });

const dlCheck = deadlockGuard.detectDeadlock(deadlockMap);
assert(dlCheck.deadlockDetected === true, 'Should detect circular deadlock');
console.log(`  ✔ Circular task dependency deadlock correctly detected: ${dlCheck.cycles[0].join(' -> ')}`);

console.log('\n🎉 ALL HIVEMESH TESTS PASSED WITH 100% SUCCESS!\n');
