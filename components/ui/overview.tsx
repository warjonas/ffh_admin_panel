'use client';
import { BarGraphData } from '@/actions/getGraphRevenue';
import { formatter } from '@/lib/utils';
import React from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

interface OverviewProps {
  data: BarGraphData[];
}

export const Overview: React.FC<OverviewProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350} className="p-2">
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${formatter.format(value)}`}
        />
        <Bar dataKey={'total'} radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell fill={entry.colour} key={entry.name} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
