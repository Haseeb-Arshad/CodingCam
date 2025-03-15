
import { useMemo } from "react";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartTitle,
  ChartLegend,
} from "@progress/kendo-react-charts";
import { DailyHours } from "@/lib/mockData";
import "hammerjs";

interface TimeTrackingChartProps {
  dailyHours: DailyHours[];
}

const TimeTrackingChart = ({ dailyHours }: TimeTrackingChartProps) => {
  const chartData = useMemo(() => {
    return dailyHours.map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      hours: day.hours,
    }));
  }, [dailyHours]);

  return (
    <div className="kendo-chart-wrapper">
      <Chart>
        <ChartTitle text="Daily Coding Hours" />
        <ChartLegend position="bottom" />
        <ChartValueAxis>
          <ChartValueAxisItem title={{ text: "Hours" }} min={0} />
        </ChartValueAxis>
        <ChartCategoryAxis>
          <ChartCategoryAxisItem 
            categories={chartData.map(day => day.date)} 
            title={{ text: "Date" }} 
          />
        </ChartCategoryAxis>
        <ChartSeries>
          <ChartSeriesItem
            type="column"
            data={chartData.map(day => day.hours)}
            name="Coding Hours"
            color="#0DB4F9"
          />
        </ChartSeries>
      </Chart>
    </div>
  );
};

export default TimeTrackingChart;
