// =================================================================
// Agent Academy — Application Engine
// Navigation, quiz rendering, widgets, progress, dark mode
// © 2026 Andrés Muñoz / Masiv Integrations
// Todos los derechos reservados.
// =================================================================

function shuffleQ(q,seed){
  const cor=q.cor; const opts=[...q.opts]; const correctText=opts[cor];
  const hash=(seed*31+q.q.length+Math.floor(Date.now()/60000))%4;
  const wrong=opts.filter((_,i)=>i!==cor);
  const newCor=hash%4;
  const newOpts=[];
  let wi=0;
  for(let i=0;i<4;i++){if(i===newCor){newOpts.push(correctText);}else{newOpts.push(wrong[wi++]||opts[i]);}}
  return {...q,opts:newOpts,cor:newCor};
}

function renderQuizzes(){
  // Render all quizzes using new one-at-a-time engine
  const allIds=[...Object.keys(QS),'qz3a','qz5','qz6','exam'];
  allIds.forEach(id=>{
    const qs=getQS(id);
    const wrap=document.getElementById(id+'-wrap');
    
    if(!wrap||!qs)return;
    initQuiz(id,qs,wrap);
  });
}

function initQuiz(qid,qs,wrap){
  if(!QZ_STATE[qid])QZ_STATE[qid]={current:0,results:[],done:false};
  renderQuestion(qid,qs,wrap,0);
}

// Cache shuffled questions to avoid passing data through onclick attrs
const SQ_CACHE={};

function renderQuestion(qid,qs,wrap,idx){
  const sq=shuffleQ(qs[idx],idx+(qid==='exam'?100:qid==='qz5'?40:0));
  const cacheKey=qid+'_'+idx;
  SQ_CACHE[cacheKey]=sq; // Store so ansQv2 can read without HTML injection
  const total=qs.length;
  const pct=Math.round(idx/total*100);
  const isLast=idx===total-1;
  wrap.innerHTML=`
  <div class="quiz-engine">
    <div class="quiz-counter">
      <span>Pregunta ${idx+1} de ${total}</span>
      <span class="quiz-lvl-badge">${sq.lv}</span>
    </div>
    <div class="quiz-progress-bar"><div class="quiz-progress-fill" id="${qid}-pfill" style="width:${pct}%"></div></div>
    <div class="quiz-q">${sq.q}</div>
    <div class="qopts" id="${qid}-opts">
      ${sq.opts.map((o,oi)=>`<button class="qo" id="${qid}_o${oi}" onclick="ansQv2('${qid}',${idx},${oi},${total})">${o}</button>`).join('')}
    </div>
    <div class="qfb" id="${qid}-fb"></div>
    <button class="quiz-next-btn" id="${qid}-next" onclick="nextQuestion('${qid}',${idx+1},${total})">
      ${isLast?'Ver resultados →':'Siguiente pregunta →'}
    </button>
  </div>`;
}

function ansQv2(qid,idx,sel,total){
  // Read question data from cache (avoids HTML injection via onclick)
  const cacheKey=qid+'_'+idx;
  const sq=SQ_CACHE[cacheKey]||{};
  const cor=sq.cor!==undefined?sq.cor:0;
  const exp=sq.exp||'';
  const lec=sq.lec||'';
  const key=qid+'_'+idx;
  if(QANS[key]!==undefined)return;
  QANS[key]={sel,cor,lec};

  // Visual feedback on options
  for(let i=0;i<4;i++){
    const btn=document.getElementById(qid+'_o'+i);
    if(btn)btn.disabled=true;
  }
  const selBtn=document.getElementById(qid+'_o'+sel);
  if(selBtn)selBtn.classList.add(sel===cor?'ok':'fail');
  // Do NOT reveal correct answer if wrong — just mark wrong

  // Feedback panel — no explanation, just lesson reference
  const fb=document.getElementById(qid+'-fb');
  if(fb){
    const isOk=sel===cor;
    const lecName=lec&&LEC_NAMES[lec]?LEC_NAMES[lec]:'';
    const reviewHtml=(!isOk&&lec)?`<div class="qfb-review">📖 Repasa: <a onclick="go('${lec}',nb('${lec}'))">${lecName}</a></div>`:'';
    fb.className='qfb on '+(isOk?'ok':'fail');
    fb.innerHTML=`<div class="qfb-result ${isOk?'ok-txt':'fail-txt'}">
      ${isOk?'✅ Correcto — aquí está el porqué:':'❌ Incorrecto — repasa:'}
    </div>${reviewHtml}`;
  }

  // Save result
  if(!QZ_STATE[qid])QZ_STATE[qid]={current:0,results:[],done:false};
  QZ_STATE[qid].results[idx]={sel,cor,lec};

  // Show next button
  const nextBtn=document.getElementById(qid+'-next');
  if(nextBtn)nextBtn.classList.add('show');

  // Update progress bar
  const fill=document.getElementById(qid+'-pfill');
  const pct=Math.round((idx+1)/total*100);
  if(fill)fill.style.width=pct+'%';
}

function nextQuestion(qid,nextIdx,total){
  const qs=getQS(qid);
  if(!qs)return;
  if(nextIdx>=total){
    showResults(qid,qs);
  } else {
    const wrap=document.getElementById(qid+'-wrap') ||
               document.getElementById((qid==='exam'?'exam':qid)+'-wrap');
    if(wrap)renderQuestion(qid,qs,wrap,nextIdx);
  }
}

