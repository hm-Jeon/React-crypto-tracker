import { memo } from "react";
import styled from "styled-components";
import { TickersData } from "./Coin";

interface PriceProps {
  priceData: TickersData;
}

interface PercentContentProps {
  isMinus: boolean;
}

const Container = styled.div`
  margin: 25px 0;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  margin-bottom: 10px;
  background-color: ${props => props.theme.coinBoxBgColor};
  border-radius: 10px;
`;
const ColumnTitle = styled.span`
  text-transform: uppercase;
  font-weight: 400;
`;

const PriceColumn = styled(Column)``;
const PriceTitle = styled(ColumnTitle)``;
const PriceContent = styled.span`
  &::before {
    content: "$ ";
  }
`;

const PercentGridItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  gap: 5px;
`;
const PercentGridItemTitle = styled(ColumnTitle)`
  font-size: 12px;
`;
const PercentGridItemContent = styled.span<PercentContentProps>`
  color: ${props => (props.isMinus ? "#0984e3" : "#d63031")};

  &::after {
    content: " %";
  }
`;
const PercentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 10px;
  gap: 10px;
  background-color: ${props => props.theme.coinBoxBgColor};
  border-radius: 10px;

  ${PercentGridItem}:first-child {
    grid-column: 1 / 3;

    ${PercentGridItemTitle} {
      font-size: 16px;
    }

    ${PercentGridItemContent} {
      font-size: 24px;
    }
  }
`;

function Price({ priceData }: PriceProps) {
  const data = priceData.quotes.USD;

  return (
    <Container>
      <PriceColumn>
        <PriceTitle>Current Price</PriceTitle>
        <PriceContent>
          {data.price.toLocaleString("us", {
            maximumFractionDigits: 3,
          })}
        </PriceContent>
      </PriceColumn>
      <PriceColumn>
        <PriceTitle>ATH Price</PriceTitle>
        <PriceContent>
          {data.ath_price.toLocaleString("us", {
            maximumFractionDigits: 3,
          })}
        </PriceContent>
      </PriceColumn>
      <PriceColumn>
        <PriceTitle>Market cap</PriceTitle>
        <PriceContent>
          {data.market_cap.toLocaleString("us", {
            maximumFractionDigits: 3,
          })}
        </PriceContent>
      </PriceColumn>
      <PercentGrid>
        <PercentGridItem>
          <PercentGridItemTitle>Last 24h</PercentGridItemTitle>
          <PercentGridItemContent isMinus={data.percent_change_24h < 0}>
            {data.percent_change_24h}
          </PercentGridItemContent>
        </PercentGridItem>
        <PercentGridItem>
          <PercentGridItemTitle>Last 15m</PercentGridItemTitle>
          <PercentGridItemContent isMinus={data.percent_change_15m < 0}>
            {data.percent_change_15m}
          </PercentGridItemContent>
        </PercentGridItem>
        <PercentGridItem>
          <PercentGridItemTitle>Last 30m</PercentGridItemTitle>
          <PercentGridItemContent isMinus={data.percent_change_30m < 0}>
            {data.percent_change_30m}
          </PercentGridItemContent>
        </PercentGridItem>
        <PercentGridItem>
          <PercentGridItemTitle>Last 1h</PercentGridItemTitle>
          <PercentGridItemContent isMinus={data.percent_change_1h < 0}>
            {data.percent_change_1h}
          </PercentGridItemContent>
        </PercentGridItem>
        <PercentGridItem>
          <PercentGridItemTitle>Last 12h</PercentGridItemTitle>
          <PercentGridItemContent isMinus={data.percent_change_12h < 0}>
            {data.percent_change_12h}
          </PercentGridItemContent>
        </PercentGridItem>
      </PercentGrid>
    </Container>
  );
}

export default memo(Price);
