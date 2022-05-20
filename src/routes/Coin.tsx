import { Fragment } from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import Chart from "./Chart";
import Price from "./Price";

const Container = styled.div`
  max-width: 480px;
  padding: 0px 20px;
  margin: 0 auto;
`;

const Header = styled.header`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;

  a {
    position: absolute;
    left: 10px;
    top: 10px;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: ${props => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.accentColor};
  font-size: 48px;
`;

const Loader = styled.div`
  font-size: 20px;
  text-align: center;
`;

const Overview = styled.div<OverviewProps>`
  /* display: flex;
  justify-content: space-between; */
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, auto);
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0;
  line-height: 1.2em;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0;
  gap: 10px;
`;

const Tab = styled.span<TabProps>`
  text-align: center;
  text-transform: uppercase;

  a {
    display: block;
    padding: 7px 0;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    color: ${props =>
      props.isActive ? props.theme.accentColor : props.theme.textColor};
    font-size: 14px;
    font-weight: 400;
  }
`;

interface RouteParams {
  coinId: string;
}

interface RouteState {
  state: {
    name: string;
  };
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

export interface TickersData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_15m: number;
      percent_change_30m: number;
      percent_change_1h: number;
      percent_change_6h: number;
      percent_change_12h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_1y: number;
      ath_price: number;
      ath_date: string;
      percent_from_price_ath: number;
    };
  };
}

interface OverviewProps {
  columns: number;
}

interface TabProps {
  isActive: Boolean;
}

function Coin() {
  // react-router-dom v6부터 변경된 useParams() 작성법;
  const { coinId } = useParams<keyof RouteParams>();
  const { state } = useLocation() as RouteState;
  // react-router-dom v6부터 useRouteMatch()는 useMatch()로 변경됨.
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart/*");

  // 아래와 같이 지정된 변수명을 임의로 변경하여 사용할 수 있다.(지정된 변수명: 사용할 변수명)
  // react-query의 query key는 배열 형태이다.
  // fetcher 함수에 arguments를 넘겨주어야 한다면 익명함수(화살표 함수)를 이용한다
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId!],
    () => fetchCoinInfo(coinId!)
  );

  // useQuery Hook의 세번째 인자로 옵션을 지정할 수 있다.
  // 이 옵션 중 refetchInterval은 fetcher 함수를 ms 단위로 반복 실행하게 한다.(setInterval과 유사)
  const { isLoading: tickersLoading, data: tickersData } =
    useQuery<TickersData>(
      ["tickers", coinId!],
      () => fetchCoinTickers(coinId!),
      {
        refetchInterval: 5000,
      }
    );

  // infoLoading과 tickersLoading이 모두 false가 되면 loading도 false가 된다.
  const loading = infoLoading || tickersLoading;

  return (
    <Container>
      {/* 
          react-helmet으로 HTML의 <head></head>에 접근할 수 있다.(head로 가는 Direct Link)
          react-helmet-async 사용.
          index.tsx의 <App/>을 <helmetProvider></helmetProvider>로 감싸야 함.
      */}
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Link to="/">{"< Back"}</Link>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Fragment>
          <Overview columns={3}>
            <OverviewItem>
              <span>rank</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>symbol</span>
              <span>{infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price</span>
              <span>{`$ ${tickersData?.quotes.USD.price.toFixed(3)}`}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview columns={2}>
            <OverviewItem>
              <span>total supply</span>
              <span>{tickersData?.total_supply.toLocaleString("us")}</span>
            </OverviewItem>
            <OverviewItem>
              <span>max supply</span>
              <span>{tickersData?.max_supply.toLocaleString("us")}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab isActive={!!chartMatch}>
              <Link to="chart/candlestick">Chart</Link>
            </Tab>
            <Tab isActive={!!priceMatch}>
              <Link to="price">Price</Link>
            </Tab>
          </Tabs>
          <Routes>
            <Route
              path="chart/*"
              element={<Chart coinId={coinId!} coinName={infoData?.name!} />}
            />
            <Route path="price" element={<Price priceData={tickersData!} />} />
          </Routes>
        </Fragment>
      )}
    </Container>
  );
}

export default Coin;
