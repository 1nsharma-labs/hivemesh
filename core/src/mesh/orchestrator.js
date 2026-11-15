import { SharedBlackboard } from '../board/blackboard.js';
import { AgentWorker } from '../agents/agentWorker.js';

export class HiveOrchestrator {
  constructor(options = {}) {
    this.blackboard = new SharedBlackboard();
    this.agents = new Map();
    this.maxRounds = options.maxRounds || 20;
  }

  registerAgent(id, role) {
    const worker = new AgentWorker(id, role, this.blackboard);
    this.agents.set(id, worker);
    return worker;
  }

  setupDefaultSwarm() {
    this.registerAgent('agent-architect', 'Architect');
    this.registerAgent('agent-coder', 'Coder');
    this.registerAgent('agent-tester', 'Tester');
    this.registerAgent('agent-security', 'SecurityGuard');
  }

  async runWorkflow(goal) {
    const startTime = Date.now();

    // 1. Architect designs
    const t1 = this.blackboard.createTask('Design System Architecture', `Design plan for ${goal}`, 'Architect');

    // 2. Coder builds (depends on t1)
    const t2 = this.blackboard.createTask('Implement Feature Code', `Code implementation for ${goal}`, 'Coder', [t1.id]);

    // 3. Security audits (depends on t2)
    const t3 = this.blackboard.createTask('Security & Secret Audit', 'Verify zero secret leaks', 'SecurityGuard', [t2.id]);

    // 4. Tester verifies (depends on t3)
    const t4 = this.blackboard.createTask('Automated QA & Regression Suite', 'Verify 100% passing tests', 'Tester', [t3.id]);

    let round = 0;
    const executionTrace = [];

    while (round < this.maxRounds) {
      round++;
      let anyAction = false;

      for (const [id, agent] of this.agents.entries()) {
        const step = await agent.runStep();
        if (step.active) {
          anyAction = true;
          executionTrace.push({ round, agentId: id, role: agent.role, ...step });
        }
      }

      const snapshot = this.blackboard.getSnapshot();
      if (snapshot.pending === 0 && snapshot.inProgress === 0) {
        break; // All tasks converged and completed!
      }

      if (!anyAction) {
        // Deadlock or waiting
        break;
      }
    }

    const finalSnapshot = this.blackboard.getSnapshot();
    const durationMs = Date.now() - startTime;

    return {
      goal,
      rounds: round,
      durationMs,
      completed: finalSnapshot.completed === finalSnapshot.totalTasks,
      totalTasks: finalSnapshot.totalTasks,
      completedTasks: finalSnapshot.completed,
      trace: executionTrace,
      blackboard: finalSnapshot
    };
  }
}
