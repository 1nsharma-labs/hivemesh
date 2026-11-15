import { EnterpriseLicenseVerifier } from '../license/verifier.js';

export class AgentDeadlockGuard {
  constructor(licenseKey) {
    this.verification = EnterpriseLicenseVerifier.verifyKey(licenseKey);
    if (!this.verification.valid) {
      throw new Error(`Enterprise License required for Deadlock Guard: ${this.verification.reason}`);
    }
  }

  detectDeadlock(tasksMap) {
    const visited = new Set();
    const recStack = new Set();
    const deadlocks = [];

    const tasks = Array.from(tasksMap.values());

    const dfs = (taskId, path) => {
      visited.add(taskId);
      recStack.add(taskId);

      const task = tasksMap.get(taskId);
      const deps = task?.dependencies || [];

      for (const depId of deps) {
        if (!visited.has(depId)) {
          dfs(depId, [...path, depId]);
        } else if (recStack.has(depId)) {
          deadlocks.push([...path, depId]);
        }
      }

      recStack.delete(taskId);
    };

    for (const t of tasks) {
      if (!visited.has(t.id)) {
        dfs(t.id, [t.id]);
      }
    }

    return {
      deadlockDetected: deadlocks.length > 0,
      cycles: deadlocks
    };
  }
}
