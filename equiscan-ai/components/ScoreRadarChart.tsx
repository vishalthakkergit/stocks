import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ScoreParameter } from '../types';

interface Props {
  data: ScoreParameter[];
}

const ScoreRadarChart: React.FC<Props> = ({ data }) => {
  // Simplify parameter names for the chart to fit better on small axes
  const chartData = data.map(item => ({
    ...item,
    shortName: item.parameter.length > 15 ? item.parameter.split(' ')[0] + '...' : item.parameter
  }));

  return (
    <div className="w-full h-[300px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis 
            dataKey="shortName" 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', borderRadius: '0.5rem' }}
            itemStyle={{ color: '#10b981' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreRadarChart;
