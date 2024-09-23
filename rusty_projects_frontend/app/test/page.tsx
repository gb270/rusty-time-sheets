'use client';

import { useEffect, useState } from 'react';
import Layout from '../components/Layout'; 
import { invoke } from '@tauri-apps/api/tauri';
import Database from 'tauri-plugin-sql-api';

const Test: React.FC = () => {
    const [projects, setProjects] = useState<string[]>([]);
    const [newProjectName, setNewProjectName] = useState<string>(''); // State for new project name

    const initDatabase = async () => {
        const db = await Database.load("sqlite:mydatabase.db");
        const result = await db.execute('SELECT name FROM projects');
        const projectNames = Array.isArray(result) ? result.map(row => row.name) : [];
        return projectNames;
    };

    const addProject = async () => {
        const db = await Database.load("sqlite:mydatabase.db");
        await db.execute('INSERT INTO projects (name) VALUES (?)', [newProjectName]);
        setNewProjectName(''); // Reset the input field
        const updatedProjects = await initDatabase(); // Reload projects
        setProjects(updatedProjects); // Update state with new projects
    };

    useEffect(() => {
        const loadProjects = async () => {
            const projectNames = await initDatabase();
            setProjects(projectNames);
        };
        
        loadProjects();
    }, []);

    return (
        <Layout>
            <h1>Test</h1>
            <ul>
                {projects.map((project, index) => (
                    <li key={index}>{project}</li>
                ))}
            </ul>
            <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="New Project Name"
                className="border rounded p-2"
            />
            <button
                onClick={addProject}
                className="bg-blue-600 text-white rounded p-2 ml-2"
            >
                Add Project
            </button>
        </Layout>
    );
};

export default Test;
