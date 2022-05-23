import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
import { IOhlc } from "./Chart";

interface LineChartProps {
  coinName: string;
  data: IOhlc[];
}

export function LineChart({ coinName, data }: LineChartProps) {
  const isDark = useRecoilValue(isDarkAtom);

  return (
    <ApexChart
      type="line"
      series={
        [
          {
            name: `Price of ${coinName}`,
            data: data!.map(price => ({
              x: price.time_open,
              y: price.close,
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
        theme: {
          mode: isDark ? "dark" : "light",
        },
        colors: ["#0984e3"],
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            gradientToColors: ["#4cd137"],
            stops: [5, 95],
          },
        },
        stroke: {
          curve: "smooth",
          width: 3,
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
          tooltip: {
            enabled: false,
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
