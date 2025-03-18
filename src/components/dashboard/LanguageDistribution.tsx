import React from 'react';
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartLegend,
  ChartTitle,
} from '@progress/kendo-react-charts';
import 'hammerjs';

const LanguageDistribution = ({ languages }) => {
  return (
    <div className="k-card shadow-md p-4 bg-white">
      <Chart>
        <ChartTitle text="Languages" font="16px Arial, sans-serif" color="#333" />
        <ChartLegend position="right" />
        <ChartSeries>
          <ChartSeriesItem
            type="pie"
            data={languages.map((lang) => ({
              category: lang.name,
              value: lang.percentage,
              color: lang.color,
            }))}
            field="value"
            categoryField="category"
            colorField="color"
          />
        </ChartSeries>
      </Chart>
    </div>
  );
};

export default LanguageDistribution;