'use client'

import { useEffect, useState } from 'react';
import Layout from '../components/Layout'; 
import { invoke } from '@tauri-apps/api/tauri';

type Project = {
  id: number;
  name: string;
};

type PriceCode = {
  id: number;
  code: string;
  currency: string;
  cost_per_hour: number;
};

const Settings: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [priceCodes, setPriceCodes] = useState<PriceCode[]>([]);

  useEffect(() => {
    loadProjects();
    loadPriceCodes();
  }, []);

  const loadProjects = async () => {
    const result = await invoke('query', {
      query: 'SELECT * FROM projects',
    }) as Project[]; // Type assertion
    setProjects(result);
  };

  const loadPriceCodes = async () => {
    const result = await invoke('query', {
      query: 'SELECT * FROM price_codes',
    }) as PriceCode[]; // Type assertion
    setPriceCodes(result);
  };

  const deleteProject = async (id: number) => {
    await invoke('execute', {
      query: 'DELETE FROM projects WHERE id=$1',
      values: [id],
    });
    loadProjects(); // Reload after deletion
  };

  const deletePriceCode = async (id: number) => {
    await invoke('execute', {
      query: 'DELETE FROM price_codes WHERE id=$1',
      values: [id],
    });
    loadPriceCodes(); // Reload after deletion
  };

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>

      <div className="mb-8">
        <h2 className="text-xl mb-2">Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id} className="mb-2">
              {project.name}
              <button 
                onClick={() => deleteProject(project.id)} 
                className="ml-4 p-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl mb-2">Price Codes</h2>
        <ul>
          {priceCodes.map((code) => (
            <li key={code.id} className="mb-2">
              {code.code} - {code.currency} {code.cost_per_hour}/hr
              <button 
                onClick={() => deletePriceCode(code.id)} 
                className="ml-4 p-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Settings;
