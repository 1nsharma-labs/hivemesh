export class AgentWorker {
  constructor(id, role, blackboard, options = {}) {
    this.id = id;
    this.role = role;
    this.blackboard = blackboard;
    this.status = 'IDLE';
    this.completedTasksCount = 0;
  }

  async runStep() {
    const snapshot = this.blackboard.getSnapshot();
    const candidate = snapshot.tasks.find(
      t => (t.role === this.role || t.role === 'general') && t.status === 'PENDING'
    );

    if (!candidate) {
      return { active: false, message: `No pending tasks for role "${this.role}"` };
    }

    const claim = this.blackboard.claimTask(candidate.id, this.id);
    if (!claim.success) {
      return { active: false, reason: claim.reason };
    }

    this.status = 'WORKING';

    // Execute Agent Task Work
    const output = await this.executeWork(candidate);

    this.blackboard.completeTask(candidate.id, output);
    this.completedTasksCount++;
    this.status = 'IDLE';

    return {
      active: true,
      taskId: candidate.id,
      title: candidate.title,
      output
    };
  }

  async executeWork(task) {
    if (this.role === 'Architect') {
      return {
        architecture: 'Micro-gateway topology',
        components: ['AuthService', 'RateLimiter', 'ProxyRouter'],
        approved: true
      };
    } else if (this.role === 'Coder') {
      return {
        codeCreated: 'src/server.js',
        linesWritten: 145,
        status: 'IMPLEMENTED'
      };
    } else if (this.role === 'Tester') {
      return {
        testsExecuted: 12,
        passed: 12,
        coveragePct: 98.4,
        status: 'PASSED'
      };
    } else if (this.role === 'SecurityGuard') {
      return {
        cveVulnerabilities: 0,
        secretsLeaked: 0,
        status: 'SECURE'
      };
    }

    return {
      completedAt: Date.now(),
      status: 'DONE',
      note: `Task executed by agent ${this.id}`
    };
  }
}
