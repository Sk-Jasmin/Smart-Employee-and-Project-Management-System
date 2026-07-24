import React from 'react';
import { Project } from '../../types';
import { Card, CardHeader, CardBody } from './Card';
import { Badge } from './Badge';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface ProjectGanttChartProps {
  projects: Project[];
}

export const ProjectGanttChart: React.FC<ProjectGanttChartProps> = ({ projects }) => {
  // Simulating Gantt timeline phases across Q3/Q4
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <Card>
      <CardHeader
        action={
          <Badge variant="blue" size="sm">Q3-Q4 Timeline</Badge>
        }
      >
        <span className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
          <Calendar className="w-4 h-4 text-blue-600" /> Project Milestones Timeline
        </span>
      </CardHeader>
      <CardBody className="p-4 space-y-4">
        
        {/* Month Column Headers */}
        <div className="grid grid-cols-12 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="col-span-4">Project Name</div>
          <div className="col-span-8 grid grid-cols-5 text-center">
            {months.map(m => <span key={m}>{m}</span>)}
          </div>
        </div>

        {/* Project Timeline Bars */}
        <div className="space-y-3">
          {projects.slice(0, 4).map((proj, idx) => {
            const startOffsetPercent = (idx * 15) % 40;
            const barWidthPercent = 35 + (idx * 10) % 40;

            return (
              <div key={proj.id} className="grid grid-cols-12 items-center text-xs gap-2">
                <div className="col-span-4 truncate font-semibold text-slate-800 dark:text-slate-200" title={proj.name}>
                  {proj.name}
                </div>
                <div className="col-span-8 bg-slate-100 dark:bg-slate-800/60 h-6 rounded relative overflow-hidden flex items-center px-2">
                  <div
                    className={`h-4 rounded text-[10px] font-bold text-white flex items-center px-2 shadow-2xs transition-all duration-150 ${
                      proj.status === 'COMPLETED'
                        ? 'bg-emerald-600'
                        : proj.status === 'IN_PROGRESS'
                        ? 'bg-blue-600'
                        : 'bg-amber-600'
                    }`}
                    style={{
                      marginLeft: `${startOffsetPercent}%`,
                      width: `${barWidthPercent}%`
                    }}
                  >
                    <span className="truncate">{proj.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </CardBody>
    </Card>
  );
};
