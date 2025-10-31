import {
  Asset,
  Top,
  Text,
} from '@toss/tds-mobile';

import { adaptive } from '@toss/tds-colors';
import { useState } from 'react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  iconUrl: string;
}

export default function WeatherDetailPage() {
  const [weatherData] = useState<WeatherData>({
    location: '서울특별시 강남구',
    temperature: 23,
    condition: '맑음',
    humidity: 65,
    windSpeed: 3.2,
    iconUrl: 'https://static.toss.im/appsintoss/4309/f88ae948-3df0-42c4-b808-2e501c490f07.png',
  });

  return (
    <>
      {/* 헤더 */}
      <Top
        /*left={
          <IconButton aria-label="뒤로가기">
            <Asset.Icon
              frameShape={Asset.frameShape.CleanW24}
              name="icon-arrow-back-ios-mono"
              color="#191F28ff"
            />
          </IconButton>
        }*/
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            오늘의 날씨
          </Top.TitleParagraph>
        }
        right={
          <></>
        }
      />

      {/*<Spacing size={32} />*/}

      {/* 위치 정보 */}
      <div style={{ padding: '0 20px', textAlign: 'center' }}>
        <Text color={adaptive.grey700}>
          {weatherData.location}
        </Text>
        {/*<Spacing size={8} />*/}
        <Text color="#191F28ff" fontWeight="bold">
          {weatherData.temperature}°C
        </Text>
        {/*<Spacing size={4} />*/}
        <Text color={adaptive.grey600}>
          {weatherData.condition}
        </Text>
      </div>

      {/*<Spacing size={24} />*/}

      {/* 날씨 아이콘 */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Asset.Image
          frameShape={Asset.frameShape.CleanW16}
          src={weatherData.iconUrl}
          aria-hidden={true}
          style={{ width: 120, height: 120 }}
        />
      </div>

      {/*<Spacing size={32} />*/}

      {/* 상세 정보 카드 */}
      <div style={{ padding: '0 20px' }}>
        {/*<Card>*/}
          <div style={{ padding: 20 }}>
            {/* 습도 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Asset.Icon
                  frameShape={Asset.frameShape.CleanW20}
                  name="icon-water-mono"
                  color={adaptive.blue500}
                />
                <Text color={adaptive.grey700}>
                  습도
                </Text>
              </div>
              <Text color="#191F28ff" fontWeight="semibold">
                {weatherData.humidity}%
              </Text>
            </div>

            {/* 풍속 */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Asset.Icon
                  frameShape={Asset.frameShape.CleanW20}
                  name="icon-wind-mono"
                  color={adaptive.blue500}
                />
                <Text color={adaptive.grey700} >
                  풍속
                </Text>
              </div>
              <Text color="#191F28ff" fontWeight="semibold">
                {weatherData.windSpeed} m/s
              </Text>
            </div>
          </div>
        {/*</Card>*/}
      </div>

      {/*<Spacing size={24} />*/}

      {/* 시간대별 날씨 (추후 추가 예정) */}
      <div style={{ padding: '0 20px' }}>
        <Text color="#191F28ff" typography="t6" fontWeight="semibold">
          시간대별 날씨
        </Text>
        {/*<Spacing size={12} />*/}
        {/*<Card>*/}
          <div style={{ padding: 20, textAlign: 'center' }}>
            <Text color={adaptive.grey500}>
              시간대별 날씨 정보를 준비 중입니다.
            </Text>
          </div>
        {/*</Card>*/}
      </div>

      {/*<Spacing size={32} />*/}
    </>
  );
}
