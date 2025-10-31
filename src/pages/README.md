# Weather App Pages

Toss Design System (TDS)을 사용한 날씨 앱 화면 구성

## 📁 파일 구조

```
src/pages/
├── index.ts                    # Export 집합
├── WeatherPage.tsx             # 위치 입력 화면
├── WeatherDetailPage.tsx       # 날씨 상세 화면
└── README.md                   # 이 파일
```

## 🎨 화면 구성

### 1. WeatherPage (위치 입력 화면)

날씨 정보를 확인할 위치를 입력하는 화면입니다.

**주요 컴포넌트:**
- `Top`: 헤더 영역 (뒤로가기, 제목, 더보기/닫기 버튼)
- `TextField.Clearable`: 주소 입력 필드 (clear 버튼 포함)
- `Asset.Image`: 날씨 아이콘
- `FixedBottomCTA.Single`: 하단 고정 확인 버튼

**주요 기능:**
- 주소 검색 (건물, 지번, 도로명)
- 상세 주소 입력
- 입력된 주소로 날씨 조회

**State:**
```typescript
const [address, setAddress] = useState('서울특별시 강남구 테헤란로 142');
const [detailAddress, setDetailAddress] = useState('');
```

### 2. WeatherDetailPage (날씨 상세 화면)

선택한 위치의 날씨 정보를 표시하는 화면입니다.

**주요 컴포넌트:**
- `Top`: 헤더 영역
- `Text`: 위치, 온도, 날씨 상태 표시
- `Card`: 습도, 풍속 등 상세 정보 표시
- `Asset.Image`: 날씨 아이콘
- `Asset.Icon`: 습도, 풍속 아이콘

**표시 정보:**
- 위치 정보
- 현재 온도 (°C)
- 날씨 상태 (맑음, 흐림 등)
- 습도 (%)
- 풍속 (m/s)

**Data Interface:**
```typescript
interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  iconUrl: string;
}
```

## 🎯 TDS 컴포넌트 사용법

### Top (헤더)

```tsx
<Top
  left={<IconButton>...</IconButton>}
  title={<Top.TitleParagraph>...</Top.TitleParagraph>}
  right={<IconButton>...</IconButton>}
/>
```

### TextField.Clearable (입력 필드)

```tsx
<TextField.Clearable
  variant="box"
  hasError={false}
  label="위치"
  labelOption="sustain"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="건물, 지번 또는 도로명 검색"
/>
```

### Asset.Icon (아이콘)

```tsx
<Asset.Icon
  frameShape={Asset.frameShape.CleanW24}
  name="icon-arrow-back-ios-mono"
  color="#191F28ff"
/>
```

### FixedBottomCTA (하단 고정 버튼)

```tsx
<FixedBottomCTA.Single
  disabled={!address}
  onClick={handleClick}
>
  확인
</FixedBottomCTA.Single>
```

## 🚀 사용 방법

### 기본 사용

```tsx
import { WeatherPage, WeatherDetailPage } from './pages';

function App() {
  const [view, setView] = useState<'search' | 'detail'>('search');

  return (
    <div>
      {view === 'search' ? (
        <WeatherPage />
      ) : (
        <WeatherDetailPage />
      )}
    </div>
  );
}
```

### 화면 전환

```tsx
// WeatherPage에서 확인 버튼 클릭 시
<FixedBottomCTA.Single
  onClick={() => {
    // 날씨 API 호출
    fetchWeatherData(address);
    // 상세 화면으로 전환
    setView('detail');
  }}
>
  확인
</FixedBottomCTA.Single>
```

## 🎨 스타일링

### 색상 (adaptive colors)

```tsx
import { adaptive } from '@tds/colors';

<Text color={adaptive.grey900}>텍스트</Text>
<Text color={adaptive.blue500}>강조 텍스트</Text>
```

### 타이포그래피

```tsx
<Text typography="h2" fontWeight="bold">큰 제목</Text>
<Text typography="body1">본문</Text>
<Text typography="body2">작은 본문</Text>
```

### 간격 (Spacing)

```tsx
<Spacing size={8} />   {/* 8px */}
<Spacing size={16} />  {/* 16px */}
<Spacing size={24} />  {/* 24px */}
<Spacing size={32} />  {/* 32px */}
```

## 📝 TODO

### WeatherPage
- [ ] 주소 검색 API 연동
- [ ] 자동완성 기능 추가
- [ ] 현재 위치 가져오기 버튼
- [ ] 최근 검색 기록 표시

### WeatherDetailPage
- [ ] 실제 날씨 API 연동
- [ ] 시간대별 날씨 그래프
- [ ] 주간 날씨 예보
- [ ] 새로고침 기능
- [ ] 공유 기능

## 🔗 참고 자료

- [Toss Design System](https://tds.toss.im/)
- [TDS Mobile Components](https://tds.toss.im/mobile)
- [Weather API](https://openweathermap.org/api)
