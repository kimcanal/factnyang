function sunDday(){var now=new Date(Date.now()+9*3600*1000);var t=Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate());var d=Math.round((Date.UTC(2026,10,19)-t)/86400000);return d>0?"D-"+d:(d===0?"D-DAY":"종료");}
(function(){
  "use strict";
  var C = window.FC_CASES, T = window.FC_TIMELINE, P = window.FC_POWER, S = window.FC_SUNEUNG, FN = window.FactNyang;
  var ST = [
    {k:"확정", cls:"s-conf", mood:"conf", ic:"✓", d:"자백·적발·판결", say:"자백·적발·판결로 확인된 사실이다냥."},
    {k:"조사중", cls:"s-inv", mood:"inv", ic:"◔", d:"수사·전수조사", say:"기관이 조사 중이다냥. 결과 나오기 전엔 단정 금지!"},
    {k:"의혹", cls:"s-alg", mood:"alg", ic:"?", d:"미확인 주장", say:"아직 확인 안 된 주장이다냥. 반대 근거와 해명도 꼭 보라냥."},
    {k:"거짓/해명됨", cls:"s-false", mood:"false", ic:"✕", d:"반박·다른 원인", say:"사실과 다르거나 다른 이유로 설명된다냥."}
  ];
  var SM = {}; ST.forEach(function(s){ SM[s.k]=s; });
  var KEY = {
    "semusa-a":["397.5/400","1차 점수"], "semusa-66":["1→2→66명","90점 이상"], "glasses-12":["12건","스마트안경 적발"],
    "leet-caught":["4년","응시 제한"], "konkuk-mock":["퇴장 1명","조사위 확인 중"], "naesin-4":["4건","내신 적발"], "nonsul-caught":["3명","논술 적발"],
    "leet-perfect":["19년 만","첫 전 영역 만점"], "sogang":["조사 예정","입학처"], "kyunghee":["47일 뒤","30문항 복원"],
    "customs":["15.43→28.16%","1차 합격률"], "gampyeong":["7.23%","2차 합격률"], "police-transfer":["61→71.75점","1차 합격선"],
    "nonsul-witness":["익명 1건","목격담"], "suneung-kor":["64→1,055→261명","국어 최고점 인원"], "semusa-school3":["당사자 반박","공식 조사 아님"],
    "semusa-glasses":["카메라","안경 아님"], "semusa-2021":["75명","추가 합격"], "customs-2019":["징역형","출제위원 2명"],
    "bar-2021":["전원 만점","문항 처리"], "camera-ring":["9명","송치"], "police-2020":["25곳","시험장 노출"], "hrdk-11":["11건·1,064명","사고·영향"]
  };
  var ANN = {"semusa-66":"기대값 약 1.3명 → 약 49배", "suneung-kor":"쉬운 해일수록 만점자가 많아요", "customs":"2025년이 유독 낮았던 해", "police-transfer":"2024학년도에도 71점"};

  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];}); }
  function fmt(n){ return Number(n).toLocaleString("ko-KR"); }
  function lead(t){
    var i=t.indexOf(": ");
    if(i>0 && i<40) return '<b>'+esc(t.slice(0,i+1))+'</b>'+esc(t.slice(i+1));
    var m=t.match(/^(.{6,70}?(?:다|요|음|니다)[.)])\s+(.+)$/);
    return m ? '<b>'+esc(m[1])+'</b> '+esc(m[2]) : esc(t);
  }
  function badge(k){ var s=SM[k]; return '<span class="badge '+s.cls+'"><i aria-hidden="true">'+s.ic+'</i>'+k+'</span>'; }
  function byId(id){ for(var i=0;i<C.length;i++) if(C[i].id===id) return C[i]; return null; }

  // 마스코트 배치
  $("brand-cat").innerHTML = FN.svg("happy",40,"팩트냥이 로고");
  $("hero-cat").innerHTML = FN.svg("happy",112);
  $("disc-cat").innerHTML = FN.svg("happy",40);
  $("tl-cat").innerHTML = FN.svg("inv",76);
  $("st-cat").innerHTML = FN.svg("conf",76);
  $("upd").textContent = window.FC_UPDATED_TIME || window.FC_UPDATED;
  $("upd-top").textContent = (window.FC_UPDATED_TIME || window.FC_UPDATED).replace(/^\d{4}-/,"").replace("-","/")+" KST";

  // 홈: 판정 타일
  var cur = C.filter(function(c){return !c.past;});
  $("tiles").innerHTML = ST.map(function(s){
    var n=C.filter(function(c){return c.status===s.k;}).length, n26=cur.filter(function(c){return c.status===s.k;}).length;
    return '<button class="tile '+s.cls+'" data-s="'+s.k+'" type="button" aria-label="'+s.k+' '+n+'건 보기"><span class="tile-cat">'+FN.svg(s.mood,52)+'</span><span class="tile-n">'+n+'<small>건</small></span><span class="tile-k"><i aria-hidden="true">'+s.ic+'</i> '+s.k+'</span><span class="tile-d">'+s.d+' · 올해 '+n26+'</span></button>';
  }).join("");
  [].forEach.call(document.querySelectorAll(".tile"), function(b){ b.onclick=function(){ state.status=b.dataset.s; syncChips(); renderFeed(); location.hash="#cases"; }; });

  // 홈: 스토리 카드 (올해 사건, 최신순)
  var recent = cur.slice().sort(function(a,b){ return a.date<b.date?1:a.date>b.date?-1:0; }).slice(0,9);
  $("stories").innerHTML = recent.map(function(c){
    var s=SM[c.status], k=KEY[c.id]||["",""];
    return '<button class="story '+s.cls+'" type="button" data-id="'+c.id+'"><span class="story-top">'+badge(c.status)+(c.isNew?'<span class="new">NEW</span>':'')+'</span><span class="story-cat">'+FN.svg(s.mood,64)+'</span><span class="story-t">'+esc(c.title)+'</span><span class="story-k">'+esc(k[0])+'<small>'+esc(k[1])+'</small></span><span class="story-d">'+esc(c.exam)+' · '+esc(c.date)+'</span></button>';
  }).join("");
  [].forEach.call(document.querySelectorAll(".story"), function(b){ b.onclick=function(){ openCase(b.dataset.id); }; });

  // 사건 피드
  var state={status:"전체", type:"전체", q:"", past:true};
  $("chips").innerHTML = ["전체"].concat(ST.map(function(s){return s.k;})).map(function(k){
    var n = k==="전체"?C.length:C.filter(function(c){return c.status===k;}).length, s=SM[k];
    return '<button type="button" class="chip '+(s?s.cls:"")+'" data-s="'+k+'">'+(s?'<i aria-hidden="true">'+s.ic+'</i>':'')+k+'<span class="cn">'+n+'</span></button>';
  }).join("");
  [].forEach.call(document.querySelectorAll(".chip"), function(b){ b.onclick=function(){ state.status=b.dataset.s; syncChips(); renderFeed(); }; });
  function syncChips(){ [].forEach.call(document.querySelectorAll(".chip"), function(b){ var on=b.dataset.s===state.status; b.classList.toggle("on",on); b.setAttribute("aria-pressed",on); }); }
  var types=[]; C.forEach(function(c){ if(types.indexOf(c.type)<0) types.push(c.type); });
  $("type").innerHTML = ["전체"].concat(types).map(function(t){ return '<option value="'+esc(t)+'">'+(t==="전체"?"모든 시험 유형":esc(t))+'</option>'; }).join("");
  $("type").onchange=function(e){ state.type=e.target.value; renderFeed(); };
  $("q").oninput=function(e){ state.q=e.target.value.trim().toLowerCase(); renderFeed(); };
  $("past").onchange=function(e){ state.past=e.target.checked; renderFeed(); };

  function renderFeed(){
    var q=state.q;
    var list=C.filter(function(c){
      if(state.status!=="전체" && c.status!==state.status) return false;
      if(state.type!=="전체" && c.type!==state.type) return false;
      if(!state.past && c.past) return false;
      if(q){ var b=(c.title+" "+c.claim+" "+c.exam+" "+c.type+" "+c.facts.join(" ")+" "+c.counter.join(" ")+" "+(KEY[c.id]||[]).join(" ")).toLowerCase(); if(b.indexOf(q)<0) return false; }
      return true;
    });
    $("count").textContent = list.length+"건 · 카드를 누르면 자세히 볼 수 있어요";
    $("feed").innerHTML = list.length ? list.map(function(c,i){
      var s=SM[c.status], k=KEY[c.id]||["",""];
      return '<button type="button" class="item '+s.cls+'" data-id="'+c.id+'" style="--i:'+Math.min(i,10)+'"><span class="item-top">'+badge(c.status)+(c.isNew?'<span class="new">NEW</span>':'')+(c.past?'<span class="past">과거</span>':'')+'<span class="item-d">'+esc(c.date)+'</span></span><span class="item-t">'+esc(c.title)+'</span><span class="item-c">'+esc(c.claim)+'</span><span class="item-k"><b>'+esc(k[0])+'</b> '+esc(k[1])+'<span class="chev" aria-hidden="true">›</span></span></button>';
    }).join("") : '<div class="empty">'+FN.svg("alg",110)+'<p><b>그런 사건은 못 찾았다냥</b></p><p>검색어를 바꾸거나 필터를 풀어 보세요.</p><button type="button" class="btn" id="reset">필터 초기화</button></div>';
    [].forEach.call(document.querySelectorAll(".item"), function(b){ b.onclick=function(){ openCase(b.dataset.id); }; });
    var r=$("reset"); if(r) r.onclick=function(){ state={status:"전체",type:"전체",q:"",past:true}; $("q").value=""; $("type").value="전체"; $("past").checked=true; syncChips(); renderFeed(); };
  }

  // 차트
  var chartSeq=0;
  function chartSVG(ch, ann){
    var W=480,H=300,pl=8,pr=8,pt=ann?74:44,pb=50,n=ch.values.length,u="c"+(++chartSeq);
    var max=Math.max.apply(null,ch.values)*1.06, bw=(W-pl-pr)/n, g='<defs><linearGradient id="'+u+'Hi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--hi-a)"/><stop offset="1" style="stop-color:var(--hi-b)"/></linearGradient><linearGradient id="'+u+'Lo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--bar-a)"/><stop offset="1" style="stop-color:var(--bar-b)"/></linearGradient></defs>';
    for(var k=1;k<=3;k++){ var gy=H-pb-(H-pt-pb)*k/3; g+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+gy.toFixed(1)+'" y2="'+gy.toFixed(1)+'" class="c-grid"/>'; }
    ch.values.forEach(function(v,i){
      var h=Math.max(4,(H-pt-pb)*v/max), w=Math.min(96,bw*0.6), x=pl+i*bw+(bw-w)/2, y=H-pb-h, hi=ch.hi===i;
      g+='<path d="M'+x.toFixed(1)+' '+(H-pb)+' V'+(y+12).toFixed(1)+' Q'+x.toFixed(1)+' '+y.toFixed(1)+' '+(x+12).toFixed(1)+' '+y.toFixed(1)+' H'+(x+w-12).toFixed(1)+' Q'+(x+w).toFixed(1)+' '+y.toFixed(1)+' '+(x+w).toFixed(1)+' '+(y+12).toFixed(1)+' V'+(H-pb)+'Z" fill="url(#'+u+(hi?'Hi':'Lo')+')" class="c-bar"/>';
      g+='<text x="'+(x+w/2).toFixed(1)+'" y="'+(y-12).toFixed(1)+'" text-anchor="middle" class="c-v'+(hi?' hi':'')+'">'+fmt(v)+(ch.unit==="명"?"명":ch.unit)+'</text>';
      g+='<text x="'+(x+w/2).toFixed(1)+'" y="'+(H-pb+30)+'" text-anchor="middle" class="c-l">'+esc(ch.labels[i])+'</text>';
    });
    g+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+(H-pb)+'" y2="'+(H-pb)+'" class="c-axis"/>';
    if(ann) g+='<g><rect x="'+pl+'" y="6" rx="18" height="40" width="'+Math.min(W-pl-pr,ann.length*17+36)+'" class="c-ann-bg"/><text x="'+(pl+18)+'" y="33" class="c-ann">'+esc(ann)+'</text></g>';
    return '<figure class="chart"><figcaption>'+esc(ch.title)+'</figcaption><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(ch.title+": "+ch.labels.map(function(l,i){return l+" "+ch.values[i]+ch.unit;}).join(", "))+'">'+g+'</svg>'+(ch.note?'<p class="c-note">'+esc(ch.note)+'</p>':'')+'</figure>';
  }

  // 바텀시트
  var lastFocus=null;
  function openCase(id){ location.hash = "#case/"+id; }
  function showSheet(c){
    var s=SM[c.status], k=KEY[c.id]||["",""];
    var h='<div class="sh-head '+s.cls+'"><div class="sh-cat">'+FN.svg(s.mood,88)+'</div><div class="bubble sm"><p class="bubble-t">'+esc(s.say)+'</p></div></div>';
    h+='<div class="sh-meta">'+badge(c.status)+(c.isNew?'<span class="new">NEW</span>':'')+'<span>'+esc(c.exam)+' · '+esc(c.type)+' · '+esc(c.date)+'</span></div>';
    h+='<h2 id="sheet-title" class="sh-title">'+esc(c.title)+'</h2>';
    h+='<div class="sh-claim"><span class="lab">주장</span><p>'+esc(c.claim)+'</p></div>';
    h+='<div class="sh-key '+s.cls+'"><b>'+esc(k[0])+'</b><span>'+esc(k[1])+'</span></div>';
    h+='<section class="sh-sec"><h3><span class="dot ok"></span>확인된 사실</h3><ul>'+c.facts.map(function(f){return '<li>'+lead(f)+'</li>';}).join("")+'</ul></section>';
    h+='<section class="sh-sec counter"><h3><span class="dot alt"></span>'+(c.status==="확정"?"남은 쟁점·한계":"반대 근거·당사자 해명")+'</h3><ul>'+c.counter.map(function(f){return '<li>'+lead(f)+'</li>';}).join("")+'</ul></section>';
    if(c.chart) h+='<section class="sh-sec"><h3><span class="dot data"></span>데이터</h3>'+chartSVG(c.chart,ANN[c.id])+'</section>';
    if(c.meme) h+='<p class="sh-memo">'+esc(c.meme)+'</p>';
    h+='<section class="sh-sec"><h3><span class="dot src"></span>출처 '+c.sources.length+'건</h3><ol class="srcs">'+c.sources.map(function(x){return '<li><a href="'+esc(x[3])+'" target="_blank" rel="noopener">'+esc(x[0])+'</a><span>'+esc(x[1])+' · '+esc(x[2])+'</span></li>';}).join("")+'</ol></section>';
    h+='<p class="sh-checked">마지막 확인 '+esc(window.FC_UPDATED_TIME||window.FC_UPDATED)+' KST</p>';
    $("sheet-body").innerHTML=h;
    var w=$("sheet-wrap"); lastFocus=document.activeElement;
    w.hidden=false; document.body.classList.add("lock");
    requestAnimationFrame(function(){ w.classList.add("open"); $("sheet").scrollTop=0; $("sheet").focus({preventScroll:true}); });
  }
  function hideSheet(){
    var w=$("sheet-wrap"); if(w.hidden) return;
    w.classList.remove("open"); document.body.classList.remove("lock");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(function(){ w.hidden=true; if(lastFocus && lastFocus.focus) lastFocus.focus({preventScroll:true}); }, reduce?0:260);
  }
  function closeCase(){ if(location.hash.indexOf("#case/")===0){ if(prevView){ location.hash="#"+prevView; } else { location.hash="#cases"; } } else hideSheet(); }
  $("backdrop").onclick=closeCase; $("sheet-close").onclick=closeCase; $("grab").onclick=closeCase;
  document.addEventListener("keydown",function(e){ if(e.key==="Escape") closeCase(); });

  // 라우팅
  var views=["home","cases","timeline","stats","info"], prevView="home";
  function route(){
    var h=location.hash.replace(/^#/,"")||"home";
    if(h.indexOf("case/")===0){ var c=byId(h.slice(5)); if(c){ showSheet(c); return; } h="cases"; }
    hideSheet();
    var anchor=null;
    if(h.indexOf("info-")===0){ anchor=h; h="info"; }
    if(views.indexOf(h)<0) h="home";
    prevView=h;
    views.forEach(function(v){ var el=$("view-"+v); var on=v===h; if(el.hidden===on){ el.hidden=!on; if(on){ el.classList.remove("enter"); void el.offsetWidth; el.classList.add("enter"); } } });
    [].forEach.call(document.querySelectorAll("#tabbar a"), function(a){ var on=a.dataset.tab===h; a.classList.toggle("on",on); if(on) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); });
    if(anchor){ var t=$(anchor); if(t) setTimeout(function(){ t.scrollIntoView({block:"start"}); },30); }
    else window.scrollTo(0,0);
  }
  window.addEventListener("hashchange",route);

  // 타임라인
  var lastDate="";
  $("tl").innerHTML = T.map(function(t){
    var s=SM[t[2]], cls=s?s.cls:(t[2]==="예정"?"s-plan":"s-other"), ic=s?s.ic:(t[2]==="예정"?"◷":"•");
    var d=t[0].slice(5).replace("-","/"), show=d!==lastDate; lastDate=d;
    var night = t[1].indexOf("[밤]")===0, txt = night? t[1].slice(4) : t[1];
    var parts = txt.split(/\.\s+/).filter(Boolean); if(parts.length===1 && txt.length>90) parts = txt.split(/,\s+/);
    return '<li class="'+cls+(show?'':' cont')+'"><div class="tl-d">'+(show?'<b>'+d+'</b>':'')+(night?'<small>밤</small>':'')+'</div><div class="tl-dot" aria-hidden="true">'+ic+'</div><div class="tl-c"><span class="tag '+cls+'">'+esc(t[2])+'</span>'+(parts.length>1?'<ul>'+parts.map(function(p){return '<li>'+esc(p.replace(/\.$/,""))+'</li>';}).join("")+'</ul>':'<p>'+esc(txt)+'</p>')+'</div></li>';
  }).join("");

  // 통계
  (function(){
    var semusa=byId("semusa-66"), kor=byId("suneung-kor");
    var bars='', mx=P.rows[0][1];
    P.rows.forEach(function(r,i){ var w=300*r[1]/mx, y=i*58; bars+='<text x="0" y="'+(y+20)+'" class="c-l" text-anchor="start">'+esc(r[0])+'</text><rect x="0" y="'+(y+28)+'" width="'+Math.max(w,8).toFixed(1)+'" height="20" rx="10" fill="url(#'+(i===1?'pHi':'pLo')+')"/><text x="'+(Math.max(w,8)+10).toFixed(1)+'" y="'+(y+44)+'" class="c-v'+(i===1?' hi':'')+'" text-anchor="start">'+fmt(r[1])+'명</text>'; });
    var rows=P.rows.map(function(r){return '<tr><th scope="row">'+esc(r[0])+'</th><td>'+fmt(r[1])+'<small> '+(r[1]/P.n*100).toFixed(1)+'%</small></td><td>'+fmt(r[2])+'</td><td>'+fmt(r[3])+'</td></tr>';}).join("");
    $("stats").innerHTML =
      '<article class="card answer"><h2 class="card-h">통계로 잡을 수 있나?</h2><p><b>기준선이 거의 0인 지표에서는 잡히지만, 수십만 명이 보는 수능에서 소수의 부정행위는 통계에 거의 드러나지 않아요.</b></p></article>'+
      '<article class="card"><h3 class="card-h2"><span class="num">1</span>잡히는 경우 · 세무사 66명</h3><p>2024~2025년 비율이면 올해 회계학개론 90점 이상은 <b>약 1.3명</b>이어야 하는데 실제는 <b>66명(약 49배)</b>이에요.</p>'+chartSVG(semusa.chart,ANN["semusa-66"])+'<p class="muted">단, 통계는 <u>누가</u> 부정했는지 알려주지 않아요. 개인 확인은 답안·기기·감독 기록으로 해야 해요.</p></article>'+
      '<article class="card"><h3 class="card-h2"><span class="num">2</span>잡기 어려운 경우 · 수능 국어</h3><p>최고점 인원은 시험 난이도에 따라 크게 출렁여요. 이것만으로 부정 여부를 판단할 수 없어요.</p>'+chartSVG(kor.chart,ANN["suneung-kor"])+
      '<p>2026학년도 국어 응시자 <b>'+fmt(P.n)+'명</b> 분포에 부정행위자가 섞였다고 가정하고, 감지되려면 몇 명이 필요한지 계산했어요(자체 검정력 분석).</p>'+
      '<figure class="chart"><figcaption>통상 기준(2σ)으로 감지하려면 필요한 인원</figcaption><svg viewBox="0 0 440 292" role="img" aria-label="시나리오별 필요한 부정행위자 수"><defs><linearGradient id="pHi" x1="0" x2="1"><stop offset="0" style="stop-color:var(--hi-b)"/><stop offset="1" style="stop-color:var(--hi-a)"/></linearGradient><linearGradient id="pLo" x1="0" x2="1"><stop offset="0" style="stop-color:var(--bar-b)"/><stop offset="1" style="stop-color:var(--bar-a)"/></linearGradient></defs>'+bars+'</svg><p class="c-note">무작위로 섞인 사람이 30점씩 올렸다면 약 3,400명(응시자의 0.7%)은 있어야 겨우 신호가 나요.</p></figure>'+
      '<div class="tw"><table><caption>보정 기준별 필요 인원(명)</caption><thead><tr><th scope="col">시나리오</th><th scope="col">2σ</th><th scope="col">2.84σ<br><small>6개 보정</small></th><th scope="col">4.18σ<br><small>192개 보정</small></th></tr></thead><tbody>'+rows+'</tbody></table></div></article>'+
      '<article class="card"><h3 class="card-h2"><span class="num">3</span>실제로 검정해 보니</h3><ul class="bul"><li><b>192개 비교 지표 중 p&lt;0.05는 9개:</b> 우연만으로 기대되는 9.6개와 비슷했어요.</li><li><b>다중검정 보정 후 0개:</b> Benjamini-Hochberg·Bonferroni 기준.</li><li><b>"통계상 이상 없음"은 "부정행위 없음"과 달라요.</b> 반대로 "고득점자가 늘었다"도 개인의 부정 증거가 아니에요.</li></ul></article>';
  })();

  // 정보
  (function(){
    var crit = ST.map(function(s){ return '<li class="'+s.cls+'"><span class="crit-cat">'+FN.svg(s.mood,56)+'</span><span>'+badge(s.k)+'<b>'+s.d+'</b><small>'+esc(s.say)+'</small></span></li>'; }).join("");
    var sn = S.items.map(function(it){ return '<li><b>'+esc(it[0])+'</b><span>'+esc(it[1])+'</span></li>'; }).join("");
    var ss = S.sources.map(function(x){ return '<li><a href="'+esc(x[3])+'" target="_blank" rel="noopener">'+esc(x[0])+'</a><span>'+esc(x[1])+' · '+esc(x[2])+'</span></li>'; }).join("");
    $("info").innerHTML =
      '<article class="card intro"><div class="intro-cat">'+FN.svg("happy",96)+'</div><div><h2 class="card-h">팩트냥이는 누구?</h2><p><b>팩트냥이는 확인된 사실만 물어오는 고양이예요. 확인 안 된 사람에게 ○○냥이라고 부르지 않아요.</b></p><p class="muted">이 사이트의 오리지널 캐릭터로, 온라인에서 고득점자를 조롱하는 \'○○냥이\' 밈과는 관계없어요.</p></div></article>'+
      '<article class="card" id="info-meme"><h2 class="card-h">\'○○냥이\' 밈은 어디서 왔나</h2><p><b>\'세무냥이\'는 자백한 세무사 수석 합격자 A씨가 온라인에서 쓰던 본인 닉네임</b>이에요. 자백 뒤 누리꾼들이 이를 비꼬아 다른 시험의 고득점자·단기 합격자에게 \'리트냥이\', \'편입냥이\' 등을 붙이면서 밈이 됐어요.</p><p><b>별칭이 붙었다는 것은 근거가 아니에요.</b> 전문가들은 한 사건의 분노가 무관한 고득점자 전반으로 옮겨가는 \'혐오 전이\'를 우려해요.</p><p class="srcline">출처: <a href="https://www.yna.co.kr/view/AKR20261116107100505" target="_blank" rel="noopener">연합뉴스 [소셜+]</a> · <a href="https://www.knnews.co.kr/news/articleView.php?idxno=1555305" target="_blank" rel="noopener">경남신문</a></p></article>'+
      '<article class="card"><h2 class="card-h">판정 기준</h2><ul class="crit">'+crit+'</ul></article>'+
      '<article class="card" id="info-suneung"><h2 class="card-h"><span class="dday-badge">'+sunDday()+'</span> 11월 19일 수능, 이렇게 달라져요</h2><ul class="snl">'+sn+'</ul><details class="more-src"><summary>출처 '+S.sources.length+'건</summary><ol class="srcs">'+ss+'</ol></details><p class="muted">국가자격시험 부정행위는 Q-Net 부정신고센터(로그인 필요)나 공단 방문으로 제보할 수 있어요.</p></article>'+
      '<article class="card"><h2 class="card-h">이용 원칙</h2><ul class="bul"><li><b>실명을 쓰지 않아요.</b> 자백·유죄가 확정되지 않은 사람은 \'리트 전 영역 만점자\'처럼, 자백한 사람도 \'세무사 수석 합격자 A씨\'로만 적어요.</li><li><b>의혹·조사중은 부정행위가 확인되지 않은 사례예요.</b> 반대 근거와 당사자 해명을 함께 실어요.</li><li><b>커뮤니티 캡처·개인정보는 싣지 않아요.</b> 수치는 출처의 공식 자료·언론 보도 기준이에요.</li><li><b>새 공식 자료가 나오면 판정을 바꿔요.</b> \'의혹\'은 유죄 추정이 아니에요.</li></ul></article>'+
      '<article class="card"><h2 class="card-h">아직 확인하지 못한 것</h2><ul class="bul"><li><b>세무사 66명 중 수석 외 개인:</b> 공단·TF 재점검 결과가 아직 없어요.</li><li><b>A씨 제출 기기의 실제 사용·공범 여부:</b> 경찰 포렌식 결과 전이에요.</li><li><b>익명 주장:</b> 관세사 \'생동차 10명\', 감정평가사 수기 비공개 이유, 논술 목격담은 공식 자료로 확인되지 않아요.</li><li><b>커뮤니티 전용 루머:</b> 공기업 필기 복원, 치전원·의대 관련 소문 등은 근거 자료가 없어 카드로 만들지 않았어요.</li><li><b>확인 시점 이후:</b> 11-19 리트 만점자 공개 풀이와 수능 당일 적발 결과는 반영되지 않았어요.</li></ul></article>'+
      '<p class="foot">마지막 확인 '+esc(window.FC_UPDATED_TIME)+' KST · 오프라인 정적 사이트(외부 스크립트·웹폰트 없음). 출처 링크를 열 때만 인터넷이 필요해요.</p>';
  })();

  // ───── 배경 정보 (guide.js) ─────
  (function(){
    var G=window.FC_GUIDE; if(!G) return;
    function srcList(arr){ return '<details class="more-src"><summary>출처 '+arr.length+'건</summary><ol class="srcs">'+arr.map(function(x){return '<li><a href="'+esc(x[3])+'" target="_blank" rel="noopener">'+esc(x[0])+'</a><span>'+esc(x[1])+' · '+esc(x[2])+'</span></li>';}).join("")+'</ol></details>'; }
    function hbars(t){ var mx=0; t.rows.forEach(function(r){ if(r[1]>mx) mx=r[1]; }); var tot=t.rows.reduce(function(a,r){return a+r[1];},0);
      return '<figure class="chart"><figcaption>'+esc(t.title)+'</figcaption><ul class="hb">'+t.rows.map(function(r,i){ return '<li><span class="hb-l">'+esc(r[0])+'</span><span class="hb-track"><span class="hb-bar'+(i===0?' hi':'')+'" style="width:'+Math.max(2,r[1]/mx*100).toFixed(1)+'%"></span></span><span class="hb-v">'+fmt(r[1])+'<small>'+(r[1]/tot*100).toFixed(1)+'%</small></span></li>'; }).join("")+'</ul></figure>'; }
    var S=G.stats;
    var st='<div class="sec-h"><h2>부정행위 통계 추이</h2><span class="hint">공식 자료(국회 제출) 기준</span></div>'+
      '<article class="card"><h3 class="card-h2"><span class="num">4</span>수능 부정행위는 해마다 늘었어요</h3>'+chartSVG(S.suneung,"5년간 1,229건 · 모두 무효")+chartSVG(S.device,"AI·스마트안경 수능 적발은 아직 0건")+hbars(S.types)+hbars(S.devices)+'</article>'+
      '<article class="card"><h3 class="card-h2"><span class="num">5</span>국가자격시험은?</h3>'+chartSVG(S.glasses,"2026년 스마트안경 12건")+'<ul class="tl-mini">'+S.national.map(function(n){return '<li><b>'+esc(n[0])+'</b><span>'+esc(n[1])+'</span></li>';}).join("")+'</ul>'+srcList(S.sources)+'</article>';
    $("stats").insertAdjacentHTML("beforeend", st);

    var info=$("info");
    var nav='<nav class="jump" aria-label="정보 바로가기">'+[["info-meme","밈 유래"],["info-law","처벌 기준"],["info-world","해외는?"],["info-measures","시험별 대책"],["info-open","성적 공개"],["info-report","제보 가이드"],["info-suneung","수능 "+sunDday()]].map(function(j){return '<a href="#'+j[0]+'">'+j[1]+'</a>';}).join("")+'</nav>';
    var law='<article class="card" id="info-law"><h2 class="card-h">처벌 기준, 얼마나 무거울까?</h2>'+
      '<p class="muted">시험 부정은 ① 시험 무효·응시 제한 같은 <b>행정 제재</b>와 ② 형법상 <b>형사 처벌</b>이 따로 적용될 수 있어요.</p>'+
      '<div class="crime">'+G.crimes.map(function(c){return '<div class="crime-c"><span class="crime-law">'+esc(c[0])+'</span><b>'+esc(c[1])+'</b><span class="crime-p">'+esc(c[2])+'</span><small>'+esc(c[3])+'</small><a href="'+esc(c[4])+'" target="_blank" rel="noopener">조문 보기 ↗</a></div>';}).join("")+'</div>'+
      '<h3 class="card-h3">시험별 행정 제재</h3><ul class="sanc">'+G.sanctions.map(function(r){return '<li><span class="sanc-x">'+esc(r[0])+'</span><span class="sanc-b"><b>'+esc(r[2])+'</b><a href="'+esc(r[3])+'" target="_blank" rel="noopener">'+esc(r[1])+' ↗</a></span></li>';}).join("")+'</ul>'+
      '<h3 class="card-h3">판례·과거 판결</h3><ul class="prec">'+G.precedents.map(function(p){return '<li><span class="prec-y">'+esc(p[0])+'</span><span><b>'+esc(p[1])+'</b> '+esc(p[2])+' <a href="'+esc(p[3])+'" target="_blank" rel="noopener">↗</a></span></li>';}).join("")+'</ul>'+
      '<p class="muted small">조문은 2026-11-17 기준 요약이에요. 실제 처벌은 사건마다 법원이 판단해요.</p></article>';
    var world='<article class="card" id="info-world"><h2 class="card-h">해외는 어떻게 하나?</h2><div class="world">'+G.world.map(function(w){return '<div class="w-c"><div class="w-top"><span class="w-flag">'+esc(w.flag)+'</span><b>'+esc(w.country)+'</b><span class="w-d">'+esc(w.date)+'</span></div><h3>'+esc(w.title)+'</h3>'+w.body.map(function(b){return '<p>'+esc(b)+'</p>';}).join("")+srcList(w.src)+'</div>';}).join("")+'</div></article>';
    var M=G.measures;
    var meas='<article class="card" id="info-measures"><h2 class="card-h">시험별 대책 한눈에</h2><div class="tw"><table class="mtab"><thead><tr><th scope="col">구분</th>'+M.cols.map(function(c){return '<th scope="col">'+esc(c)+'</th>';}).join("")+'</tr></thead><tbody>'+M.rows.map(function(r){return '<tr><th scope="row">'+esc(r[0])+'</th>'+r.slice(1).map(function(c){return '<td>'+esc(c)+'</td>';}).join("")+'</tr>';}).join("")+'</tbody></table></div><p class="hint">표는 옆으로 밀어서 볼 수 있어요.</p><ul class="bul">'+M.notes.map(function(n){return '<li>'+lead(n)+'</li>';}).join("")+'</ul>'+srcList(M.src)+'</article>';
    var T2=G.transparency;
    var open='<article class="card" id="info-open"><h2 class="card-h">성적 통계, 공개되고 있나?</h2><ul class="bul">'+T2.items.map(function(n){return '<li>'+lead(n)+'</li>';}).join("")+'</ul>'+srcList(T2.src)+'</article>';
    var R=G.report;
    var rep='<article class="card report" id="info-report"><div class="rep-head">'+FN.svg("conf",72)+'<div><h2 class="card-h">제보·대처 가이드</h2><p class="muted">의심되면 공식 채널로! 공개 저격은 하지 말라냥.</p></div></div>'+
      '<h3 class="card-h3">어디에 제보하나</h3><ul class="chan">'+R.channels.map(function(c){return '<li><b>'+esc(c[0])+'</b><span>'+(c[2]?'<a href="'+esc(c[2])+'" target="_blank" rel="noopener">'+esc(c[1])+' ↗</a>':esc(c[1]))+'</span></li>';}).join("")+'</ul>'+
      '<div class="dodont"><div class="do"><h4>이렇게</h4><ul>'+R.dos.map(function(d){return '<li>'+esc(d)+'</li>';}).join("")+'</ul></div><div class="dont"><h4>이건 안 돼요</h4><ul>'+R.donts.map(function(d){return '<li>'+esc(d)+'</li>';}).join("")+'</ul></div></div>'+
      '<h3 class="card-h3">알아둘 법</h3><ul class="sanc">'+R.laws.map(function(l){return '<li><span class="sanc-x">'+esc(l[0])+'</span><span class="sanc-b"><b>'+esc(l[1])+'</b><a href="'+esc(l[2])+'" target="_blank" rel="noopener">조문 보기 ↗</a></span></li>';}).join("")+'</ul></article>';
    // 소개 카드 뒤에 바로가기, 판정 기준 뒤에 새 섹션들
    var intro=info.querySelector(".intro"); if(intro) intro.insertAdjacentHTML("afterend", nav);
    var sun=$("info-suneung"); if(sun) sun.insertAdjacentHTML("beforebegin", law+world+meas+open+rep);
  })();

  // 다크 모드
  var tb=$("theme"), root=document.documentElement;
  function isDark(){ var a=root.getAttribute("data-theme"); return a? a==="dark" : window.matchMedia("(prefers-color-scheme: dark)").matches; }
  function label(){ var d=isDark(); tb.innerHTML = d ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></g></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor"/></svg>'; tb.setAttribute("aria-label", d?"라이트 모드로":"다크 모드로"); tb.setAttribute("aria-pressed",d); var m=document.querySelector('meta[name=theme-color]'); if(m) m.content = d?"#17141C":"#FFF8F1"; }
  tb.onclick=function(){ var t=isDark()?"light":"dark"; root.setAttribute("data-theme",t); try{localStorage.setItem("fn-theme",t);}catch(e){} label(); };
  label();

  syncChips(); renderFeed(); route();
})();
