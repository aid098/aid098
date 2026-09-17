/* ===============================================================
   공통 유틸 함수
   =============================================================== */

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")} (${days[d.getDay()]})`;
}

function sortedMatches() {
  return [...CLUB_DATA.matches].sort((a, b) => (a.date < b.date ? -1 : 1));
}

function latestMatch() {
  const ms = sortedMatches();
  return ms.length ? ms[ms.length - 1] : null;
}

function memberById(id) {
  return CLUB_DATA.members.find((m) => m.id === id);
}

// 회원별 통계(참여 횟수, 총 골, 참여한 경기 기록) 계산
function buildStats() {
  const stats = {};
  CLUB_DATA.members.forEach((m) => {
    stats[m.id] = {
      id: m.id,
      name: m.name,
      matchesPlayed: 0,
      totalGoals: 0,
      records: [] // { date, location, goals }
    };
  });

  sortedMatches().forEach((match) => {
    match.attendees.forEach((a) => {
      if (!a.id) return; // 용병(guest)은 개인 집계 대상이 아님
      if (!stats[a.id]) return; // data.js에 없는 id는 무시
      stats[a.id].matchesPlayed += 1;
      stats[a.id].totalGoals += a.goals || 0;
      stats[a.id].records.push({
        date: match.date,
        location: match.location,
        goals: a.goals || 0
      });
    });
  });

  return stats;
}

function guestBadge(label) {
  return `<span class="badge badge-guest">${label}</span>`;
}

/* 현재 페이지에 맞는 nav 링크 활성화 표시 */
function markActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((a) => {
    if (a.dataset.nav === page) a.classList.add("nav-active");
  });
}

/* ===============================================================
   페이지별 렌더링
   =============================================================== */

function renderHome() {
  document.getElementById("club-name").textContent = CLUB_DATA.clubName;

  const match = latestMatch();
  const box = document.getElementById("home-content");

  if (!match) {
    box.innerHTML = `<p class="empty">아직 등록된 경기 기록이 없습니다.</p>`;
    return;
  }

  const stats = buildStats();
  const attendeesSorted = [...match.attendees].sort(
    (a, b) => (b.goals || 0) - (a.goals || 0)
  );
  const totalGoals = match.attendees.reduce((s, a) => s + (a.goals || 0), 0);

  box.innerHTML = `
    <section class="hero">
      <p class="hero-eyebrow">최신 경기</p>
      <h1 class="hero-date">${formatDate(match.date)}</h1>
      <p class="hero-location">${match.location}</p>
      <div class="hero-stats">
        <div class="hero-stat"><span class="num">${match.attendees.length}</span><span class="label">참여 인원</span></div>
        <div class="hero-stat"><span class="num">${totalGoals}</span><span class="label">총 골</span></div>
      </div>
    </section>

    <h2 class="section-title">참여 선수</h2>
    <ul class="player-grid">
      ${attendeesSorted
        .map((a) => {
          if (a.guest) {
            return `
            <li class="player-card player-card-guest">
              <div class="player-card-top">
                <span class="player-name">${a.guest}</span>
                ${guestBadge("게스트")}
              </div>
              <div class="player-card-bottom">
                <span class="goal-count">${a.goals || 0}<span class="goal-unit">골</span></span>
              </div>
            </li>`;
          }
          const m = memberById(a.id);
          if (!m) return "";
          const s = stats[a.id];
          return `
          <li class="player-card">
            <a href="player.html?id=${m.id}">
              <div class="player-card-top">
                <span class="player-name">${m.name}</span>
              </div>
              <div class="player-card-bottom">
                <span class="goal-count">${a.goals || 0}<span class="goal-unit">골</span></span>
                <span class="career">통산 ${s.matchesPlayed}경기 · ${s.totalGoals}골</span>
              </div>
            </a>
          </li>`;
        })
        .join("")}
    </ul>
  `;
}

function renderMembers() {
  const stats = buildStats();
  const tbody = document.getElementById("members-body");

  const rows = CLUB_DATA.members
    .map((m) => stats[m.id])
    .sort((a, b) => b.matchesPlayed - a.matchesPlayed || a.name.localeCompare(b.name));

  if (!rows.length) {
    document.getElementById("members-empty").hidden = false;
    return;
  }

  tbody.innerHTML = rows
    .map(
      (s) => `
      <tr>
        <td><a class="table-link" href="player.html?id=${s.id}">${s.name}</a></td>
        <td class="num-cell">${s.matchesPlayed}</td>
        <td class="num-cell">${s.totalGoals}</td>
      </tr>`
    )
    .join("");
}

