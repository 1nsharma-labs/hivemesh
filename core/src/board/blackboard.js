import crypto from 'crypto';

export class SharedBlackboard {
  constructor(options = {}) {
    this.tasks = new Map();
    this.memory = new Map();
    this.events = [];
  }

  createTask(title, description, role = 'general', dependencies = []) {
    const id = `task_${crypto.randomBytes(4).toString('hex')}`;
    const task = {
      id,
      title,
      description,
      role,
      status: 'PENDING',
      dependencies,
      assignedAgent: null,
      output: null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.tasks.set(id, task);
    this.logEvent('TASK_CREATED', { taskId: id, title, role });
    return task;
  }

  claimTask(taskId, agentId) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task "${taskId}" not found`);

    // Check if dependencies are met
    for (const depId of task.dependencies) {
      const dep = this.tasks.get(depId);
      if (!dep || dep.status !== 'COMPLETED') {
        return { success: false, reason: `Dependency "${depId}" is not completed.` };
      }
    }

    task.status = 'IN_PROGRESS';
    task.assignedAgent = agentId;
    task.updatedAt = Date.now();
    this.logEvent('TASK_CLAIMED', { taskId, agentId });
    return { success: true, task };
  }

  completeTask(taskId, output = null) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task "${taskId}" not found`);

    task.status = 'COMPLETED';
    task.output = output;
    task.updatedAt = Date.now();
    this.logEvent('TASK_COMPLETED', { taskId, output });
    return task;
  }

  setFact(key, value, source = 'system') {
    this.memory.set(key, { value, source, updatedAt: Date.now() });
    this.logEvent('FACT_UPDATED', { key, source });
  }

  getFact(key) {
    const item = this.memory.get(key);
    return item ? item.value : null;
  }

  logEvent(type, payload = {}) {
    const event = {
      id: this.events.length + 1,
      type,
      payload,
      timestamp: Date.now()
    };
    this.events.push(event);
    return event;
  }

  getSnapshot() {
    return {
      totalTasks: this.tasks.size,
      pending: Array.from(this.tasks.values()).filter(t => t.status === 'PENDING').length,
      inProgress: Array.from(this.tasks.values()).filter(t => t.status === 'IN_PROGRESS').length,
      completed: Array.from(this.tasks.values()).filter(t => t.status === 'COMPLETED').length,
      factsCount: this.memory.size,
      eventsCount: this.events.length,
      tasks: Array.from(this.tasks.values()),
      events: this.events.slice(-20)
    };
  }
}
