## 👨‍👩‍👧‍👧 react-slack-typescript
 ### 🔸 [SWR](https://swr.vercel.app) : 데이터 가져오기를 위한 React Hooks
 ```javascript
 const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
 ```
  * 비동기 함수인 fetcher에 데이터를 요청하는 API가 매개변수로 전달되어 get 요청 이루어지고, 응답 받은 데이터는 data에 저장
  * 주기적으로 호출되어 데이터를 가장 최신으로 유지
  * 데이터가 존재하지 않으면 로딩중으로 처리 가능
  * mutate 함수를 통해 다른 요청 성공시 응답 받은 데이터를 바로 data에 저장 가능
    
 
