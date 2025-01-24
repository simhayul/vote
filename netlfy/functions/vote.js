// netlify/functions/vote.js

exports.handler = async function(event, context) {
  const body = JSON.parse(event.body);  // 클라이언트에서 보내는 투표 데이터 받기
  
  // 여기서 데이터베이스에 연결하여 투표 저장 등의 동작을 구현할 수 있습니다.
  console.log("Vote data received:", body);

  // 예시: 투표 데이터를 DB에 저장하는 부분
  // const result = await saveVoteToDatabase(body.vote);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Vote processed successfully!" })
  };
};