function renderRankings() {
  const stats = Object.values(buildStats()).filter((s) => s.matchesPlayed > 0);

  const goalRanking = [...stats].sort(
    (a, b) => b.totalGoals - a.totalGoals || a.name.localeCompare(b.name)
  );
  const matchRanking = [...stats].sort(
    (a, b) => b.matchesPlayed - a.matchesPlayed || a.name.localeCompare(b.name)
  );

  const rankList = (list, valueKey, unit) => {
    if (!list.length) return `<p class="empty">기록이 없습니다.</p>`;
    return `
      <ol class="rank-list">
        ${list
          .map(
            (s, i) => `
          <li class="rank-row ${i === 0 ? "rank-first" : ""}">
            <span class="rank-num">${i + 1}</span>
            <a class="rank-name" href="player.html?id=${s.id}">${s.name}</a>
            <span class="rank-value">${s[valueKey]}<span class="rank-unit">${unit}</span></span>
          </li>`
          )
          .join("")}
      </ol>`;
  };

  document.getElementById("goal-ranking").innerHTML = rankList(
    goalRanking,
    "totalGoals",
    "골"
  );
  document.getElementById("match-ranking").innerHTML = rankList(
    matchRanking,
    "matchesPlayed",
    "경기"
  );
}

function renderHistory() {
  const matches = sortedMatches().reverse();
  const box = document.getElementById("history-list");

  if (!matches.length) {
    box.innerHTML = `<p class="empty">아직 등록된 경기 기록이 없습니다.</p>`;
    return;
  }

  box.innerHTML = matches
    .map((match, idx) => {
      const totalGoals = match.attendees.reduce((s, a) => s + (a.goals || 0), 0);
      const sorted = [...match.attendees].sort((a, b) => (b.goals || 0) - (a.goals || 0));
      return `
      <details class="match-item" ${idx === 0 ? "open" : ""}>
        <summary>
          <span class="match-date">${formatDate(match.date)}</span>
          <span class="match-location">${match.location}</span>
          <span class="match-meta">${match.attendees.length}명 참여 · ${totalGoals}골</span>
        </summary>
        <ul class="match-attendee-list">
          ${sorted
            .map((a) => {
              if (a.guest) {
                return `
                <li>
                  <span>${a.guest}</span>
                  ${guestBadge("게스트")}
                  <span class="attendee-goals">${a.goals || 0}골</span>
                </li>`;
              }
              const m = memberById(a.id);
              if (!m) return "";
              return `
              <li>
                <a href="player.html?id=${m.id}">${m.name}</a>
                <span class="attendee-goals">${a.goals || 0}골</span>
              </li>`;
            })
            .join("")}
        </ul>
      </details>`;
    })
    .join("");
}

function renderPlayer() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const stats = buildStats();
  const s = stats[id];
  const box = document.getElementById("player-content");

  if (!s) {
    box.innerHTML = `<p class="empty">선수 정보를 찾을 수 없습니다. <a href="members.html">전체 회원 목록으로 이동</a></p>`;
    return;
  }

  const records = [...s.records].sort((a, b) => (a.date < b.date ? 1 : -1));

  box.innerHTML = `
    <section class="player-header">
      <p class="hero-eyebrow">개인 기록</p>
      <h1 class="player-title">${s.name}</h1>
      <div class="hero-stats">
        <div class="hero-stat"><span class="num">${s.matchesPlayed}</span><span class="label">참여 경기</span></div>
        <div class="hero-stat"><span class="num">${s.totalGoals}</span><span class="label">통산 골</span></div>
      </div>
    </section>

    <h2 class="section-title">경기 기록</h2>
    ${
      records.length
        ? `<table class="data-table">
            <thead>
              <tr><th>날짜</th><th>장소</th><th class="num-cell">골</th></tr>
            </thead>
            <tbody>
              ${records
                .map(
                  (r) => `
                <tr>
                  <td>${formatDate(r.date)}</td>
                  <td>${r.location}</td>
                  <td class="num-cell">${r.goals}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>`
        : `<p class="empty">아직 참여한 경기가 없습니다.</p>`
    }
  `;
}

document.addEventListener("DOMContentLoaded", markActiveNav);