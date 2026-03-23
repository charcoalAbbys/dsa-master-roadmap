/**
 * Processes a node to determine its color-coded status based on task completion.
 */
export const calculateNodeProgress = (node) => {
  const tasks = node.data.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.done).length;

  let status = 'pending'; 
  if (completedTasks === totalTasks && totalTasks > 0) {
    status = 'mastered'; // Green
  } else if (completedTasks > 0) {
    status = 'in-progress'; // Yellow
  }

  return {
    ...node,
    data: { ...node.data, status, completedTasks, totalTasks }
  };
};

/**
 * Initial Curriculum Data with Dependencies
 */
export const initialNodes = [
  { id: '1', type: 'topicNode', position: { x: 400, y: 0 }, data: { label: 'Complexity Analysis', tasks: [{name: 'Big O Notation', done: false}, {name: 'Space Complexity', done: false}] } },
  { id: '2', type: 'topicNode', position: { x: 150, y: 150 }, data: { label: 'Arrays & Strings', tasks: [{name: 'Two Pointers', done: false}, {name: 'Sliding Window', done: false}, {name: 'Kadane’s Algorithm', done: false}] } },
  { id: '3', type: 'topicNode', position: { x: 650, y: 150 }, data: { label: 'Recursion', tasks: [{name: 'Base Case Logic', done: false}, {name: 'Backtracking', done: false}] } },
  { id: '4', type: 'topicNode', position: { x: 150, y: 300 }, data: { label: 'Linked Lists', tasks: [{name: 'Reverse List', done: false}, {name: 'Cycle Detection', done: false}] } },
  { id: '5', type: 'topicNode', position: { x: 400, y: 300 }, data: { label: 'Trees', tasks: [{name: 'BFS/DFS Traversal', done: false}, {name: 'LCA of BST', done: false}] } },
  { id: '6', type: 'topicNode', position: { x: 400, y: 450 }, data: { label: 'Dynamic Programming', tasks: [{name: 'Knapsack 0/1', done: false}, {name: 'Longest Common Subsequence', done: false}] } }
].map(calculateNodeProgress);

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e5-6', source: '5', target: '6' }
];

export const createNewNode = (label, x = 100, y = 100) => {
  return calculateNodeProgress({
    id: `node-${Date.now()}`,
    type: 'topicNode',
    position: { x, y },
    data: { 
      label: label || "New Topic", 
      notes: "", // Added topic-level notes
      tasks: [],
      status: 'pending',
      completedTasks: 0,
      totalTasks: 0
    }
  });
};