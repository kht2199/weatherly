import {
  Asset,
  TextField,
  Top,
  FixedBottomCTA,
  Text,
  IconButton,
} from '@toss/tds-mobile';
import { adaptive } from '@toss/tds-colors';
import { useState } from 'react';

export default function WeatherPage() {
  const [address, setAddress] = useState('서울특별시 강남구 테헤란로 142');
  const [detailAddress, setDetailAddress] = useState('');

  return (
    <>
      {/* 헤더 영역 */}
      <IconButton aria-label="뒤로가기" src={''}>
        <Asset.Icon
          frameShape={Asset.frameShape.CleanW24}
          name="icon-arrow-back-ios-mono"
          color="#191F28ff"
        />
      </IconButton>
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            오늘의 날씨
          </Top.TitleParagraph>
        }
        right={
          <>
            <IconButton aria-label="더보기" src={''}>
              <Asset.Icon
                frameShape={Asset.frameShape.CleanW20}
                name="icon-dots-mono"
                color="rgba(0, 19, 43, 0.58)"
              />
            </IconButton>
            <IconButton aria-label="닫기" src={''}>
              <Asset.Icon
                frameShape={Asset.frameShape.CleanW20}
                name="icon-x-mono"
                color="rgba(0, 19, 43, 0.58)"
              />
            </IconButton>
          </>
        }
      />

      {/*<Spacing size={24} />*/}

      {/* 날씨 아이콘 */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Asset.Image
          frameShape={Asset.frameShape.CleanW16}
          src="https://static.toss.im/appsintoss/4309/f88ae948-3df0-42c4-b808-2e501c490f07.png"
          aria-hidden={true}
        />
      </div>

      {/*<Spacing size={32} />*/}

      {/* 위치 입력 섹션 */}
      <div style={{ padding: '0 20px' }}>
        <Text color="#191F28ff" typography="t6" fontWeight="semibold">
          위치 설정
        </Text>

        {/*<Spacing size={16} />*/}

        {/* 주소 검색 필드 */}
        <TextField.Clearable
          variant="box"
          hasError={false}
          label="위치"
          labelOption="sustain"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="건물, 지번 또는 도로명 검색"
        />

        {/*<Spacing size={12} />*/}

        {/* 상세 주소 입력 */}
        <TextField.Clearable
          variant="box"
          hasError={false}
          label=""
          labelOption="sustain"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          placeholder="상세주소 (예시: 토스빌딩 7층 / A동 201호)"
        />
      </div>

      {/*<Spacing size={24} />*/}

      {/* 날씨 정보 표시 영역 (추후 추가) */}
      <div style={{ padding: '0 20px' }}>
        <Text color={adaptive.grey700}>
          위치를 입력하면 해당 지역의 날씨 정보를 확인할 수 있습니다.
        </Text>
      </div>

      {/* 하단 확인 버튼 */}
      <FixedBottomCTA
        disabled={!address}
        /*onClick={() => {
          console.log('날씨 조회:', { address, detailAddress });
          // 날씨 API 호출 로직 추가
        }}*/
      >
        확인
      </FixedBottomCTA>
    </>
  );
}
