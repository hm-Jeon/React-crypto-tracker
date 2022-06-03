import { Fragment, memo, useState } from "react";
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

interface ITerm {
  text: string;
  value: number;
}

const Loader = styled.h1`
  text-align: center;
`;

const Tab = styled.span<TabProps>`
  text-align: center;
  text-transform: uppercase;
  color: ${props =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  font-size: 14px;

  a {
    display: block;
    padding: 7px 0;
    background-color: ${props => props.theme.coinBoxBgColor};
    font-weight: 400;
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
  background-color: ${props => props.theme.coinBoxBgColor};
  border-radius: 0 0 10px 10px;
`;

const TermTabs = styled(Tabs)<{ columns: number }>`
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  margin: 0;
`;

const TermTab = styled(Tab)`
  padding: 7px 0;
  cursor: pointer;
`;

/* const termArray: [ITerm, ITerm, ITerm, ITerm] = [
  {
    text: "1w",
    value: -7,
  },
  {
    text: "2w",
    value: -14,
  },
  {
    text: "1m",
    value: -31,
  },
  {
    text: "1y",
    value: -365,
  },
]; */

function Chart({ coinId, coinName }: { coinId: string; coinName: string }) {
  const { isLoading, data } = useQuery<IOhlc[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );

  console.log(data);

  // 차트 기간 state
  const [term, setTerm] = useState(-7);

  const TermTabOnClick = (term: number): void => {
    setTerm(term);
  };

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
            {/* <TermTabs columns={termArray.length}>
              {termArray.map(item => (
                <TermTab
                  key={item.text}
                  isActive={term === item.value}
                  onClick={() => TermTabOnClick(item.value)}
                >
                  {item.text}
                </TermTab>
              ))}
            </TermTabs> */}
            <Routes>
              <Route
                path="candlestick"
                element={<CandlestickChart data={data!.slice(term)} />}
              />
              <Route
                path="line"
                element={
                  <LineChart coinName={coinName} data={data!.slice(term)} />
                }
              />
            </Routes>
          </Container>
        </Fragment>
      )}
    </Fragment>
  );
}

export default memo(Chart);
