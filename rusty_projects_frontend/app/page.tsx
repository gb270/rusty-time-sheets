// pages/index.tsx
'use client'

// app/page.tsx
import { useState } from 'react';
import Layout from './components/Layout';

const Home: React.FC = () => {
  const [projectName, setProjectName] = useState<string>('');
  const [taskName, setTaskName] = useState<string>('');
  const [priceCode, setPriceCode] = useState<string>('');
  const [isTaskRunning, setIsTaskRunning] = useState<boolean>(false);

  const projects = ['Project A', 'Project B', 'Project C'];
  const tasks = ['Task 1', 'Task 2', 'Task 3'];
  const priceCodes = ['Code 1', 'Code 2', 'Code 3'];

  const toggleTask = () => {
    setIsTaskRunning(!isTaskRunning);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Time Tracking App</h1>
      <div className="mb-4">
        <label className="block mb-2">
          Project Name:
          <select value={projectName} onChange={(e) => setProjectName(e.target.value)} className="block w-full p-2 border border-gray-300 rounded">
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Task Name:
          <select value={taskName} onChange={(e) => setTaskName(e.target.value)} className="block w-full p-2 border border-gray-300 rounded">
            <option value="">Select a task</option>
            {tasks.map((task) => (
              <option key={task} value={task}>{task}</option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Price Code:
          <select value={priceCode} onChange={(e) => setPriceCode(e.target.value)} className="block w-full p-2 border border-gray-300 rounded">
            <option value="">Select a price code</option>
            {priceCodes.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </label>
      </div>

      <button
        onClick={toggleTask}
        className={`p-2 text-white rounded ${isTaskRunning ? 'bg-red-600' : 'bg-blue-600'}`}
      >
        {isTaskRunning ? 'Stop Task' : 'Start Task'}
      </button>
      <div className="mt-4 font-bold">
        {isTaskRunning ? 'Task is currently running' : 'No task running'}
      </div>
    </Layout>
  );
};

export default Home;
