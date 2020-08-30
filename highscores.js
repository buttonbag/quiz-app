const highScoresList = document.getElementById('highScoresList');
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScores.map( storedObj => {
    return `<li class="high-score"><span class="name">${storedObj.name}</span> - <span class="score">${storedObj.score}</span> pts</li>`;
}).join("");