import { Helmet } from "react-helmet-async";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { isDarkAtom } from "../atoms";

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
  justify-content: flex-end;
  width: 100%;
  padding: 0 0.5rem;
`;

const DarkModeBtn = styled.button`
  padding: 0.3em;
  border: 0;
  border-radius: 0.3em;
  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.coinBoxBgColor};
  font-family: inherit;
  font-size: inherit;
  font-weight: 600;
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

const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: ${props => props.theme.coinsCardBgColor};
  color: ${props => props.theme.textColor};
  margin-bottom: 10px;
  border-radius: 15px;

  a {
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 15px;
    transition: color 0.2s ease-in-out;
  }

  &:hover {
    a {
      color: ${props => props.theme.accentColor};
    }
  }
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  // react-query를 사용하면 위 과정을 코드 한줄로 구현할 수 있다.
  // useQuery Hook은 isLoading(로딩 여부)와 data(데이터) 등을 return한다.
  // react-query는 fetch한 data를 캐시에 저장해둔다. 한번 불러온 데이터를 다시 불러오지 않는다.
  // react-query는 고유한 query key값이 필요하다.
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);
  const isDark = useRecoilValue(isDarkAtom);
  const setIsDark = useSetRecoilState(isDarkAtom);
  const toggleIsDark = () => setIsDark(current => !current);

  return (
    <Container>
      <Helmet>
        <title>Coins</title>
      </Helmet>
      <Header>
        <BtnContainer>
          <DarkModeBtn onClick={toggleIsDark}>
            {isDark ? "Light Mode" : "Dark Mode"}
          </DarkModeBtn>
        </BtnContainer>
        <Title>Coins</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.map(coin => (
            <Coin key={coin.id}>
              <Link to={`/${coin.id}`} state={{ name: coin.name }}>
                <Img
                  src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                  alt={coin.symbol}
                />
                {coin.name}
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
