'use client';

import { GraveDataType } from '@/actions/getGraveStats';
import { Circle } from 'lucide-react';
import React from 'react';
import { Pie, ResponsiveContainer, PieChart, Cell, Legend } from 'recharts';

interface PieChartProps {
  data: GraveDataType[];
}

const CustomizedLegend: React.FC<PieChartProps> = ({ data }) => {
  return (
    <ul className="flex flex-row flex-wrap gap-x-4">
      {data.map(
        (entry, index) =>
          entry.total !== 0 && (
            <li key={`item-${index}`}>
              <div className="flex flex-row items-center">
                <div
                  style={{ backgroundColor: `${entry.colour}` }}
                  className={`h-4 w-4 rounded-full mr-2`}
                />
                <h1 className="">
                  {entry.name} ({entry.total})
                </h1>
              </div>
            </li>
          )
      )}
    </ul>
  );
};

const PieChartOverview: React.FC<PieChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350} className="p-2">
      <PieChart width={700} height={900} className="flex flex-col h-[100%]">
        <Pie
          data={data}
          dataKey="total"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={50}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={data[index].colour}
              height={200}
              width={200}
            />
          ))}
        </Pie>
        <Legend content={<CustomizedLegend data={data} />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartOverview;
