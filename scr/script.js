// src/script.js

// 투표 버튼 클릭 시 실행되는 함수
function submitVote(voteOption) {
  fetch('/.netlify/functions/vote', {
    method: 'POST',
    body: JSON.stringify({ vote: voteOption })
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);  // 서버에서 받은 메시지 표시
  })
  .catch(error => console.error('Error:', error));
}

// 예시: 버튼에 클릭 이벤트를 연결
document.getElementById("voteOptionA").addEventListener("click", function() {
  submitVote('Option A');
});

document.getElementById("voteOptionB").addEventListener("click", function() {
  submitVote('Option B');
});
