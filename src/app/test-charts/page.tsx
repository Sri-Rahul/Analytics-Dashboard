"use client";

import React from 'react';
import { generatePieChartData, generateBarChartData } from '@/lib/data';
import PieChart from '@/components/dashboard/PieChart';
import BarChart from '@/components/dashboard/BarChart';

export default function ChartTest() {
  const pieData = generatePieChartData();
  const barData = generateBarChartData();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Chart Test Page</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Pie Chart Test</h2>
          <PieChart
            title="Traffic Sources"
            data={pieData}
            height={300}
            showLegend={true}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Bar Chart Test</h2>
          <BarChart
            title="Monthly Performance"
            data={barData}
            categories={['Revenue', 'Users', 'Conversions']}
            height={400}
            showLegend={true}
          />
        </div>
      </div>
    </div>
  );
}
