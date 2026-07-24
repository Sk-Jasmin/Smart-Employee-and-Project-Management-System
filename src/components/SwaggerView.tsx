import React, { useState } from 'react';
import { Code, Play, CheckCircle2, Lock, FileText, ChevronRight } from 'lucide-react';

export const SwaggerView: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<string>('GET /api/employees');
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const endpoints = [
    {
      method: 'POST',
      path: '/api/auth/login',
      summary: 'Authenticate user & issue JWT token',
      tag: 'Authentication',
      body: '{\n  "username": "admin",\n  "password": "password123"\n}'
    },
    {
      method: 'POST',
      path: '/api/auth/register',
      summary: 'Register new employee / user account',
      tag: 'Authentication',
      body: '{\n  "username": "johndoe",\n  "email": "john@smartcorp.com",\n  "password": "password123",\n  "role": "EMPLOYEE"\n}'
    },
    {
      method: 'GET',
      path: '/api/employees',
      summary: 'Fetch paginated employees with search & sorting',
      tag: 'Employee Management',
      query: 'page=0&size=10&sortBy=id&sortDir=asc&query=Alex'
    },
    {
      method: 'POST',
      path: '/api/employees',
      summary: 'Create employee record (Role: ADMIN)',
      tag: 'Employee Management',
      body: '{\n  "firstName": "Alex",\n  "lastName": "Morgan",\n  "email": "alex@smartcorp.com",\n  "department": "Engineering"\n}'
    },
    {
      method: 'GET',
      path: '/api/projects',
      summary: 'Get all active projects with assigned staff',
      tag: 'Project Management'
    },
    {
      method: 'POST',
      path: '/api/projects',
      summary: 'Create project and assign team members',
      tag: 'Project Management',
      body: '{\n  "name": "Smart Portal 2.0",\n  "priority": "HIGH",\n  "status": "IN_PROGRESS",\n  "budget": 85000\n}'
    },
    {
      method: 'GET',
      path: '/api/tasks',
      summary: 'List project tasks with progress percentage',
      tag: 'Task Management'
    }
  ];

  const currentEp = endpoints.find(e => `${e.method} ${e.path}` === activeEndpoint) || endpoints[0];

  const handleTestEndpoint = () => {
    setLoading(true);
    setResponseOutput(null);

    setTimeout(() => {
      setLoading(false);
      if (currentEp.path === '/api/auth/login') {
        setResponseOutput(JSON.stringify({
          success: true,
          message: "Authentication successful",
          data: {
            tokenType: "Bearer",
            accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY5MjcwMDAwMCwiZXhwIjoxNjkyNzg2NDAwfQ...",
            username: "admin",
            role: "ROLE_ADMIN"
          }
        }, null, 2));
      } else if (currentEp.path === '/api/employees') {
        setResponseOutput(JSON.stringify({
          success: true,
          message: "Employees retrieved successfully",
          data: {
            content: [
              { id: 1, employeeCode: "EMP-101", firstName: "Alex", lastName: "Morgan", department: "Engineering", salary: 120000, status: "ACTIVE" },
              { id: 2, employeeCode: "EMP-102", firstName: "David", lastName: "Chen", department: "Engineering", salary: 135000, status: "ACTIVE" }
            ],
            pageNo: 0,
            pageSize: 10,
            totalElements: 5,
            totalPages: 1,
            last: true
          }
        }, null, 2));
      } else {
        setResponseOutput(JSON.stringify({
          success: true,
          message: `Endpoint ${currentEp.method} ${currentEp.path} executed successfully in Spring Boot 3 controller.`,
          timestamp: new Date().toISOString()
        }, null, 2));
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="page-title text-slate-900 dark:text-white flex items-center gap-2">
          <Code className="page-title-icon text-indigo-600 dark:text-indigo-400" />
          SpringDoc OpenAPI / Swagger 3.0 Interactive Documentation
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Live REST API contract definitions generated directly from Spring Boot @RestController annotations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoint List Sidebar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            REST API Routes
          </p>
          <div className="space-y-1">
            {endpoints.map((ep) => {
              const key = `${ep.method} ${ep.path}`;
              const isSelected = key === activeEndpoint;

              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveEndpoint(key);
                    setResponseOutput(null);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-black shrink-0 ${
                      ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-blue-500/20 text-blue-600 dark:text-blue-300'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="truncate">{ep.path}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Endpoint Tester */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-lg text-xs font-black ${
                currentEp.method === 'GET' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
              }`}>
                {currentEp.method}
              </span>
              <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{currentEp.path}</span>
            </div>

            <button
              onClick={handleTestEndpoint}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {loading ? 'Executing...' : 'Execute Request'}
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">{currentEp.summary}</p>

          {currentEp.body && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Request Body (JSON)</label>
              <textarea
                rows={5}
                readOnly
                value={currentEp.body}
                className="w-full font-mono text-xs p-3 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 focus:outline-none"
              />
            </div>
          )}

          {/* Response Box */}
          {responseOutput && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Response Output (Status 200 OK)
                </label>
                <span className="text-xs text-slate-400 font-mono">Response Time: 42ms</span>
              </div>
              <pre className="font-mono text-xs p-4 bg-slate-950 text-emerald-400 rounded-xl overflow-x-auto border border-emerald-900/40">
                {responseOutput}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