function showResults(qid,qs){
  const state=QZ_STATE[qid];
  if(!state)return;
  state.done=true;
  const results=state.results||[];
  let correct=0;
  const wrongItems=[];
  qs.forEach((q,i)=>{
    const r=results[i]||QANS[qid+'_'+i];
    if(r&&r.sel===r.cor){correct++;}
    else if(r&&r.lec){
      // Track unique lessons to review
      const lecName=LEC_NAMES[r.lec]||r.lec;
      if(!wrongItems.find(w=>w.lec===r.lec)){
        wrongItems.push({lec:r.lec,name:lecName});
      }
    }
  });
  const pct=Math.round(correct/qs.length*100);
  const pass=pct>=70;

  const wrap=document.getElementById(qid+'-wrap') ||
             document.getElementById((qid==='exam'?'exam':qid)+'-wrap');
  if(!wrap)return;

  const reviewHtml=wrongItems.length>0?`
    <div style="margin-top:14px;font-size:12px;font-weight:600;color:var(--ink3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Lecciones para repasar:</div>
    <div class="quiz-review-list">
      ${wrongItems.map(w=>`<div class="quiz-review-item needs-review">
        <span class="qri-icon">📖</span>
        <span>Vuelve a <a class="qri-lec" onclick="go('${w.lec}',nb('${w.lec}'))">${w.name}</a></span>
      </div>`).join('')}
    </div>`:'<div style="color:var(--green);font-weight:600;margin-top:10px">✅ ¡Dominio completo! Todas las respuestas correctas.</div>';

  const retryBtn=`<button onclick="retryQuiz('${qid}')" style="margin-top:16px;padding:9px 18px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r);font-family:inherit;font-size:13px;cursor:pointer;color:var(--ink)">🔄 Repetir quiz</button>`;

  wrap.innerHTML=`<div class="quiz-engine">
    <div class="quiz-results show">
      <div class="quiz-results-score">${correct}/${qs.length}</div>
      <div class="quiz-results-pct">${pct}% · ${pass?'<span style=color:var(--green)>Aprobado ✅</span>':'<span style=color:var(--red)>Necesitas 70%</span>'}</div>
      <div style="height:8px;background:var(--s2);border-radius:4px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${pass?'var(--green)':'var(--red)'};border-radius:4px;transition:width .6s"></div></div>
      ${reviewHtml}
      ${retryBtn}
    </div>
  </div>`;

  // Mark quiz as complete for progress tracking
  if(!ST.v.includes(qid))ST.v.push(qid);
  updateProgress();

  // Update score displays (legacy compatibility)
  const sc=document.getElementById(qid+'-score');
  if(sc)sc.textContent=correct+'/'+qs.length+' ('+pct+'%). '+(pass?'¡Aprobado!':'Repasa las lecciones indicadas.');
  const res=document.getElementById(qid+'-res');if(res)res.style.display='block';
  const examNote=document.getElementById('exam-note');
  if(examNote&&qid==='exam'){examNote.className='note '+(pass?'green':'gold');examNote.innerHTML='<div class="note-hd">'+(pass?'🎓 ¡Bootcamp completado!':'📚 Sigue practicando')+'</div><p>Resultado: '+correct+'/'+qs.length+' ('+pct+'%). '+(pass?'¡Listo para producción!':'Repasa las lecciones marcadas y vuelve a intentarlo.')+'</p>';}
  const examRes=document.getElementById('exam-res');if(examRes&&qid==='exam')examRes.style.display='block';
}

function retryQuiz(qid){
  QZ_STATE[qid]={current:0,results:[],done:false};
  const qs=getQS(qid);
  const wrap=document.getElementById(qid+'-wrap');
  // Clear ALL QANS keys for this quiz (prevents blocking on retry)
  Object.keys(QANS).forEach(k=>{if(k.startsWith(qid+'_'))delete QANS[k];});
  // Also clear SQ_CACHE for this quiz
  Object.keys(SQ_CACHE).forEach(k=>{if(k.startsWith(qid+'_'))delete SQ_CACHE[k];});
  if(wrap&&qs)renderQuestion(qid,qs,wrap,0);
}

// Legacy ansQ — kept for backward compat but redirects to new system
function ansQ(quizId,qid,sel,cor,exp){
  // Extract index from qid (format: 'qzN_qI')
  const parts=qid.split('_q');
  const idx=parseInt(parts[1]||0);
  const total=getQS(quizId)?getQS(quizId).length:6;
  ansQv2(quizId,idx,sel,cor,exp,'',total);
}

function checkComplete(qid){
  // Now handled by showResults — kept for backward compat
}


// ═══ INIT ═══
document.addEventListener('DOMContentLoaded',()=>{
  updateProgress();
  // Attribution protection
  document.querySelectorAll('.author-block').forEach(el=>{
    el.addEventListener('contextmenu',e=>e.preventDefault());
    el.addEventListener('dragstart',e=>e.preventDefault());
  });
  try{renderExBrowser();}catch(e){console.error('renderExBrowser:',e);}
  try{renderQuizzes();}catch(e){console.error('renderQuizzes:',e);}
  try{updateCostCalc();}catch(e){}
  try{updateVolWidget();}catch(e){}
  setTimeout(()=>{try{calcROI();}catch(e){}},200);
  setTimeout(()=>{try{calcTAM();}catch(e){}},300);
  setTimeout(()=>{try{calcTAM2();}catch(e){}},350);
  setTimeout(addCopyButtons,150);
});
