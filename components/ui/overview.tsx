'use client';
import { BarGraphData } from '@/actions/getGraphRevenue';
import { formatter } from '@/lib/utils';
import React from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface OverviewProps {
  data: BarGraphData[];
}

const CustomTooltip = ({
  payload,
  active,
}: {
  payload?: any[];
  active: any;
}) => {
  if (payload && active && payload.length) {
    return (
      <div className="top-50 bg-slate-100 border shadow-sm rounded-sm p-2 ">
        <p
          className="text-md font-bold"
          style={{ color: `${payload[0].colour}` }}
        >{`Total: ${formatter.format(payload[0].value)}`}</p>
      </div>
    );
  }

  return null;
};

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

        <Tooltip
          content={({ payload, active }) => (
            <CustomTooltip payload={payload} active={active} />
          )}
        />

        <Bar dataKey={'total'} radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              fill={entry.colour}
              key={entry.name}
              className="relative"
            ></Cell>
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
