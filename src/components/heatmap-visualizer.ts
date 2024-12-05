import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface HeatmapData {
  postcode: string;
  imdScore: number;
  frequency?: number;
}

interface HeatmapVisualizerProps {
  data: HeatmapData[];
}

const HeatmapVisualizer: React.FC<HeatmapVisualizerProps> = ({ data }) => {
  const maxFrequency = Math.max(...data.map(d => d.frequency || 1));

  return (
    <div className="w-full h-[600px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <XAxis 
            dataKey="postcode" 
            name="Postcode"
            tick={{ angle: -45, textAnchor: 'end' }}
            interval={0}
            height={100}
          />
          <YAxis 
            dataKey="imdScore" 
            name="IMD Score"
            domain={[0, 100]}
            label={{ value: 'IMD Score', angle: -90, position: 'insideLeft' }}
          />
          <ZAxis 
            dataKey="frequency" 
            range={[50, 400]} 
            name="Frequency"
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-4 border rounded shadow">
                    <p className="font-bold">{data.postcode}</p>
                    <p>IMD Score: {data.imdScore.toFixed(2)}</p>
                    <p>Frequency: {data.frequency || 1}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter
            data={data}
            fill="#8884d8"
            fillOpacity={0.6}
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HeatmapVisualizer;
