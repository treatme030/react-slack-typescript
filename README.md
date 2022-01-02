## 👨‍👩‍👧‍👧 react-slack-typescript
 * [SWR](https://swr.vercel.app) 사용해서 데이터 가져오기
 ```javascript
 const { data, error } = useSWR('http://localhost:3095/api/users', fetcher);
 ```
 => fetcher 함수에 데이터를 요청하는 API가 매개변수로 전달되어, 응답 받은 데이터는 data에 저장
