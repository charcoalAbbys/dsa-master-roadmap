import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ReactFlow, { Background, Controls, applyEdgeChanges, applyNodeChanges, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import TopicNode from './TopicNode';
import { calculateNodeProgress, initialNodes, initialEdges, createNewNode } from './utils';

const nodeTypes = { topicNode: TopicNode };

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [newNodeName, setNewNodeName] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [editingNotesId, setEditingNotesId] = useState(null); 
  const fileInputRef = useRef(null);

  // Sync with LocalStorage
  useEffect(() => {
    const savedNodes = localStorage.getItem('dsa-tracker-nodes');
    const savedEdges = localStorage.getItem('dsa-tracker-edges');
    setNodes(savedNodes ? JSON.parse(savedNodes) : initialNodes);
    setEdges(savedEdges ? JSON.parse(savedEdges) : initialEdges);
  }, []);

  useEffect(() => {
    if (nodes.length > 0) {
      localStorage.setItem('dsa-tracker-nodes', JSON.stringify(nodes));
      localStorage.setItem('dsa-tracker-edges', JSON.stringify(edges));
    }
  }, [nodes, edges]);

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId), [nodes, selectedNodeId]);

  const updateNodeData = (nodeId, newData) => {
    setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n)));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskName.trim() || !selectedNodeId) return;
    const updatedTasks = [...(selectedNode.data.tasks || []), { name: newTaskName, done: false, notes: "" }];
    updateNodeData(selectedNodeId, { tasks: updatedTasks });
    setNewTaskName('');
  };

  const toggleTask = (idx) => {
    setNodes((nds) => nds.map(n => {
      if (n.id === selectedNodeId) {
        const updatedTasks = n.data.tasks.map((t, i) => i === idx ? { ...t, done: !t.done } : t);
        return calculateNodeProgress({...n, data: {...n.data, tasks: updatedTasks}});
      }
      return n;
    }));
  };

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  // Shared High-Contrast Styles
  const inputStyle = {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #cbd5e1',
    backgroundColor: '#ffffff', // Explicit White BG
    color: '#0f172a',           // Explicit Dark Text
    fontSize: '0.95rem',
    outline: 'none'
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', position: 'fixed', top: 0, left: 0, backgroundColor: '#f1f5f9' }}>
      
      <aside style={{ width: '450px', minWidth: '450px', backgroundColor: '#ffffff', borderRight: '2px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>DSA Roadmap</h1>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {selectedNode ? (
            <div style={{ color: '#1e293b' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>{selectedNode.data.label}</h2>
              
              {/* TOPIC LEVEL NOTES */}
              <div style={{ marginBottom: '24px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>TOPIC NOTES</span>
                  <button onClick={() => setEditingNotesId(editingNotesId === 'topic' ? null : 'topic')} style={{ border: 'none', background: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}>
                    {editingNotesId === 'topic' ? 'Done' : 'Edit'}
                  </button>
                </div>
                {editingNotesId === 'topic' ? (
                  <textarea 
                    style={{ ...inputStyle, width: '100%', height: '100px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    value={selectedNode.data.notes || ""}
                    onChange={(e) => updateNodeData(selectedNodeId, { notes: e.target.value })}
                    placeholder="Add high-level strategy notes here..."
                  />
                ) : (
                  <div style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap', color: '#334155' }}>
                    {selectedNode.data.notes || "No notes yet. Click edit to add."}
                  </div>
                )}
              </div>

              <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <input value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} placeholder="New Problem..." style={inputStyle} />
                <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 15px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
              </form>

              {selectedNode.data.tasks.map((task, idx) => (
                <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: '12px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" checked={!!task.done} onChange={() => toggleTask(idx)} style={{ width: '20px', height: '20px', marginRight: '12px', cursor: 'pointer' }} />
                    <span style={{ flex: 1, fontWeight: '700', color: '#0f172a', textDecoration: task.done ? 'line-through' : 'none' }}>{task.name}</span>
                    <button onClick={() => setEditingNotesId(editingNotesId === idx ? null : idx)} style={{ background: '#f1f5f9', border: 'none', color: '#475569', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.75rem' }}>
                      {editingNotesId === idx ? 'Close' : 'Notes'}
                    </button>
                  </div>
                  
                  {editingNotesId === idx && (
                    <textarea 
                      style={{ ...inputStyle, width: '100%', height: '80px', marginTop: '12px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                      value={task.notes || ""}
                      placeholder="Add solution approach or LeetCode link..."
                      onChange={(e) => {
                        const newTasks = [...selectedNode.data.tasks];
                        newTasks[idx].notes = e.target.value;
                        updateNodeData(selectedNodeId, { tasks: newTasks });
                      }}
                    />
                  )}
                  {editingNotesId !== idx && task.notes && (
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px', paddingLeft: '32px', whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>
                      {task.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '50px' }}>Select a topic to begin tracking.</p>}
        </div>

        <div style={{ padding: '24px', borderTop: '2px solid #f1f5f9' }}>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!newNodeName.trim()) return;
            setNodes((nds) => [...nds, createNewNode(newNodeName, 200, 200)]);
            setNewNodeName('');
          }} style={{ display: 'flex', gap: '8px' }}>
            <input value={newNodeName} onChange={(e) => setNewNodeName(e.target.value)} placeholder="Add New Topic..." style={inputStyle} />
            <button type="submit" style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 20px', fontWeight: 'bold', cursor: 'pointer' }}>ADD</button>
          </form>
        </div>
      </aside>

      <main style={{ flex: 1, position: 'relative' }}>
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeClick={(e, node) => setSelectedNodeId(node.id)} nodeTypes={nodeTypes} fitView style={{ width: '100%', height: '100%' }}>
          <Background color="#cbd5e1" gap={25} />
          <Controls />
        </ReactFlow>
      </main>
    </div>
  );
}