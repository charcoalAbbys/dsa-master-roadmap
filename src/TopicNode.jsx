import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const TopicNode = ({ data }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'mastered': return '#16a34a';    // Deep Green
      case 'in-progress': return '#ca8a04'; // Deep Gold
      case 'pending': return '#dc2626';     // Deep Red
      default: return '#475569';           // Slate Gray
    }
  };

  return (
    <div style={{ 
      padding: '16px', 
      borderRadius: '10px', 
      background: '#ffffff', 
      border: `2px solid ${getStatusColor(data.status)}`,
      minWidth: '190px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: '#1e293b', width: '8px', height: '8px' }} />
      
      <div style={{ 
        fontWeight: '800', 
        fontSize: '14px', 
        color: '#0f172a', // Near Black for maximum visibility
        marginBottom: '6px' 
      }}>
        {data.label}
      </div>

      <div style={{ 
        fontSize: '12px', 
        color: '#334155', // Dark Slate
        fontWeight: '600'
      }}>
        Done: {data.completedTasks} / {data.totalTasks}
      </div>

      <div style={{ 
        height: '6px', 
        width: '100%', 
        background: '#e2e8f0', 
        marginTop: '10px', 
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          height: '100%', 
          width: `${(data.completedTasks / (data.totalTasks || 1)) * 100}%`, 
          background: getStatusColor(data.status),
          transition: 'width 0.4s ease-in-out'
        }} />
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#1e293b', width: '8px', height: '8px' }} />
    </div>
  );
};

export default memo(TopicNode);