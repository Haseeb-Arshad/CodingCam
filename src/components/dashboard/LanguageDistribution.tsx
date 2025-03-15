
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartLegend,
  ChartTitle,
} from "@progress/kendo-react-charts";
import { LanguageStat } from "@/lib/mockData";
import "hammerjs";

interface LanguageDistributionProps {
  languages: LanguageStat[];
}

const LanguageDistribution = ({ languages }: LanguageDistributionProps) => {
  return (
    <div className="kendo-chart-wrapper">
      <Chart>
        <ChartTitle text="Languages" />
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
