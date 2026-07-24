import React from 'react';
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
  AreaChart as ReAreaChart,
  Area
} from 'recharts';

// Modern Palette Colors
const INDIGO_PRIMARY = '#6366F1'; 
const EMERALD_PRIMARY = '#10B981'; 
const VIOLET_PRIMARY = '#8B5CF6'; 
const AMBER_PRIMARY = '#F59E0B'; 
const CYAN_PRIMARY = '#06B6D4'; 

const PIE_COLORS = [INDIGO_PRIMARY, EMERALD_PRIMARY, VIOLET_PRIMARY, AMBER_PRIMARY, CYAN_PRIMARY];

interface ChartDataPoint {
  name: string;
  [key: string]: any;
}

interface CustomBarChartProps {
  data: ChartDataPoint[];
  xKey: string;
  bars: { key: string; name: string; color?: string }[];
  height?: number;
}

export const CorporateBarChart: React.FC<CustomBarChartProps> = ({
  data,
  xKey,
  bars,
  height = 300
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ReBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }} />
          <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              borderColor: '#334155',
              borderRadius: '10px',
              color: '#F8FAFC',
              fontSize: '12px',
              fontWeight: 600,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
          {bars.map((b, idx) => (
            <Bar
              key={b.key}
              dataKey={b.key}
              name={b.name}
              fill={b.color || (idx === 0 ? INDIGO_PRIMARY : EMERALD_PRIMARY)}
              radius={[6, 6, 0, 0]}
            />
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface CustomPieChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

export const CorporatePieChart: React.FC<CustomPieChartProps> = ({ data, height = 280 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              borderColor: '#334155',
              borderRadius: '10px',
              color: '#F8FAFC',
              fontSize: '12px',
              fontWeight: 600,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}
          />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface CustomAreaChartProps {
  data: ChartDataPoint[];
  xKey: string;
  yKey: string;
  name: string;
  color?: string;
  height?: number;
}

export const CorporateAreaChart: React.FC<CustomAreaChartProps> = ({
  data,
  xKey,
  yKey,
  name,
  color = INDIGO_PRIMARY,
  height = 260
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ReAreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#64748B' }} />
          <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              borderColor: '#334155',
              borderRadius: '10px',
              color: '#F8FAFC',
              fontSize: '12px',
              fontWeight: 600,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}
          />
          <Area
            type="monotone"
            dataKey={yKey}
            name={name}
            stroke={color}
            strokeWidth={2.5}
            fill={color}
            fillOpacity={0.25}
          />
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
};
