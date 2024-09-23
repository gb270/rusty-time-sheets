'use client'

import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { invoke } from '@tauri-apps/api/tauri';

const Home: React.FC = () => {
  const [projectName, setProjectName] = useState<string>('');
  const [taskName, setTaskName] = useState<string>('');
  const [priceCode, setPriceCode] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [costPerHour, setCostPerHour] = useState<string>('');
  const [isTaskRunning, setIsTaskRunning] = useState<boolean>(false);
  
  const [projects, setProjects] = useState<string[]>([]);
  const [priceCodes, setPriceCodes] = useState<{ code: string, display: string }[]>([]);

  // Load existing projects and price codes on component mount
  useEffect(() => {
    loadProjects();
    loadPriceCodes();
  }, []);

  const loadProjects = async () => {
    const result = await invoke('query', {
      query: 'SELECT name FROM projects',
    }) as { name: string }[]; // Assuming the result is an array of project names
    setProjects(result.map(project => project.name));
  };

  const loadPriceCodes = async () => {
    const result = await invoke('query', {
      query: 'SELECT code, currency, cost_per_hour FROM price_codes',
    }) as { code: string, currency: string, cost_per_hour: number }[]; // Assuming result contains price codes
    setPriceCodes(result.map(({ code, currency, cost_per_hour }) => ({
      code,
      display: `${code} (${currency} ${cost_per_hour}/hr)`
    })));
  };

  const toggleTask = () => {
    setIsTaskRunning(!isTaskRunning);
  };

  const addProject = async () => {
    try {
      await invoke('execute', {
        query: 'INSERT INTO projects (name) VALUES ($1)',
        values: [projectName],
      });
      console.log(`Added project: ${projectName}`);
      setProjectName(''); // Reset input
      await loadProjects(); // Reload projects after adding
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const addPriceCode = async () => {
    await invoke('execute', {
      query: 'INSERT INTO price_codes (code, currency, cost_per_hour) VALUES ($1, $2, $3)',
      values: [priceCode, currency, costPerHour],
    });
    setPriceCode(''); // Reset input
    setCurrency('');  // Reset input
    setCostPerHour(''); // Reset input
    loadPriceCodes(); // Reload price codes after adding
  };

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Time Tracking App</h1>
      
      {/* Task Management */}
      <div className="mb-4">
        <label className="block mb-2">
          Project Name:
          <select 
            value={projectName} 
            onChange={(e) => setProjectName(e.target.value)} 
            className="block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Task Name:
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task name"
            className="block w-full p-2 border border-gray-300 rounded"
          />
        </label>

        <label className="block mb-2">
          Price Code:
          <select 
            value={priceCode} 
            onChange={(e) => setPriceCode(e.target.value)} 
            className="block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a price code</option>
            {priceCodes.map(({ code, display }) => (
              <option key={code} value={code}>{display}</option>
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
        {isTaskRunning 
          ? `${taskName || 'Task'} is running as part of ${projectName || 'Project'} on price code ${priceCode || 'Price Code'}.` 
          : 'No task running'}
      </div>

      {/* Add Project Section */}
      <div className="mt-8">
        <h2 className="text-xl mb-4">Add Project</h2>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project Name"
          className="block w-full p-2 border border-gray-300 rounded mb-2"
        />
        <button 
          onClick={addProject} 
          className="p-2 bg-green-600 text-white rounded"
        >
          + Add Project
        </button>
      </div>

      {/* Add Price Code Section */}
      <div className="mt-8">
        <h2 className="text-xl mb-4">Add Price Code</h2>
        <input
          type="text"
          value={priceCode}
          onChange={(e) => setPriceCode(e.target.value)}
          placeholder="Price Code"
          className="block w-full p-2 border border-gray-300 rounded mb-2"
        />
        <input
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          placeholder="Currency (e.g. USD)"
          className="block w-full p-2 border border-gray-300 rounded mb-2"
        />
        <input
          type="number"
          value={costPerHour}
          onChange={(e) => setCostPerHour(e.target.value)}
          placeholder="Cost per Hour"
          className="block w-full p-2 border border-gray-300 rounded mb-2"
        />
        <button 
          onClick={addPriceCode} 
          className="p-2 bg-green-600 text-white rounded"
        >
          + Add Price Code
        </button>
      </div>
    </Layout>
  );
};

export default Home;
