import { Fragment, memo } from "react";
import { useQuery } from "react-query";
import { Route, Routes, useMatch } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinHistory } from "../api";
import { CandlestickChart } from "./CandlestickChart";
import { LineChart } from "./LineChart";

interface TabProps {
  isActive: boolean;
}

export interface IOhlc {
  close: number;
  high: number;
  low: number;
  market_cap: number;
  open: number;
  time_close: string;
  time_open: string;
  volume: number;
}

const Loader = styled.h1`
  text-align: center;
`;

const Tab = styled.span<TabProps>`
  text-align: center;
  text-transform: uppercase;

  a {
    display: block;
    padding: 7px 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: ${props =>
      props.isActive ? props.theme.accentColor : props.theme.textColor};
    font-size: 14px;
    font-weight: 400;
    /* font-weight: ${props => (props.isActive ? 600 : 400)}; */
  }
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0 0;

  ${Tab}:first-child {
    a {
      border-radius: 10px 0 0 0;
    }
  }

  ${Tab}:last-child {
    a {
      border-radius: 0 10px 0 0;
    }
  }
`;

const Container = styled.div`
  margin-bottom: 25px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0 0 10px 10px;
`;

function Chart({ coinId, coinName }: { coinId: string; coinName: string }) {
  const { isLoading, data } = useQuery<IOhlc[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );

  const matchCandlestick = useMatch("/:coinId/chart/candlestick");
  const matchLine = useMatch("/:coinId/chart/line");

  return (
    <Fragment>
      {isLoading ? (
        <Loader>Loading Chart...</Loader>
      ) : (
        <Fragment>
          <Tabs>
            <Tab isActive={!!matchCandlestick}>
              <Link to="candlestick">Candlestick</Link>
            </Tab>
            <Tab isActive={!!matchLine}>
              <Link to="line">Line</Link>
            </Tab>
          </Tabs>
          <Container>
            <Routes>
              <Route
                path="candlestick"
                element={<CandlestickChart data={data!} />}
              />
              <Route
                path="line"
                element={<LineChart coinName={coinName} data={data!} />}
              />
            </Routes>
          </Container>
        </Fragment>
      )}
    </Fragment>
  );
}

export default memo(Chart);
