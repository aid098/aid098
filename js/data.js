/*
  ===============================================================
   축구 동호회 데이터 파일
  ===============================================================
  이 파일만 수정하면 사이트 전체 내용이 업데이트됩니다.
  (members.html, rankings.html, history.html, player.html, index.html
   모두 이 파일의 데이터를 읽어서 자동으로 계산/표시합니다.)

  ------------------------------
  1) members: 전체 회원 명단 (고정으로 오는 사람만)
  ------------------------------
  - id      : 영문/숫자로 만든 고유 값 (한 번 정하면 되도록 바꾸지 마세요.
              matches의 attendees에서 이 id로 연결됩니다)
  - name    : 화면에 보여줄 이름

  새 회원이 들어오면 아래 배열 맨 아래에 한 줄 추가하면 됩니다.
  가끔 오는 사람(용병)은 여기 등록하지 않습니다. 아래 matches에서 바로 입력하세요.

  ------------------------------
  2) matches: 경기 기록 (한 달에 1번 뛴 기록)
  ------------------------------
  - date       : "YYYY-MM-DD" 형식
  - location   : 경기장 이름
  - attendees  : 그 날 실제로 뛴 사람들만! (참석한다고 했다가 안 온 사람은 넣지 않습니다)
      두 가지 형태로 넣을 수 있어요.

      (a) 등록된 회원인 경우 → id로 연결
          { id: "jihoon", goals: 1 }

      (b) 그날 처음/가끔 온 사람(용병)인 경우 → 이름 대신 번호만
          { guest: "용병1", goals: 0 }
          번호는 순서 상관없이 원하는 대로 적으면 됩니다 (용병1, 용병2 ...).
          용병은 개인 기록 페이지나 랭킹에는 나오지 않고, 그 경기 화면에만 표시됩니다.

  새 경기가 끝나면 matches 배열 맨 아래에 새 객체를 하나 추가하세요.
  날짜순 정렬은 자동으로 처리되니 순서는 상관없습니다.
  ===============================================================
*/

const CLUB_DATA = {
  clubName: "FC 일요일",

  members: [
    { id: "k_jongyoon",   name: "김종윤" },
    { id: "y_yeongjoon",    name: "윤영준" },
    { id: "s_geonyeong",  name: "신건영" },
    { id: "j_jinyeong",  name: "장진영" },    
    { id: "c_enwoo",  name: "최은우" },    
    { id: "j_yeonje", name: "정연제" },
    { id: "m_sooyeong", name: "맹수영" },
  ],

    matches: [
    {
      date: "2026-06-13",
      location: "안산 풋살 경기장",
      attendees: [
        { id: "s_geonyeong",  goals: 0 },
        { guest: "용병1", goals: 0 },
      ]
    },

     {
      date: "2026-07-13",
      location: "안산 풋살 경기장",
      attendees: [
        { id: "y_yeongjoon",    goals: 1 },
        { id: "s_geonyeong",  goals: 0 },
        { guest: "용병1", goals: 0 },
        { guest: "용병2", goals: 0 },
      ]
    },
    {
      date: "2026-08-13",
      location: "안산 풋살 경기장",
      attendees: [
        { id: "y_yeongjoon",    goals: 1 },
        { id: "s_geonyeong",  goals: 0 },
        { id: "j_jinyeong",  goals: 4 },
        { guest: "용병1", goals: 0 },
        { guest: "용병2", goals: 0 },
        { guest: "용병3", goals: 0 },
      ]
    },
     {
      date: "2026-09-13",
      location: "안산 풋살 경기장",
      attendees: [
        { id: "k_jongyoon",   goals: 5 },
        { id: "y_yeongjoon",    goals: 0 },
        { id: "s_geonyeong",  goals: 1 },
        { id: "j_jinyeong",  goals: 0 },
        { guest: "용병1", goals: 0 },
        { guest: "용병2", goals: 0 },
        { guest: "용병3", goals: 0 },
        { guest: "용병4", goals: 0 },
      ]
    }


  ]



  // ,
  //   {
  //     date: "2026-07-12",
  //     location: "탄천 종합운동장",
  //     attendees: [
  //       { id: "jihoon",   goals: 0 },
  //       { id: "minsu",    goals: 1 },
  //       { id: "donghyun", goals: 1 },
  //       { id: "taeyang",  goals: 3 },
  //       { id: "hyunwoo",  goals: 0 },
  //       { guest: "용병1", goals: 0 },
  //       { guest: "용병2", goals: 1 }
  //     ]
  //   },
  //   {
  //     date: "2026-08-09",
  //     location: "잠실 보조경기장",
  //     attendees: [
  //       { id: "jihoon",   goals: 2 },
  //       { id: "seungho",  goals: 0 },
  //       { id: "wooyoung", goals: 0 },
  //       { id: "hyunwoo",  goals: 1 },
  //       { guest: "용병1", goals: 2 },
  //       { id: "minsu",    goals: 0 }
  //     ]
  //   },
  //   {
  //     date: "2026-09-13",
  //     location: "한강 뚝섬 축구장",
  //     attendees: [
  //       { id: "jihoon",   goals: 0 },
  //       { id: "minsu",    goals: 2 },
  //       { id: "seungho",  goals: 1 },
  //       { id: "donghyun", goals: 0 },
  //       { id: "wooyoung", goals: 0 },
  //       { id: "hyunwoo",  goals: 1 },
  //       { guest: "용병1", goals: 1 },
  //       { guest: "용병2", goals: 0 }
  //     ]
  //   }
  // ]
};
