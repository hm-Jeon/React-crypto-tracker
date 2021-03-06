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
  /* min-width: 480px; */
  max-width: 480px;
  padding: 0px 20px;
  margin: 0 auto;
`;

const Header = styled.header`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
`;

const BtnContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0 0.5rem;
`;

const BackBtn = styled(Link)`
  padding: 0.3em;
  border: 0;
  border-radius: 0.3em;
  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.coinBoxBgColor};
  font-family: inherit;
  cursor: pointer;
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
  background-color: ${props => props.theme.coinBoxBgColor};
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
    background-color: ${props => props.theme.coinBoxBgColor};
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
  // react-router-dom v6?????? ????????? useParams() ?????????;
  const { coinId } = useParams<keyof RouteParams>();
  const { state } = useLocation() as RouteState;
  // react-router-dom v6?????? useRouteMatch()??? useMatch()??? ?????????.
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart/*");

  // ????????? ?????? ????????? ???????????? ????????? ???????????? ????????? ??? ??????.(????????? ?????????: ????????? ?????????)
  // react-query??? query key??? ?????? ????????????.
  // fetcher ????????? arguments??? ??????????????? ????????? ????????????(????????? ??????)??? ????????????
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId!],
    () => fetchCoinInfo(coinId!)
  );

  // useQuery Hook??? ????????? ????????? ????????? ????????? ??? ??????.
  // ??? ?????? ??? refetchInterval??? fetcher ????????? ms ????????? ?????? ???????????? ??????.(setInterval??? ??????)
  const { isLoading: tickersLoading, data: tickersData } =
    useQuery<TickersData>(
      ["tickers", coinId!],
      () => fetchCoinTickers(coinId!),
      {
        refetchInterval: 5000,
      }
    );

  // infoLoading??? tickersLoading??? ?????? false??? ?????? loading??? false??? ??????.
  const loading = infoLoading || tickersLoading;

  return (
    <Container>
      {/* 
          react-helmet?????? HTML??? <head></head>??? ????????? ??? ??????.(head??? ?????? Direct Link)
          react-helmet-async ??????.
          index.tsx??? <App/>??? <helmetProvider></helmetProvider>??? ????????? ???.
      */}
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <BtnContainer>
          <BackBtn to={"/"}>Back</BackBtn>
        </BtnContainer>
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
              <span>{`$ ${tickersData?.quotes.USD.price.toLocaleString("us", {
                maximumFractionDigits: 3,
              })}`}</span>
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
