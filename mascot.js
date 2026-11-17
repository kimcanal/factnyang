// 팩트냥이 — 오리지널 고양이 탐정 캐릭터 (인라인 SVG, 외부 리소스 없음)
(function(){
  var K = "#4a3728"; // 선 색
  function eye(x,y,r){ return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+K+'"/><circle cx="'+(x+r*0.35)+'" cy="'+(y-r*0.4)+'" r="'+(r*0.38)+'" fill="#fff"/><circle cx="'+(x-r*0.35)+'" cy="'+(y+r*0.35)+'" r="'+(r*0.15)+'" fill="#fff" opacity=".8"/>'; }
  function lens(cx,cy,r,rot){
    return '<g class="fn-lens" transform="rotate('+rot+' '+cx+' '+cy+')"><line x1="'+cx+'" y1="'+(cy+r)+'" x2="'+cx+'" y2="'+(cy+r+22)+'" stroke="#8a6a4a" stroke-width="7" stroke-linecap="round"/>'+
      '<line x1="'+cx+'" y1="'+(cy+r)+'" x2="'+cx+'" y2="'+(cy+r+22)+'" stroke="#b08a62" stroke-width="3" stroke-linecap="round"/>'+
      '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="rgba(225,242,255,.35)" stroke="#6c7a8c" stroke-width="5"/>'+
      '<path d="M'+(cx-r*0.55)+' '+(cy-r*0.15)+' A'+(r*0.6)+' '+(r*0.6)+' 0 0 1 '+(cx-r*0.1)+' '+(cy-r*0.6)+'" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/></g>';
  }
  function face(m){
    var f='';
    // 볼
    f += '<ellipse cx="54" cy="84" rx="8" ry="5" fill="#ffb3b8" opacity=".75"/><ellipse cx="106" cy="84" rx="8" ry="5" fill="#ffb3b8" opacity=".75"/>';
    // 수염
    f += '<g stroke="'+K+'" stroke-width="1.6" stroke-linecap="round" opacity=".55"><path d="M40 78 L24 74M40 84 L23 85M41 90 L27 95"/><path d="M120 78 L136 74M120 84 L137 85M119 90 L133 95"/></g>';
    // 코
    f += '<path d="M76 80 Q80 77 84 80 Q82 84 80 85 Q78 84 76 80Z" fill="#ff8fa0" stroke="'+K+'" stroke-width="1.2" stroke-linejoin="round"/>';
    if(m==="conf"){
      f += eye(62,72,6.5)+eye(98,72,6.5);
      f += '<path d="M52 60 L70 64M108 60 L90 64" stroke="'+K+'" stroke-width="3.2" stroke-linecap="round"/>';
      f += '<path d="M73 91 L87 91" stroke="'+K+'" stroke-width="2.6" stroke-linecap="round"/>';
    } else if(m==="inv"){
      f += eye(62,72,6.5);
      f += '<circle cx="98" cy="72" r="9" fill="'+K+'"/><circle cx="102" cy="67" r="4" fill="#fff"/><circle cx="95" cy="76" r="1.6" fill="#fff"/>';
      f += '<path d="M54 62 Q62 58 70 62" stroke="'+K+'" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
      f += '<ellipse cx="80" cy="92" rx="3.4" ry="3" fill="'+K+'"/>';
    } else if(m==="alg"){
      f += eye(64,70,6.5)+eye(100,70,6.5);
      f += '<path d="M54 58 Q62 54 70 58" stroke="'+K+'" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M92 52 Q100 47 108 53" stroke="'+K+'" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
      f += '<path d="M72 92 Q76 89 80 92 Q84 95 88 92" stroke="'+K+'" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    } else if(m==="false"){
      f += '<path d="M55 66 L66 72 L55 78M105 66 L94 72 L105 78" stroke="'+K+'" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      f += '<path d="M73 94 Q80 89 87 94" stroke="'+K+'" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    } else {
      f += eye(62,72,7)+eye(98,72,7);
      f += '<path d="M72 89 Q76 94 80 89 Q84 94 88 89" stroke="'+K+'" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    return f;
  }
  function svg(mood, size, label){
    mood = mood||"happy"; size=size||96;
    var tilt = mood==="alg" ? 'transform="rotate(-12 80 78)"' : '';
    var s = '<svg class="fn-cat fn-'+mood+'" width="'+size+'" height="'+size+'" viewBox="0 0 160 160" role="img" aria-label="'+(label||"팩트냥이")+'">';
    s += '<ellipse cx="80" cy="150" rx="40" ry="6" style="fill:var(--shadow-c,rgba(74,55,40,.12))"/>';
    // 꼬리
    s += '<path class="fn-tail" d="M112 130 Q142 128 138 100 Q136 88 128 92" stroke="'+K+'" stroke-width="13" fill="none" stroke-linecap="round"/><path class="fn-tail" d="M112 130 Q142 128 138 100 Q136 88 128 92" stroke="#ffe3bd" stroke-width="9" fill="none" stroke-linecap="round"/>';
    // 몸통 + 코트
    s += '<path d="M48 146 Q44 110 80 106 Q116 110 112 146 Z" fill="#c9b8f2" stroke="'+K+'" stroke-width="2.6" stroke-linejoin="round"/>';
    s += '<path d="M80 108 L80 146" stroke="'+K+'" stroke-width="1.6" opacity=".45"/><circle cx="86" cy="124" r="2.2" fill="'+K+'" opacity=".6"/><circle cx="86" cy="136" r="2.2" fill="'+K+'" opacity=".6"/>';
    s += '<path d="M62 110 L80 124 L98 110" fill="#fff6ea" stroke="'+K+'" stroke-width="2.2" stroke-linejoin="round"/>';
    s += '<path d="M73 116 L80 121 L87 116 L87 124 L80 121 L73 124Z" fill="#8fd3c1" stroke="'+K+'" stroke-width="1.6" stroke-linejoin="round"/>';
    // 앞발
    s += '<ellipse cx="64" cy="146" rx="10" ry="6.5" fill="#ffe3bd" stroke="'+K+'" stroke-width="2.2"/><ellipse cx="96" cy="146" rx="10" ry="6.5" fill="#ffe3bd" stroke="'+K+'" stroke-width="2.2"/>';
    s += '<g class="fn-head" '+tilt+'><g class="fn-head-in">';
    // 귀
    s += '<path d="M38 64 L36 22 Q56 30 66 44 Z" fill="#ffe3bd" stroke="'+K+'" stroke-width="2.6" stroke-linejoin="round"/><path d="M43 54 L42 32 Q53 37 58 45 Z" fill="#ffb7c0"/>';
    s += '<path d="M122 64 L124 22 Q104 30 94 44 Z" fill="#ffe3bd" stroke="'+K+'" stroke-width="2.6" stroke-linejoin="round"/><path d="M117 54 L118 32 Q107 37 102 45 Z" fill="#ffb7c0"/>';
    // 머리
    s += '<path d="M80 34 C122 34 132 60 130 80 C128 104 106 112 80 112 C54 112 32 104 30 80 C28 60 38 34 80 34Z" fill="#ffe3bd" stroke="'+K+'" stroke-width="2.8"/>';
    s += '<path d="M70 38 Q80 46 90 38" stroke="#f3c894" stroke-width="4" fill="none" stroke-linecap="round"/>';
    // 탐정 모자 (작은 사냥모)
    s += '<g transform="rotate(-6 80 34)"><path d="M50 40 Q52 12 80 10 Q108 12 110 40 Q80 32 50 40Z" fill="#b9a3f0" stroke="'+K+'" stroke-width="2.6" stroke-linejoin="round"/>';
    s += '<path d="M58 32 Q80 26 102 32" stroke="#8c72e0" stroke-width="5" fill="none"/>';
    s += '<path d="M64 20 L70 36M80 14 L80 34M96 20 L90 36" stroke="#a48de8" stroke-width="1.6" opacity=".9"/>';
    s += '<path d="M60 40 Q80 50 100 40 Q80 44 60 40Z" fill="#9f87ea" stroke="'+K+'" stroke-width="2.2" stroke-linejoin="round"/>';
    s += '<circle cx="80" cy="11" r="4" fill="#ffd36e" stroke="'+K+'" stroke-width="1.8"/></g>';
    s += face(mood);
    if(mood==="false") s += '<g class="fn-motion" stroke="'+K+'" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".5"><path d="M22 60 Q14 74 22 88"/><path d="M14 64 Q8 74 14 84"/><path d="M138 60 Q146 74 138 88"/><path d="M146 64 Q152 74 146 84"/></g>';
    s += '</g></g>';
    // 소품
    if(mood==="inv") s += lens(98,72,17,-20);
    else if(mood==="happy") s += lens(132,104,12,30);
    else if(mood==="conf") s += '<g class="fn-prop"><circle cx="128" cy="118" r="15" fill="#ffd9d6" stroke="'+K+'" stroke-width="2.4"/><path d="M121 118 L126 123 L135 113" stroke="#b42318" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>';
    else if(mood==="alg") s += '<g class="fn-prop"><text x="128" y="44" font-size="34" font-weight="900" fill="#6b4fd8" font-family="system-ui,sans-serif">?</text><text x="142" y="26" font-size="18" font-weight="900" fill="#a28cf0" font-family="system-ui,sans-serif">?</text></g>';
    else if(mood==="false") s += '<g class="fn-prop"><circle cx="130" cy="120" r="13" fill="#dcefe3" stroke="'+K+'" stroke-width="2.4"/><path d="M125 115 L135 125M135 115 L125 125" stroke="#2f5e45" stroke-width="3.4" stroke-linecap="round"/></g>';
    s += '</svg>';
    return s;
  }
  window.FactNyang = { svg: svg };
})();
