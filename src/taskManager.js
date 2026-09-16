/**
 * TaskFlow — Core task management logic.
 * Works as a Node.js module (for Jest tests) and as a browser global.
 */
(function (exports) {
  'use strict';

  var _idCounter = 0;

  function _nextId() {
    return ++_idCounter;
  }

  function createTask(text, priority, dueDate) {
    return {
      id: _nextId(),
      text: text,
      completed: false,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Returns a new array with the given task appended.
   * `dueDate` is optional and stored as an ISO date string (YYYY-MM-DD) or null.
   * Throws if text is empty or whitespace-only.
   */
  function addTask(tasks, text, priority, dueDate) {
    var trimmed = (text || '').trim();
    if (!trimmed) {
      throw new Error('Task text cannot be empty');
    }
    return tasks.concat([createTask(trimmed, priority, dueDate)]);
  }

  /**
   * Returns a new array with the matching task's completed flag toggled.
   */
  function toggleTask(tasks, id) {
    return tasks.map(function (task) {
      if (task.id === id) {
        return Object.assign({}, task, { completed: !task.completed });
      }
      return task;
    });
  }

  /**
   * Returns a new array with the matching task removed.
   */
  function deleteTask(tasks, id) {
    return tasks.filter(function (task) {
      return task.id !== id;
    });
  }

  /**
   * Returns a new array with all completed tasks removed.
   */
  function clearCompleted(tasks) {
    return tasks.filter(function (task) {
      return !task.completed;
    });
  }

  /**
   * Returns the number of active (incomplete) tasks.
   * BUG: returns total task count instead of incomplete task count.
   */
  function getActiveCount(tasks) {
    return tasks.length;
  }

  /**
   * Formats a Date as an ISO date string (YYYY-MM-DD) in local time.
   */
  function _toDateString(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1);
    var d = String(date.getDate());
    if (m.length < 2) { m = '0' + m; }
    if (d.length < 2) { d = '0' + d; }
    return y + '-' + m + '-' + d;
  }

  /**
   * Returns true if the task has a due date that falls before today.
   * Completed tasks are never considered overdue. Tasks without a due
   * date are never overdue.
   * `now` is optional (defaults to the current date) and exists mainly
   * to make the check deterministic in tests.
   */
  function isOverdue(task, now) {
    if (!task.dueDate || task.completed) {
      return false;
    }
    var today = now ? new Date(now) : new Date();
    return task.dueDate < _toDateString(today);
  }

  /**
   * Returns tasks filtered by the given filter string.
   * filter: 'all' | 'active' | 'completed'
   */
  function filterTasks(tasks, filter) {
    if (filter === 'active') {
      return tasks.filter(function (task) { return !task.completed; });
    }
    if (filter === 'completed') {
      return tasks.filter(function (task) { return task.completed; });
    }
    return tasks;
  }

  exports.createTask = createTask;
  exports.addTask = addTask;
  exports.toggleTask = toggleTask;
  exports.deleteTask = deleteTask;
  exports.clearCompleted = clearCompleted;
  exports.getActiveCount = getActiveCount;
  exports.isOverdue = isOverdue;
  exports.filterTasks = filterTasks;

})(typeof module !== 'undefined' ? module.exports : (window.TaskManager = {}));
