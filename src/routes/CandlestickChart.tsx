import ApexChart from "react-apexcharts";
import { IOhlc } from "./Chart";

interface CandlestickChartProps {
  data: IOhlc[];
}

export function CandlestickChart({ data }: CandlestickChartProps) {
  return (
    <ApexChart
      type="candlestick"
      series={
        [
          {
            data: data?.map(day => ({
              x: day.time_open,
              y: [
                day.open.toFixed(3),
                day.high.toFixed(3),
                day.low.toFixed(3),
                day.close.toFixed(3),
              ],
            })),
          },
        ] as any
      }
      options={{
        chart: {
          height: "auto",
          width: "100%",
          fontFamily: `'Source Sans Pro', sans-serif`,
          background: "transperent",
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: "#d63031",
              downward: "#0984e3",
            },
          },
        },
        theme: {
          mode: "dark",
        },
        grid: {
          show: false,
        },
        yaxis: {
          show: false,
        },
        xaxis: {
          type: "datetime",
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            width: 1,
            opacity: 0,
            stroke: {
              width: 2,
              dashArray: 5,
            },
          },
        },
        tooltip: {
          y: {
            formatter: val => {
              return `$ ${val.toFixed(3)}`;
            },
          },
          style: {
            fontSize: "14px",
          },
        },
      }}
    />
  );
}
