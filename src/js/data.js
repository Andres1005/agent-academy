// =================================================================
// Agent Academy — Data Layer
// Quiz questions, example cases, constants, LEC_NAMES
// © 2026 Andrés Muñoz / Masiv Integrations
// Todos los derechos reservados.
//
// NOTE: This file is the source of truth for all quiz content.
// To edit questions: find const QS, QS_M3A, QS_M5, QS_M6, EXAM_QS
// Each question: { q, opts:[], cor (0-indexed), lv, exp, lec }
// =================================================================


// ═══ STATE — session memory only (no localStorage) ═══
const ST={v:[],tut:[],qs:{},readTime:{}};

// Progress tracking: pages that count toward progress
const M1_PAGES=['intro-ia','claude101','llms','rag','herramientas','ecosistema','costos','quiz1','cierre-m1'];
const M2_PAGES=['prompting','agentes','patrones','usos','plataformas','quiz2','cierre-m2'];
const M3A_PAGES=['mcp','mcp-usar','mcp-avanzado','subagentes','console-org','console-compilar','console','managed','skills','claude-code','cowork','quiz3a','cierre-m3a'];
const M3B_PAGES=['nocode','python','tam','ejercicios','ejemplos','quiz3','cierre-m3'];
const M5_PAGES=['bedrock-intro','bedrock-tech','bedrock-costos','bedrock-practica','bedrock-agents','quiz5','cierre-m5'];
const M6_PAGES=['vertex-intro','vertex-tech','vertex-practica','vertex-avanzado','quiz6','cierre-m6'];
const M3_PAGES=[...M3A_PAGES,...M3B_PAGES];
const M4_PAGES=['glosario','seg-datos','seg-api-vs-agents','seg-planes','seg-practicas','seg-advertencias','recursos','cierre-m4'];
const EXAM_PAGES=['examen'];
const COUNTED_PAGES=[...M1_PAGES,...M2_PAGES,...M3A_PAGES,...M3B_PAGES,...M5_PAGES,...M6_PAGES,...M4_PAGES,...EXAM_PAGES];
const MIN_READ_SECONDS = 8; // must spend at least 8s on a page for it to count

// Dark mode
function toggleDark(){
  const isDark=document.documentElement.classList.toggle('dark');
  const btn=document.getElementById('dark-btn');
  if(btn)btn.textContent=isDark?'☀️':'🌙';
}

// Progress update
function updateProgress(){
  const visited=ST.v.filter(p=>COUNTED_PAGES.includes(p));
  const total=COUNTED_PAGES.length;
  const pct=Math.round(visited.length/total*100);
  const fill=document.getElementById('prog-fill');
  const pctEl=document.getElementById('prog-pct');
  if(fill)fill.style.width=pct+'%';
  if(pctEl)pctEl.textContent=pct+'%';
  // Module bars
  const mods=[M1_PAGES,M2_PAGES,M3A_PAGES,M3B_PAGES,M5_PAGES,M6_PAGES,M4_PAGES];
  const pmids=['pm1','pm2','pm3','pm3b','pm5','pm6','pm4'];
  mods.forEach((mp,i)=>{
    const el=document.getElementById(pmids[i]);
    if(!el)return;
    const done=mp.filter(p=>visited.includes(p)).length;
    const all=mp.length;
    if(done===all)el.className='prog-m done';
    else if(done>0)el.className='prog-m partial';
    else el.className='prog-m';
  });
  // Mark sidebar buttons as done
  document.querySelectorAll('.nb').forEach(btn=>{
    const match=btn.getAttribute('onclick')||'';
    const m=match.match(/go\('([^']+)'/);
    if(m&&visited.includes(m[1])){btn.classList.add('done');}
  });
}

// ═══ ROUTER ═══
const ALL=['home','intro-ia','claude101','llms','rag','herramientas','ecosistema','costos','quiz1','cierre-m1','prompting','agentes','patrones','usos','plataformas','quiz2','cierre-m2','mcp','mcp-usar','mcp-avanzado','subagentes','console-org','console-compilar','console','managed','skills','claude-code','cowork','quiz3a','cierre-m3a','nocode','tam','python','ejercicios','ejemplos','quiz3','cierre-m3','bedrock-intro','bedrock-tech','bedrock-costos','bedrock-practica','bedrock-agents','quiz5','cierre-m5','vertex-intro','vertex-tech','vertex-practica','vertex-avanzado','quiz6','cierre-m6','glosario','seg-datos','seg-api-vs-agents','seg-planes','seg-practicas','seg-advertencias','recursos','cierre-m4','examen'];
let _readTimer=null; let _currentPage=null; let _arriveTime=0;
function go(id,el){
  if(_currentPage&&_arriveTime>0){const spent=(Date.now()-_arriveTime)/1000;if(spent>=MIN_READ_SECONDS&&COUNTED_PAGES.includes(_currentPage)&&!ST.v.includes(_currentPage)){ST.v.push(_currentPage);}}
  _currentPage=id;_arriveTime=Date.now();
  if(_readTimer)clearTimeout(_readTimer);
  const _capturedId=id;
  _readTimer=setTimeout(()=>{if(COUNTED_PAGES.includes(_capturedId)&&!ST.v.includes(_capturedId)){ST.v.push(_capturedId);updateProgress();}},MIN_READ_SECONDS*1000);
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.nb').forEach(b=>b.classList.remove('active'));
  const pg=document.getElementById('pg-'+id);
  if(pg)pg.classList.add('on');
  if(el&&el.classList)el.classList.add('active');
  window.scrollTo(0,0);
  updateProgress();requestAnimationFrame(addCopyButtons);
}

function nb(id){
  return document.querySelector('.nb[onclick*="go(\''+id+'\'"]')||null;
}

function toggleAcc(hd){hd.parentElement.classList.toggle('open');}
function toggleSidebar(){
  const sb=document.querySelector('.sidebar');
  const ov=document.getElementById('overlay');
  if(sb)sb.classList.toggle('mobile-open');
  if(ov)ov.classList.toggle('on');
}
function swTab(id,btn,g){
  const w=btn.closest('.wiz');
  if(!wiz)return;
  if(!w)return;
  w.querySelectorAll('.wt').forEach(b=>b.classList.remove('active'));
  w.querySelectorAll('.wp').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const pane=document.getElementById('tab-'+g+'-'+id);
  if(pane)pane.classList.add('active');
}
function toggleTut(i){
  const el=document.getElementById('tut_'+i);
  if(el)el.classList.toggle('open');
}
function toggleGi(id){
  const el=document.getElementById(id);
  if(el)el.classList.toggle('open');
}
function addCopyButtons(){
  document.querySelectorAll('.code').forEach(el=>{
    if(el.querySelector('.copy-btn'))return;
    const btn=document.createElement('button');
    btn.className='copy-btn';btn.textContent='Copiar';
    btn.onclick=()=>{
      const txt=el.innerText.replace('Copiar','').trim();
      navigator.clipboard.writeText(txt).then(()=>{
        btn.textContent='✓';setTimeout(()=>btn.textContent='Copiar',2000);
      }).catch(()=>{});
    };
    el.appendChild(btn);
  });
}

// ═══ CALCULADORAS ═══
function calcROI(){
  const g=id=>{const el=document.getElementById(id);return el?el:null;};
  if(!g('roi-hrs'))return;
  const hrs=+g('roi-hrs').value, docs=+g('roi-docs').value;
  const rate=+g('roi-rate').value, red=+g('roi-red').value/100;
  g('roi-hrs-v').textContent=hrs; g('roi-docs-v').textContent=docs;
  g('roi-rate-v').textContent=rate; g('roi-red-v').textContent=Math.round(red*100);
  const savedHrs=Math.round(hrs*docs*red);
  const savedUSD=savedHrs*rate;
  const aiCost=docs*0.15;
  const net=savedUSD-aiCost;
  const fmt=n=>n>=1000?'$'+(n/1000).toFixed(1)+'K':'$'+Math.round(n);
  if(g('roi-saved-hrs'))g('roi-saved-hrs').textContent=savedHrs+'h';
  if(g('roi-saved-usd'))g('roi-saved-usd').textContent=fmt(savedUSD);
  if(g('roi-ai-cost'))g('roi-ai-cost').textContent=fmt(aiCost);
  if(g('roi-net'))g('roi-net').textContent=fmt(net);
  const pb=g('roi-payback');
  if(pb){pb.style.display='block';const roi_x=Math.round(savedUSD/Math.max(aiCost,1));pb.innerHTML='<strong>Interpretación:</strong> El agente cuesta <strong>'+fmt(aiCost)+'/mes en IA</strong> y elimina trabajo que antes costaba <strong>'+fmt(savedUSD)+'/mes en tiempo humano</strong>. Retorno: <strong>'+roi_x+'×</strong>. Las <strong>'+savedHrs+' horas liberadas</strong> se usan en trabajo de mayor valor.';}
}
function calcTAM(){
  const g=id=>{const el=document.getElementById(id);return el?el:null;};
  if(!g('tam-docs'))return;
  const docs=+g('tam-docs').value, hrs=+g('tam-hrs').value;
  const rate=+g('tam-rate').value, team=+g('tam-team').value;
  if(g('tam-docs-v'))g('tam-docs-v').textContent=docs;
  if(g('tam-hrs-v'))g('tam-hrs-v').textContent=hrs;
  if(g('tam-rate-v'))g('tam-rate-v').textContent=rate;
  if(g('tam-team-v'))g('tam-team-v').textContent=team;
  const laborCost=hrs*docs*rate;
  const fmt=n=>n>=1000?'$'+(n/1000).toFixed(1)+'K':'$'+Math.round(n);
  const v1Save=Math.round(laborCost*0.50)-20;
  const v2Save=Math.round(laborCost*0.87)-35;
  const v3Save=Math.round(laborCost*0.93)-25;
  if(g('tam-v1-save'))g('tam-v1-save').textContent=fmt(v1Save);
  if(g('tam-v2-save'))g('tam-v2-save').textContent=fmt(v2Save);
  if(g('tam-v3-save'))g('tam-v3-save').textContent=fmt(v3Save);
  if(g('tam-v1-detail'))g('tam-v1-detail').textContent=Math.round(hrs*docs*0.50)+'h liberadas · Costo: $20/mes';
  if(g('tam-v2-detail'))g('tam-v2-detail').textContent=Math.round(hrs*docs*0.87)+'h liberadas · Costo: ~$35/mes';
  if(g('tam-v3-detail'))g('tam-v3-detail').textContent=Math.round(hrs*docs*0.93)+'h liberadas · Costo: ~$25/mes';
  const rec=g('tam-recommendation');
  if(rec){rec.style.display='block';
    if(docs<=20)rec.innerHTML='<strong>Recomendación:</strong> Con '+docs+' docs/mes, empieza con <strong>V1 (Claude Web)</strong>. Setup de 30 minutos, ahorro inmediato.';
    else if(docs<=80)rec.innerHTML='<strong>Recomendación:</strong> Con '+docs+' docs/mes, <strong>V2 (n8n + API)</strong> es el punto óptimo. Automatización casi completa, costo bajo.';
    else rec.innerHTML='<strong>Recomendación:</strong> Con '+docs+' docs/mes y '+team+' TAMs, <strong>V3 (Managed Agents)</strong> escala sin esfuerzo adicional.';
  }
}

// ═══ EJEMPLOS ═══
const EX=[
  {id:0,sc:'tb',sector:'Financiero',co:'NovaBanco Digital',type:'Fintech · 50K clientes',agent:'Agente de Cobranza',ch:'WhatsApp + SMS',model:'Claude Haiku 4.5',problema:'Demora de 3 días en primer contacto. Tasa de recuperación: 42%.',flujo:['Consulta diaria de pagos vencidos a las 8am','Recupera historial y perfil de cada cliente','Clasifica en 3 perfiles: empático, informativo, formal','Genera mensaje personalizado para cada cliente','Envía por canal óptimo según historial','Gestiona respuestas: si pide extensión, evalúa política','Actualiza CRM y genera reporte diario'],kpis:[{n:'67%',l:'recuperación (era 42%)'},{n:'-70%',l:'tiempo humano'},{n:'4h',l:'primer contacto (era 3 días)'}],value:'El equipo pasó de gestionar casos rutinarios a negociaciones complejas de alto valor.',tech:{apinote:'Los mensajes proactivos (negocio inicia el contacto fuera de ventana de 24h) requieren templates HSM aprobados por Meta. Mensajes reactivos (cliente escribió primero) permiten texto libre. Tu backend expone webhook HTTPS — Meta hace POST cuando llega un mensaje.',flow:[[{type:'usuario',label:'Cliente',sub:'WhatsApp'},{type:'canal',label:'Meta Cloud API'},{type:'harness',label:'Backend',sub:'webhook'},{type:'llm',label:'Claude Haiku'}],[{type:'llm',label:'Claude Haiku',sub:'Decide respuesta'},{type:'datos',label:'CRM',sub:'historial'},{type:'canal',label:'Meta Graph API'},{type:'usuario',label:'Cliente',sub:'recibe respuesta'}]],costos:[{v:'$0.0022',l:'por mensaje (Haiku)'},{v:'$22',l:'por 10K msgs/mes'},{v:'$0',l:'sesión (no Managed)'}]}},
  {id:1,sc:'tgr',sector:'Retail',co:'VerdeModa',type:'Cadena de moda · 8 tiendas',agent:'Recuperador de Carritos',ch:'WhatsApp + Email',model:'Claude Haiku 4.5',problema:'68% abandono de carrito. Email genérico: 3% de conversión.',flujo:['Detecta abandono 2h después de inactividad vía webhook Shopify','Consulta perfil: historial, canal preferido, respuestas previas','Analiza el carrito: tipo de productos, monto, stock','Genera mensaje único. Si monto alto + buen historial: envío gratis','Si no responde en 24h: segundo mensaje con oferta diferente','Si compra: cancela mensajes pendientes y registra conversión'],kpis:[{n:'18%',l:'conversión (era 3%)'},{n:'+22%',l:'valor pedido recuperado'},{n:'100%',l:'mensajes únicos por cliente'}],value:'La personalización basada en el perfil real triplica la conversión.',tech:{apinote:'Shopify emite el evento carts/abandoned cuando un carrito no procede al checkout. En n8n: nodo Webhook como trigger escuchando en ese endpoint. El payload incluye todos los productos y datos del cliente.',flow:[[{type:'datos',label:'Shopify',sub:'carts/abandoned'},{type:'harness',label:'n8n',sub:'webhook'},{type:'llm',label:'Claude Haiku',sub:'genera mensaje'}],[{type:'llm',label:'Claude Haiku'},{type:'canal',label:'WhatsApp / Email'},{type:'usuario',label:'Cliente',sub:'recibe oferta'}]],costos:[{v:'$0.0022',l:'por mensaje'},{v:'$0',l:'plataforma (n8n gratis)'},{v:'18%',l:'conversión vs 3% anterior'}]}},
  {id:2,sc:'tb',sector:'Financiero',co:'SeguroFácil',type:'Aseguradora digital',agent:'Agente de Reclamaciones',ch:'WhatsApp + Portal web',model:'Claude Sonnet 4.6',problema:'7 días promedio de procesamiento. 60% del tiempo: recopilación de documentos.',flujo:['Cliente reporta siniestro en lenguaje natural','Agente extrae tipo de siniestro con NLP','Solicita documentos específicos según el tipo','Valida que documentos estén completos y legibles','Crea expediente y asigna radicado','Notifica al cliente en cada cambio de estado'],kpis:[{n:'7→2',l:'días promedio resolución'},{n:'85%',l:'documentación completa 1ra vez'},{n:'+40%',l:'satisfacción cliente'}],value:'El ajustador humano recibe expedientes ya completos para decidir.',tech:{apinote:'Para recibir fotos de siniestros por WhatsApp, el webhook recibe el media_id del archivo. El harness hace GET a la API de Meta para obtener la URL temporal (expira en 5 min — descargarlo inmediatamente). Claude analiza la imagen directamente vía contenido base64.',flow:[[{type:'usuario',label:'Cliente',sub:'reporta siniestro'},{type:'canal',label:'WhatsApp API'},{type:'harness',label:'Backend'},{type:'llm',label:'Claude Sonnet',sub:'extrae datos'}],[{type:'llm',label:'Claude Sonnet',sub:'valida documentos'},{type:'datos',label:'Sistema de siniestros'},{type:'usuario',label:'Cliente',sub:'recibe radicado'}]],costos:[{v:'~$0.05',l:'por reclamación'},{v:'5 días',l:'ahorrados en procesamiento'},{v:'85%',l:'documentación completa'}]}},
  {id:3,sc:'tp',sector:'B2B Tech',co:'NeXLink Solutions',type:'Plataforma B2B · 12 TAMs',agent:'Asistente Documental TAM',ch:'Interfaz interna / n8n',model:'Claude Sonnet 4.6',problema:'3-8h por documento. Calidad variable entre TAMs.',flujo:['TAM completa formulario: cliente, producto, integraciones, canales, plazo','Agente consulta KB: proyectos similares, lecciones aprendidas','Aplica reglas de estimación S/M/L/XL','Genera SOW + FE + Plan de Pruebas en paralelo','Auto-chequeo: ¿faltan criterios de aceptación? ¿responsables definidos?','Guarda los 3 documentos en Drive en la carpeta del proyecto'],kpis:[{n:'-80%',l:'tiempo por documento'},{n:'100%',l:'consistencia entre TAMs'},{n:'3 docs',l:'en paralelo'},{n:'<5 min',l:'formulario a Drive'}],value:'El TAM más nuevo produce documentos de la misma calidad que el más experimentado.',tech:{apinote:'Los 3 documentos se generan con asyncio.gather() en paralelo — reduciendo el tiempo de 45s a ~15s. El agente usa Agent Skills: un SKILL.md con las reglas de estimación y los templates exactos. Los Skills se cargan automáticamente cuando Claude detecta una solicitud de documentación.',flow:[[{type:'usuario',label:'TAM',sub:'llena form'},{type:'harness',label:'n8n / Python'},{type:'llm',label:'Claude Sonnet',sub:'Agente TAM'}],[{type:'llm',label:'Claude Sonnet',sub:'genera 3 docs en paralelo'},{type:'datos',label:'Google Drive',sub:'guarda docs'},{type:'usuario',label:'TAM',sub:'recibe notificación'}]],costos:[{v:'~$0.15',l:'por ejecución completa'},{v:'$15',l:'por 100 docs/mes'},{v:'375h',l:'ahorradas/mes (100 docs × 3.75h)'}]}},
  {id:4,sc:'tr',sector:'Salud',co:'ClínicaSalud360',type:'Red de clínicas · 4 sedes',agent:'Reductor de Ausentismo',ch:'WhatsApp + SMS',model:'Claude Haiku 4.5',problema:'31% de no-show. Cada cita perdida = costo directo + agenda bloqueada.',flujo:['72h antes: recordatorio con médico, hora y sede','48h antes: solicita confirmación. Cancela → libera slot e invita lista de espera','24h antes: segundo intento si no confirmó','2h antes: recordatorio final con instrucciones específicas','Si no llega: marca en sistema y libera para emergencias','Post-consulta: agenda seguimiento si el médico lo indicó'],kpis:[{n:'11%',l:'no-show (era 31%)'},{n:'-40%',l:'lista de espera'},{n:'+15%',l:'ocupación real agenda'}],value:'El agente no solo recuerda — gestiona activamente la agenda liberando slots en tiempo real.',tech:{apinote:'Los recordatorios proactivos (clínica inicia el contacto) requieren templates HSM aprobados por Meta. El webhook de respuestas permite al agente procesar "SI" o "NO" en tiempo real y actualizar el sistema de agendamiento automáticamente.',flow:[[{type:'datos',label:'Sistema citas'},{type:'harness',label:'Scheduler',sub:'cron job'},{type:'llm',label:'Claude Haiku',sub:'genera recordatorio'}],[{type:'canal',label:'WhatsApp/SMS'},{type:'usuario',label:'Paciente',sub:'confirma'},{type:'datos',label:'Agenda',sub:'libera/confirma slot'}]],costos:[{v:'~$0.003',l:'por recordatorio'},{v:'$30',l:'por 10K recordatorios/mes'},{v:'20%',l:'reducción no-show'}]}},
  {id:5,sc:'to',sector:'Telecom',co:'ConectaNet',type:'Operador · 200K suscriptores',agent:'Atención Omnicanal IA',ch:'Chat + WhatsApp + App',model:'Haiku + Sonnet (router)',problema:'3.500 llamadas/día. 65% eran consultas repetitivas. Agentes humanos saturados.',flujo:['Cliente contacta por cualquier canal. Agente carga perfil completo','Haiku clasifica si el caso es simple o complejo','Simple (80%): Haiku responde directamente (saldo, estado, FAQ)','Complejo (20%): Sonnet con contexto completo y herramientas','Detecta señales de churn y activa protocolo de retención','Escala al humano SOLO cuando supera sus capacidades'],kpis:[{n:'68%',l:'tickets sin humano'},{n:'38 seg',l:'espera (era 7 min)'},{n:'+45%',l:'equipo en retención/ventas'}],value:'Contact center pasa de centro de costo a generador de valor.',tech:{apinote:'Router de complejidad: Haiku ($1/M) clasifica cada mensaje como simple/complejo. Simples van directo a Haiku para respuesta. Complejos escalan a Sonnet ($3/M). El ahorro vs usar Sonnet para todo: ~60% en costos de modelo.',flow:[[{type:'usuario',label:'Cliente'},{type:'harness',label:'Router'},{type:'llm',label:'Haiku',sub:'Clasificador'}],[{type:'llm',label:'Haiku',sub:'80% casos simples'},{type:'usuario',label:'Respuesta <2s'}],[{type:'llm',label:'Sonnet',sub:'20% casos complejos'},{type:'datos',label:'CRM / Red'},{type:'usuario',label:'Respuesta con contexto'}]],costos:[{v:'$0.0022',l:'caso simple (Haiku)'},{v:'$0.014',l:'caso complejo (Sonnet)'},{v:'$25-45',l:'por 10K mensajes/mes'}]}},
,
  {id:6,sc:'go',sector:'Gobierno / Sector Público',co:'Ministerio de Tecnología',type:'Atención ciudadana · 50K solicitudes/mes',agent:'Agente de Atención Ciudadana',ch:'WhatsApp Business',model:'Claude Sonnet 4.6',problema:'El ministerio recibía 50.000 solicitudes mensuales de ciudadanos con tiempos de respuesta de 5 días y alta variabilidad en la calidad. El equipo de atención de 40 personas era insuficiente y el costo por caso era $12 USD.',flujo:['Ciudadano envía solicitud por WhatsApp','Claude clasifica el tipo (trámite, queja, consulta, certificado)','Busca en base normativa y procedimientos vigentes','Genera respuesta formal con número de radicado y pasos siguientes','Registra en sistema de gestión documental y notifica al ciudadano'],kpis:[{n:'85%',l:'solicitudes resueltas sin agente humano'},{n:'5d→2h',l:'tiempo promedio de respuesta'},{n:'+41%',l:'satisfacción ciudadana (CSAT)'}],value:'$0.009/solicitud (vs $12 costo humano). ROI positivo desde el mes 3. Capacidad escalable sin aumentar planta.',tech:'WhatsApp Business API + Claude Sonnet 4.6 + n8n + sistema documental del ministerio'},
  {id:7,sc:'lo',sector:'Logística / Supply Chain',co:'Operadora Regional de Transporte',type:'Supply chain · 8K envíos/día',agent:'Agente de Gestión de Excepciones',ch:'SMS + WhatsApp',model:'Claude Haiku 4.5',problema:'Con 8.000 envíos diarios, el 12% presentaba excepciones (retrasos, dirección incorrecta, destinatario ausente). El equipo de coordinación de 15 personas tardaba 2 horas promedio en resolver cada excepción y los clientes llamaban constantemente preguntando por sus pedidos.',flujo:['Sistema TMS detecta excepción en tiempo real','Claude analiza el tipo de excepción y genera opciones de solución','Notifica al destinatario con las alternativas disponibles vía SMS/WhatsApp','Receptor confirma opción preferida o escala a coordinador','Claude actualiza el ETA en el sistema y notifica a todas las partes'],kpis:[{n:'-80%',l:'llamadas inbound de seguimiento'},{n:'8 min',l:'tiempo de resolución (era 2 horas)'},{n:'98%',l:'notificaciones entregadas a tiempo'}],value:'Ahorro de 3 FTEs en coordinación. ROI positivo desde el mes 2. Costo por excepción de $0.012 vs $8 costo humano.',tech:'SMS + WhatsApp + Claude Haiku 4.5 + webhook TMS + base de datos de rutas'}
];

function calcTAM2(){
  const g=id=>{const el=document.getElementById(id);return el?el:null;};
  if(!g('tam-docs-pg'))return;
  const docs=+g('tam-docs-pg').value, hrs=+g('tam-hrs-pg').value;
  const rate=+g('tam-rate-pg').value, team=+g('tam-team-pg').value;
  if(g('tam-docs-v'))g('tam-docs-v').textContent=docs;
  if(g('tam-hrs-v'))g('tam-hrs-v').textContent=hrs;
  if(g('tam-rate-v'))g('tam-rate-v').textContent=rate;
  if(g('tam-team-v'))g('tam-team-v').textContent=team;
  const laborCost=hrs*docs*rate;
  const fmt=n=>n>=1000?'$'+(n/1000).toFixed(1)+'K':'$'+Math.round(n);
  const v1Save=Math.round(laborCost*0.50)-20;
  const v2Save=Math.round(laborCost*0.87)-35;
  const v3Save=Math.round(laborCost*0.93)-25;
  if(g('tam-v1-save-pg'))g('tam-v1-save-pg').textContent=fmt(v1Save);
  if(g('tam-v2-save-pg'))g('tam-v2-save-pg').textContent=fmt(v2Save);
  if(g('tam-v3-save-pg'))g('tam-v3-save-pg').textContent=fmt(v3Save);
  if(g('tam-v1-detail'))g('tam-v1-detail').textContent=Math.round(hrs*docs*0.50)+'h liberadas · Costo: $20/mes';
  if(g('tam-v2-detail'))g('tam-v2-detail').textContent=Math.round(hrs*docs*0.87)+'h liberadas · Costo: ~$35/mes';
  if(g('tam-v3-detail'))g('tam-v3-detail').textContent=Math.round(hrs*docs*0.93)+'h liberadas · Costo: ~$25/mes';
  const rec=g('tam-recommendation-pg');
  if(rec){rec.style.display='block';
    if(docs<=20)rec.innerHTML='<strong>Recomendación:</strong> Con '+docs+' docs/mes, empieza con <strong>V1 (Claude Web)</strong>. Setup de 30 minutos, ahorro inmediato.';
    else if(docs<=80)rec.innerHTML='<strong>Recomendación:</strong> Con '+docs+' docs/mes, <strong>V2 (n8n + API)</strong> es el punto óptimo. Automatización casi completa, costo bajo.';
    else rec.innerHTML='<strong>Recomendación:</strong> Con '+docs+' docs/mes y '+team+' TAMs, <strong>V3 (Managed Agents)</strong> escala sin esfuerzo adicional.';
  }
}

// ═══ EJEMPLOS ═══


function buildTechView(tech){
  if(!tech)return '<p style="color:var(--ink3);font-size:13px">Vista técnica no disponible.</p>';
  let html='';
  if(tech.apinote){
    html+='<div class="exd-sl">Cómo funciona la integración</div>';
    html+='<div class="note blue" style="margin-bottom:14px"><div class="note-hd">Descripción técnica</div><p style="font-size:13px">'+tech.apinote+'</p></div>';
  }
  if(tech.flow&&tech.flow.length){
    html+='<div class="exd-sl">Flujo de datos</div><div style="margin:10px 0">';
    tech.flow.forEach(row=>{
      html+='<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:8px 0;padding:10px;background:var(--s1);border-radius:var(--r);border:1px solid var(--border)">';
      const colors={canal:'var(--teal-l)',llm:'var(--ink)',plataforma:'var(--gold-l)',datos:'var(--orange-l)',usuario:'var(--blue-l)',harness:'var(--purple-l)'};
      const borders={canal:'var(--teal-b)',llm:'#444',plataforma:'var(--gold-b)',datos:'var(--orange-b)',usuario:'var(--blue-b)',harness:'var(--purple-b)'};
      row.forEach((node,ni)=>{
        if(ni>0)html+='<span style="color:var(--ink3);font-size:14px">→</span>';
        const bg=colors[node.type]||'var(--s2)';
        const br=borders[node.type]||'var(--border)';
        const tc=node.type==='llm'?'#fff':'var(--ink)';
        html+='<div style="background:'+bg+';border:1px solid '+br+';border-radius:var(--r);padding:6px 10px;font-size:11.5px;font-family:\'Instrument Sans\',sans-serif;font-weight:600;color:'+tc+'">';
        html+=node.label;
        if(node.sub)html+='<div style="font-size:9px;opacity:.7;font-weight:400;margin-top:2px">'+node.sub+'</div>';
        html+='</div>';
      });
      html+='</div>';
    });
    html+='</div>';
  }
  if(tech.costos&&tech.costos.length){
    html+='<div class="exd-sl">Costo estimado</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;margin:8px 0">';
    tech.costos.forEach(item=>{
      html+='<div style="background:var(--s1);border:1px solid var(--border);border-radius:var(--r);padding:10px;text-align:center"><div style="font-family:\'Fraunces\',serif;font-size:18px;font-weight:700;color:var(--gold)">'+item.v+'</div><div style="font-size:10px;color:var(--ink3);line-height:1.3;margin-top:3px">'+item.l+'</div></div>';
    });
    html+='</div>';
  }
  return html;
}

function renderExBrowser(){
  const el=document.getElementById('exb');if(!el)return;
  const list=EX.map((ex,i)=>'<div class="eli '+(i===0?'active':'')+'" id="eli_'+i+'" onclick="showEx('+i+')"><div class="els">'+ex.sector+'</div><div class="eln">'+ex.co+'</div><div class="ela">'+ex.agent+'</div></div>').join('');
  el.innerHTML='<div class="ex-list">'+list+'</div><div class="ex-detail"><div class="ex-tabs"><button class="et active" onclick="swExTab(\'biz\',this)">Negocio</button><button class="et" onclick="swExTab(\'tech\',this)">Técnico</button></div><div class="epane active" id="ep-biz"></div><div class="epane" id="ep-tech"></div></div>';
  showEx(0);
}
function showEx(i){
  EX.forEach((_,idx)=>{const e=document.getElementById('eli_'+idx);if(e)e.classList.toggle('active',idx===i);});
  const ex=EX[i];
  if(!ex||!ex.flujo||!ex.kpis)return;
  document.getElementById('ep-biz').innerHTML='<div style="margin-bottom:10px"><span class="tag t'+ex.sc+'">'+ex.sector+'</span></div><div class="exd-t">'+ex.co+'</div><div class="exd-sub">'+ex.type+' · '+ex.agent+'</div><div class="exd-sl">El problema</div><p style="font-size:13px">'+ex.problema+'</p><div class="exd-sl">Flujo de funcionamiento</div><div>'+ex.flujo.map((s,idx)=>'<div class="flow-step"><span class="flow-n">'+String(idx+1).padStart(2,'0')+'</span><div>'+s+'</div></div>').join('')+'</div><div class="exd-sl" style="margin-top:14px">Resultados</div><div class="kpi-grid">'+ex.kpis.map(k=>'<div class="kpi"><div class="kpi-n">'+k.n+'</div><div class="kpi-l">'+k.l+'</div></div>').join('')+'</div><div class="exd-sl" style="margin-top:14px">Valor generado</div><div class="exd-val">'+ex.value+'</div>';
  document.getElementById('ep-tech').innerHTML=buildTechView(ex.tech);
}
function swExTab(id,btn){
  document.querySelectorAll('.et').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.epane').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('ep-'+id).classList.add('active');
}

// ═══ QUIZZES ═══
const QS={
  qz1:[
    {q:'Un LLM con temperatura 0.0 recibe el mismo prompt dos veces. ¿Qué ocurre?',opts:['A. Outputs completamente diferentes','B. El mismo output — comportamiento determinista','C. Un error — la temperatura no puede ser 0','D. Output aleatorio entre opciones probables'],cor:1,lv:'Básico',exp:'Temperatura 0 = siempre el token más probable. Para el mismo input, el output es idéntico. Esencial en agentes de producción.',lec:'llms'},
    {q:'Un SOW de 2.500 palabras en español produce aproximadamente cuántos tokens de output?',opts:['A. 2.500 tokens','B. 800 tokens','C. 3.750 tokens','D. 10.000 tokens'],cor:2,lv:'Básico',exp:'En español: ~1.5 tokens/palabra. 2.500 × 1.5 = 3.750 tokens. Con Sonnet ($15/M output) = $0.056 por SOW.',lec:'llms'},
    {q:'¿Por qué los output tokens cuestan más que los input tokens?',opts:['A. Porque son más largos siempre','B. Porque generarlos requiere 5× más cómputo que leer el input','C. Porque Anthropic los cobra más por política comercial','D. No cuestan más — ambos tienen el mismo precio'],cor:1,lv:'Básico',exp:'Leer (input) es escanear. Escribir (output) es calcular miles de probabilidades para cada token generado. Por eso el output cuesta 5× más en Claude Sonnet: $15/M vs $3/M input.',lec:'costos'},
    {q:'¿Cuál es la diferencia principal entre RAG y Fine-tuning?',opts:['A. RAG es más caro que Fine-tuning','B. Fine-tuning actualiza la knowledge base en tiempo real; RAG no','C. RAG busca documentos relevantes en tiempo de ejecución; Fine-tuning modifica los pesos del modelo en entrenamiento','D. No hay diferencia práctica — ambos logran el mismo resultado'],cor:2,lv:'Intermedio',exp:'RAG: en cada llamada busca los documentos relevantes e incluye en el contexto. Fine-tuning: reentrena el modelo con nuevos datos (proceso costoso y lento). Para knowledge bases dinámicas: siempre RAG.',lec:'rag'},
    {q:'La suscripción Pro de claude.ai ($20/mes) te da acceso a la API para usar en n8n. ¿Verdadero o falso?',opts:['A. Verdadero — la suscripción cubre todo el ecosistema Claude','B. Falso — la suscripción web y los créditos de API son productos completamente separados','C. Verdadero — pero solo para modelos Haiku','D. Depende del plan de n8n que tengas'],cor:1,lv:'Básico',exp:'Son dos productos independientes con facturación separada. La suscripción Pro cubre claude.ai en el navegador. Los créditos de API (cargados en console.anthropic.com) son para n8n, Python y Managed Agents.',lec:'llms'},
    {q:'¿Cuándo tiene sentido el Fine-tuning sobre el prompting y RAG?',opts:['A. Siempre que quieras que el modelo aprenda jerga de tu empresa','B. Cuando necesitas que el modelo acceda a documentos privados','C. Después de meses de prompting fallido para un estilo ultra-específico a altísimo volumen con cientos de ejemplos etiquetados','D. Siempre que el presupuesto lo permita'],cor:2,lv:'Aplicado',exp:'Fine-tuning solo supera al prompting en casos extremos: estilo muy rígido + volumen masivo + meses de prompting fallido + cientos de ejemplos etiquetados. Para el 95% de los casos: prompting + RAG es suficiente y 100× más barato.',lec:'ecosistema'},
  ],
  qz2:[
    {q:'ReAct significa literalmente:',opts:['A. Responsive + Active Computing','B. Reasoning + Acting — razonar y actuar','C. Reactive + Automated Tasks','D. Real-time + Action Trigger'],cor:1,lv:'Básico',exp:'ReAct = Reasoning + Acting. Paper de Google (2022). El agente razona explícitamente antes de actuar — reduce errores y hace el proceso auditable en los logs.',lec:'patrones'},
    {q:'Tu agente de clasificación devuelve JSON a veces y texto con JSON otras veces. Temperatura actual: 0.7. ¿Cuál es la solución correcta?',opts:['A. Cambiar a un modelo más avanzado','B. Temperatura 0.0 + instrucción explícita de solo JSON + parser con regex fallback','C. Aumentar max_tokens para dar más espacio','D. Agregar un nodo de validación después del agente'],cor:1,lv:'Intermedio',exp:'El trío correcto para Structured Outputs: (1) temperatura 0 para determinismo, (2) instrucción explícita "responde ÚNICAMENTE en JSON", (3) parser robusto con re.search para extraer JSON aunque haya texto extra.',lec:'patrones'},
    {q:'¿Cuándo es OBLIGATORIO implementar Human-in-the-loop en un agente?',opts:['A. Siempre que el agente use herramientas externas','B. Solo cuando el agente accede a bases de datos','C. Cuando el agente puede ejecutar acciones irreversibles: enviar emails masivos, modificar BD en producción, ejecutar transacciones','D. Nunca — reduce la autonomía del agente'],cor:2,lv:'Intermedio',exp:'Human-in-the-loop es obligatorio para acciones irreversibles. Un agente que puede eliminar registros o enviar 10.000 emails sin confirmación es un agente peligroso. Proponer → mostrar → confirmar → ejecutar.',lec:'prompting'},
    {q:'Tool Parallelism ocurre cuando:',opts:['A. Múltiples agentes trabajan simultáneamente','B. Claude devuelve múltiples bloques tool_use en un solo mensaje — el harness debe ejecutarlos en paralelo','C. n8n ejecuta múltiples flujos al mismo tiempo','D. El agente usa la misma herramienta varias veces'],cor:1,lv:'Intermedio',exp:'Claude puede devolver múltiples tool_use en una sola respuesta cuando las herramientas son independientes entre sí. El harness debe detectarlo y ejecutarlas con asyncio.gather(). Tiempo total = la herramienta más lenta.',lec:'agentes'},
    {q:'¿En qué situación conviene usar Extended Thinking (Claude Opus)?',opts:['A. Para todas las llamadas — siempre mejora la calidad','B. Para clasificar emails de soporte — es más preciso','C. Para análisis complejos de riesgo con múltiples variables donde la primera respuesta suele ser incorrecta','D. Para generar SOWs estándar — el output es más detallado'],cor:2,lv:'Aplicado',exp:'Extended Thinking consume tokens adicionales de razonamiento (cobrados como output — caro). Solo vale para problemas genuinamente difíciles: análisis de riesgo, decisiones con incertidumbre, problemas de lógica multi-paso. Para tareas estándar: Sonnet sin thinking.',lec:'patrones'},
    {q:'¿Cuál es la principal ventaja del patrón Tool Parallelism?',opts:['A. Reduce el número de herramientas del agente','B. Ejecuta múltiples herramientas simultáneamente con asyncio — reduce tiempo cuando son independientes entre sí','C. Garantiza orden fijo de ejecución','D. Solo funciona con Claude Opus'],cor:1,lv:'Intermedio',exp:'asyncio.gather() ejecuta herramientas en paralelo. CRM + inventario + calendario al mismo tiempo en vez de secuencialmente.',lec:'patrones'},
  ],
  qz3:[
    {q:'¿Cuál es la diferencia entre agent_id y session_id en Managed Agents?',opts:['A. Son lo mismo — términos intercambiables','B. agent_id es la definición reutilizable (model+system+tools); session_id identifica una ejecución específica que referencia ese agente','C. agent_id es para producción; session_id para desarrollo','D. Ambos se crean nuevos en cada ejecución'],cor:1,lv:'Básico',exp:'agent_id: permanente, identifica la definición del agente. Se crea una vez, se usa en miles de sesiones. session_id: único por ejecución, se crea cada vez que el agente corre. En Console → Sesiones puedes ver el historial de cada session_id.',lec:'mcp'},
    {q:'¿Para qué sirve el vault_id en Managed Agents?',opts:['A. Para identificar el container de ejecución del agente','B. Para guardar el historial de sesiones del agente','C. Para referenciar credenciales de terceros (Drive, Notion, CRM) de forma segura sin pasarlas en cada llamada','D. Para versionar el system prompt del agente'],cor:2,lv:'Básico',exp:'El vault almacena tokens OAuth y API keys. Es write-only — los tokens nunca se retornan en respuestas. Para un equipo: un vault_id por TAM con sus credenciales de Drive/Notion. Al crear la sesión, cada TAM pasa su vault_id.',lec:'console-org'},
    {q:'En n8n, Claude devuelve: "Aquí está: {cat: soporte, urgencia: alta}". Tu nodo Code falla con SyntaxError. ¿Solución?',opts:['A. Aumentar max_tokens para dar más espacio a Claude','B. Cambiar a Claude Sonnet que es más consistente','C. Usar raw.match(/\\{[\\s\\S]*\\}/) para extraer el JSON antes de JSON.parse()+temperatura 0 en el prompt','D. Agregar un nodo de espera antes del Code'],cor:2,lv:'Básico',exp:'Claude a veces añade texto alrededor del JSON. La regex /\\{[\\s\\S]*\\}/ extrae el primer objeto JSON ignorando el texto. Combinar con temperatura 0 e instrucción "responde ÚNICAMENTE en JSON" en el prompt.',lec:'skills'},
    {q:'¿Qué ventaja tiene pgvector sobre Pinecone para RAG?',opts:['A. pgvector es más rápido que Pinecone siempre','B. pgvector es una extensión de PostgreSQL — si ya tienes Postgres, no necesitas una BD vectorial adicional','C. pgvector no requiere calcular embeddings','D. pgvector es managed y Pinecone requiere self-hosting'],cor:1,lv:'Intermedio',exp:'pgvector extiende PostgreSQL con soporte vectorial. Si ya tienes una BD PostgreSQL en producción, agregar pgvector es trivial y evita gestionar un servicio adicional. Pinecone es managed pero introduce otro servicio que mantener.',lec:'nocode'},
    {q:'¿Cuánto cuesta aproximadamente atender 10.000 mensajes de WhatsApp al mes con Claude Haiku?',opts:['A. $0.15 — Haiku es casi gratuito','B. $220 — Haiku cobra por sesión adicional','C. ~$22 — ~$0.0022 por mensaje (1.550 tokens × $1/M input + 150 tokens × $5/M output)','D. $1.500 — WhatsApp cobra por mensaje adicional'],cor:2,lv:'Aplicado',exp:'Cálculo: 10.000 msgs × (1.400 input tokens × $1/M + 150 output tokens × $5/M) = 10.000 × ($0.0014 + $0.00075) = $21.50. La plataforma de WhatsApp tiene su propio costo adicional (Meta cobra por conversaciones, no mensajes).',lec:'python'},
    {q:'Un agente de producción lleva 2 horas en sesión activa de Managed Agents. ¿Cuánto ha costado solo la sesión (sin tokens)?',opts:['A. $0 — las sesiones son gratuitas','B. $0.16 — $0.08/hora × 2 horas','C. $0.80 — Managed Agents cobra $0.40/hora','D. $1.60 — el costo de sesión se duplica por hora adicional'],cor:1,lv:'Básico',exp:'$0.08/hora × 2 horas = $0.16 solo en costo de sesión (el container Linux). A esto se suman los tokens del modelo consumidos durante esas 2 horas.',lec:'costos'},
  ],
};

const QS_M5=[
  {q:'¿Cuál es la diferencia principal entre InvokeModel y Converse API en Bedrock?',opts:['A. InvokeModel es más rápido que Converse API','B. InvokeModel tiene formato específico por proveedor; Converse API usa el mismo formato para Claude, Llama, Nova y Mistral','C. Converse API solo funciona con Claude, no con otros modelos','D. InvokeModel es la versión nueva y Converse API la obsoleta'],cor:1,lv:'Básico',exp:'InvokeModel: cada proveedor tiene su propio formato de body — Claude usa anthropic_version, Llama usa prompt. Converse API: formato unificado para Claude, Nova, Llama y Mistral. Para multi-modelo, siempre usa Converse API.',lec:'bedrock-tech'},
  {q:'¿Por qué Claude requiere habilitación explícita en Vertex AI y no en la API directa de Anthropic?',opts:['A. Porque Vertex cobra más por Claude que Anthropic directamente','B. Porque Vertex es un intermediario — los modelos de socios como Anthropic requieren aceptar términos específicos por proyecto','C. Solo ciertos modelos de Claude están disponibles en Vertex','D. Porque Google y Anthropic son competidores directos'],cor:1,lv:'Básico',exp:'Vertex es una plataforma multi-proveedor. Los modelos de socios (Claude, Llama, Mistral) requieren que el usuario acepte los términos de cada proveedor dentro del proyecto de GCP. Sin este paso, las llamadas fallan con error de permisos.',lec:'vertex-intro'},
  {q:'Un equipo financiero en España debe procesar contratos con datos de clientes europeos sin que salgan de la UE. ¿Qué opción elegir?',opts:['A. API directa de Anthropic — la más simple','B. AWS Bedrock — tiene más modelos disponibles','C. Google Vertex AI con endpoint europe-west4 — procesa en Países Bajos','D. Cualquiera sirve — todas tienen opciones europeas equivalentes'],cor:2,lv:'Intermedio',exp:'Vertex AI con endpoint regional europe-west4 garantiza que el procesamiento queda en suelo europeo (Países Bajos). Es la solución más directa para GDPR estricto. La API directa de Anthropic procesa principalmente en EE.UU. Bedrock tiene endpoints europeos pero Vertex tiene mejor posicionamiento para cumplimiento europeo.',lec:'vertex-practica'},
  {q:'¿Qué tiene Google Vertex AI que no existe en Amazon Bedrock ni en la API directa de Anthropic?',opts:['A. Acceso a Claude Opus y Sonnet — exclusivos de Vertex','B. Generación de video (Veo 3) y música (Lyria) — únicos en el mercado','C. Mejor precio en Claude que en la API directa','D. Soporte para Managed Agents de Anthropic'],cor:1,lv:'Básico',exp:'Veo 3 (generación de video) y Lyria (generación de música) son exclusivos de Vertex AI. No existen en Bedrock ni en la API de Anthropic. Para casos que requieren generación de video o audio programáticamente, Vertex es la única opción cloud gestionada.',lec:'vertex-avanzado'},
  {q:'Masiv quiere desplegar el agente del equipo (con Vaults para Drive de cada TAM) en infraestructura de un cliente que solo usa AWS. ¿Qué problema existe?',opts:['A. Ninguno — Bedrock soporta todos los features de Anthropic incluyendo Managed Agents','B. Los Vaults y Managed Agents de Claude Console no están disponibles en Bedrock — el cliente tendría que gestionar credenciales de Drive en su propia infra','C. Claude Sonnet no está disponible en Bedrock, solo Claude Haiku','D. Bedrock tiene un costo 3x mayor que la API directa'],cor:1,lv:'Aplicado',exp:'Managed Agents (Console, Vaults, Sessions) son exclusivos de la plataforma directa de Anthropic. En Bedrock solo puedes usar Claude como modelo, no la infraestructura de agentes de Anthropic. El cliente tendría que implementar su propio sistema de gestión de credenciales.',lec:'bedrock-agents'},
  {q:'¿En cuál de estas situaciones Amazon Bedrock es CLARAMENTE superior a la API directa de Anthropic?',opts:['A. Cuando necesitas las últimas features de Claude el mismo día que salen','B. Cuando necesitas Managed Agents con Vaults para credenciales de usuarios','C. Cuando tu app corre en AWS Lambda y la política de seguridad prohíbe tráfico al internet público','D. Cuando el presupuesto de IA es muy limitado — Bedrock cuesta menos'],cor:2,lv:'Aplicado',exp:'Con AWS PrivateLink, el tráfico de Lambda a Claude en Bedrock no toca el internet público — permanece dentro de la VPC. Para empresas con política de zero internet egress (común en finanzas y healthcare en AWS), Bedrock es la única opción viable. La API directa siempre requiere salida al internet.',lec:'bedrock-costos'},
];


const QS_M3A=[
  {q:'¿Cuál es la diferencia principal entre un Tool Use propio y un servidor MCP?',opts:['A. MCP es más rápido que Tool Use en cualquier caso','B. Tool Use requiere implementar la lógica en tu código; MCP expone herramientas estandarizadas que cualquier cliente compatible puede usar sin modificar tu código','C. MCP solo funciona con Claude Desktop, no con la API','D. Tool Use y MCP son exactamente lo mismo con diferente nombre'],cor:1,lv:'Intermedio',exp:'Tool Use = defines la herramienta y su lógica en tu código. MCP = defines un servidor estándar que cualquier cliente MCP puede consumir.',lec:'mcp'},
  {q:'¿Qué ocurre si intentas usar un servidor MCP en claude.ai sin activarlo en la configuración?',opts:['A. Funciona automáticamente si el servidor está en el directorio oficial','B. Claude lo detecta y lo activa solo','C. El servidor no está disponible — MCP en claude.ai requiere activación explícita por cada servidor','D. Solo falla si el servidor no está en npmjs.com'],cor:2,lv:'Básico',exp:'MCP en claude.ai requiere activación manual por cada servidor. Sin este paso el servidor no está disponible en la conversación.',lec:'mcp-usar'},
  {q:'Un TAM tiene 3 proyectos de clientes simultáneos con diferentes presupuestos. ¿Cómo organizaría los Workspaces en Console?',opts:['A. Un solo Workspace con una API key compartida para todos','B. Un Workspace por proyecto con su propio spend limit y API key — así el consumo de cada cliente es independiente y auditable','C. Tres Workspaces bajo la misma API key con prefijos en el nombre del sistema prompt','D. Workspaces solo sirven para separar entornos dev/prod, no para clientes diferentes'],cor:1,lv:'Aplicado',exp:'Un Workspace por cliente permite spend limits independientes, API keys separadas, y trazabilidad por cliente en CloudTrail. El consumo de cada proyecto queda aislado.',lec:'console-org'},
  {q:'¿Por qué el Vault de Managed Agents es "write-only"?',opts:['A. Por limitación técnica — no se ha implementado la lectura todavía','B. Para reducir costos de almacenamiento en la plataforma de Anthropic','C. Porque si las credenciales fueran legibles, cualquier persona con acceso a la Console podría extraerlas — write-only garantiza que ni el equipo de Anthropic las puede leer','D. Solo es write-only en el plan Free; en Enterprise se pueden leer'],cor:2,lv:'Intermedio',exp:'Write-only es un principio de seguridad. Las credenciales se almacenan cifradas y solo el agente puede usarlas en tiempo de ejecución. Nadie, ni Anthropic, puede leerlas.',lec:'console'},
  {q:'¿Cuándo tiene más sentido usar un Agent Skill en lugar de incluir las instrucciones en el System Prompt?',opts:['A. Cuando las instrucciones son cortas — menos de 500 tokens','B. Cuando el agente necesita instrucciones especializadas para tipos de tarea específicos que no siempre ejecuta — así evitas cargar tokens innecesarios en cada llamada','C. Agent Skills y System Prompt tienen el mismo costo de tokens, no hay diferencia práctica','D. Solo cuando el System Prompt ya alcanzó el límite de 100.000 tokens'],cor:1,lv:'Aplicado',exp:'Un Skill se carga solo cuando se necesita. Si el agente genera SOWs el 30% del tiempo, cargar el Skill de SOW solo ese 30% ahorra tokens en el 70% de las llamadas donde no se usa.',lec:'skills'},
  {q:'¿Cuál de estas combinaciones describe correctamente los 4 IDs de un Managed Agent en producción?',opts:['A. model_id, prompt_id, user_id, request_id','B. agent_id (qué agente), environment_id (qué entorno), vault_id (qué credenciales), session_id (qué sesión del usuario)','C. workspace_id, skill_id, api_key_id, log_id','D. agent_id y environment_id son suficientes — vault_id y session_id son opcionales'],cor:1,lv:'Básico',exp:'Los 4 IDs son: agent_id (el agente específico), environment_id (prod/dev/staging), vault_id (dónde están las credenciales), session_id (contexto de conversación del usuario).',lec:'managed'},
];

const QS_M6=[
  {q:'¿Por qué Claude en Vertex AI NO está disponible por defecto?',opts:['A. Limitaciones técnicas de Google','B. Claude requiere aceptar términos de Anthropic dentro de cada proyecto de GCP en Model Garden','C. Solo disponible en Enterprise','D. Solo en EE.UU.'],cor:1,lv:'Básico',exp:'Gemini es nativo de Google. Claude es modelo de socio que requiere habilitación y términos por proyecto.',lec:'vertex-intro'},
  {q:'¿Cómo se instancia el cliente de Claude en Vertex vs la API directa?',opts:['A. Misma clase Anthropic() con API key diferente','B. AnthropicVertex(region, project_id) sin api_key — credenciales vienen de GCP (ADC)','C. Vertex no soporta streaming','D. SDK de Google, no el de Anthropic'],cor:1,lv:'Intermedio',exp:'AnthropicVertex(region, project_id) sin api_key. Credenciales ADC de GCP. Código idéntico al resto.',lec:'vertex-tech'},
  {q:'¿Qué endpoint de Vertex garantiza que datos no salgan de la UE (GDPR)?',opts:['A. us-central1','B. global','C. europe-west4 — procesamiento en suelo europeo','D. asia-southeast1'],cor:2,lv:'Aplicado',exp:'europe-west4 (Países Bajos) garantiza residencia en la UE. Global y us-central1 procesan principalmente en EE.UU.',lec:'vertex-tech'},
  {q:'¿Qué hace Grounding con Google Search en Vertex AI?',opts:['A. Mejora velocidad con caché','B. Ancla respuestas en resultados de búsqueda en tiempo real — información actualizada post-entrenamiento','C. También disponible en Bedrock y API directa','D. Solo funciona con Gemini'],cor:1,lv:'Intermedio',exp:'Grounding = respuestas ancladas en Google Search en tiempo real. Exclusivo de Vertex.',lec:'vertex-avanzado'},
  {q:'¿Qué tiene Vertex que NO existe en Bedrock ni en la API de Anthropic?',opts:['A. Prompt Caching','B. Batch API','C. Generación de video (Veo 3) y música (Lyria)','D. Managed Agents'],cor:2,lv:'Básico',exp:'Veo 3 y Lyria son exclusivos del ecosistema Google. Bedrock y la API de Anthropic no ofrecen video ni música.',lec:'vertex-intro'},
  {q:'¿Qué es el Vertex RAG Engine?',opts:['A. Igual a RAG propio con diferente nombre','B. Gestiona vectorización automática en Cloud Storage, vector store y consulta — sin código de embedding','C. Solo funciona con Gemini','D. Más caro que implementación propia'],cor:1,lv:'Intermedio',exp:'Vertex RAG Engine: Cloud Storage → Gecko vectoriza → consulta automática. Sin código de embedding. Similar a Bedrock Knowledge Bases.',lec:'vertex-avanzado'},
];

const EXAM_QS=[
  {q:'¿Cuánto cuesta generar un SOW de 2.500 palabras con Claude Sonnet 4.6 incluyendo el contexto de entrada?',opts:['A. $0.006','B. Aproximadamente $0.06 — ~1.500 tokens input ($0.0045) + ~3.750 tokens output ($0.056)','C. $0.45','D. $1.50'],cor:1,lv:'Básico',exp:'Input: 1.500 tokens × $3/M = $0.0045. Output: 3.750 tokens × $15/M = $0.056. Total: ~$0.06. El output domina el costo.',lec:'costos'},
  {q:'La temperatura recomendada para un agente que extrae datos de contratos en JSON es:',opts:['A. 0.9 — máxima creatividad','B. 0.5 — balance estándar','C. 0.0 — determinismo total','D. La temperatura no afecta la extracción'],cor:2,lv:'Básico',exp:'Extracción de datos = tarea determinista. Temperatura 0 garantiza que el mismo contrato siempre produzca el mismo JSON. Alta temperatura hace que los campos a veces aparezcan con nombres diferentes.',lec:'llms'},
  {q:'¿Qué hace stop_reason="tool_use" en la API de Claude?',opts:['A. Indica que la tarea fue completada exitosamente','B. Indica que Claude quiere invocar una herramienta — el harness debe ejecutarla y devolver el resultado antes de continuar','C. Indica un error en la definición de la herramienta','D. Indica que el contexto se llenó'],cor:1,lv:'Básico',exp:'tool_use = "necesito el resultado de esta herramienta". El harness ejecuta la función, devuelve el resultado como tool_result, y vuelve a llamar a la API. Repite hasta stop_reason="end_turn".',lec:'patrones'},
  {q:'¿Cuándo es RAG claramente superior al Fine-tuning?',opts:['A. Para todos los casos — el Fine-tuning ya no es relevante','B. Para conocimiento que cambia frecuentemente (políticas, catálogos, FAQs): actualiza en minutos vs semanas','C. Para estilos de escritura muy específicos a altísimo volumen','D. Fine-tuning es siempre superior — RAG es un workaround'],cor:1,lv:'Básico',exp:'RAG para conocimiento dinámico: actualizas los documentos en la base vectorial y el agente los accede inmediatamente. Fine-tuning para ese mismo caso costaría semanas y miles de dólares cada vez que cambien los documentos.',lec:'agentes'},
  {q:'¿Qué diferencia hay entre agent_id, environment_id, vault_id y session_id en Managed Agents?',opts:['A. Son nombres alternativos para el mismo concepto','B. agent_id (definición), environment_id (container de ejecución), vault_id (credenciales), session_id (instancia de ejecución específica)','C. Solo agent_id y session_id existen — los otros son opcionales','D. Todos se crean nuevos en cada ejecución del agente'],cor:1,lv:'Intermedio',exp:'Cuatro conceptos separados: el agente es la definición reutilizable. El environment es el container Linux configurado. El vault guarda credenciales de terceros de forma segura. La session es una ejecución específica que vincula los tres anteriores.',lec:'seg-planes'},
  {q:'¿Cuál es el beneficio principal del Prompt Caching para agentes con muchas llamadas?',opts:['A. Reduce el tiempo de respuesta a 0 segundos','B. Permite reutilizar el mismo system prompt al 10% del precio de input en llamadas repetidas — ahorro de hasta 90%','C. Elimina el costo de output tokens','D. Solo funciona con Claude Haiku'],cor:1,lv:'Intermedio',exp:'Cache reads: ~10% del precio input. Para 10.000 llamadas con system prompt de 2.000 tokens: sin cache $60/mes → con cache ~$6/mes. Cache write tiene un overhead del 25% del precio input, pero se amortiza rápidamente.',lec:'bedrock-intro'},
  {q:'Tu agente de soporte bancario empieza a dar consejos legales generales. Causa más probable:',opts:['A. El modelo cambió a una versión diferente','B. System prompt sin scope — no delimita qué temas puede y no puede abordar','C. La temperatura es demasiado alta','D. Falta de herramientas conectadas'],cor:1,lv:'Intermedio',exp:'Sin scope explícito, el LLM usa su conocimiento general libremente. Solución: restricciones negativas explícitas en el system prompt: "SOLO responde sobre productos de NovaBanco. Para cualquier otro tema indica que no puedes ayudar con eso."',lec:'mcp'},
  {q:'¿Cuál es el riesgo principal del "Shadow AI" en una empresa?',opts:['A. Que los empleados usen Claude demasiado y agoten los créditos','B. Que empleados usen cuentas personales (Pro) para trabajo: datos empresariales bajo términos de consumidor que permiten entrenamiento del modelo','C. Que Claude acceda a la red interna sin permiso','D. Que el agente procese emails personales de los empleados'],cor:1,lv:'Intermedio',exp:'Shadow AI = empleados usando cuentas personales Pro para trabajo empresarial. Desde sept 2025, Free/Pro/Max permiten entrenamiento con tus datos por defecto. Solución: Team plan con domain capture — asocia automáticamente emails corporativos a la cuenta empresarial.',lec:'console-org'},
  {q:'¿Qué hace el Summarization Loop en un agente con sesiones largas?',opts:['A. Resume las respuestas del agente para hacerlas más cortas','B. Cuando el historial supera cierto umbral de tokens, resume los turnos más antiguos con Haiku para liberar espacio en el contexto manteniendo la información relevante','C. Elimina el historial cuando la sesión termina','D. Comprime los documentos adjuntos para reducir tokens'],cor:1,lv:'Aplicado',exp:'En sesiones largas, el historial crece hasta llenar el contexto (200K tokens). El summarization loop: cuando el historial supera el 70% del contexto, usa Haiku (barato) para resumir los primeros 2/3 del historial. Preserva decisiones clave sin agotar el contexto.',lec:'patrones'},
  {q:'¿Cuál es la principal ventaja del patrón Tool Parallelism?',opts:['A. Reduce el número de herramientas del agente','B. Ejecuta múltiples herramientas simultáneamente con asyncio — reduce tiempo cuando son independientes entre sí','C. Garantiza orden fijo de ejecución','D. Solo funciona con Claude Opus'],cor:1,lv:'Intermedio',exp:'asyncio.gather() ejecuta herramientas en paralelo. CRM + inventario + calendario al mismo tiempo en vez de secuencialmente.',lec:'patrones'},
  {q:'¿Cuándo usar Claude Opus con Extended Thinking en lugar de Sonnet estándar?',opts:['A. Siempre — Opus siempre da mejores resultados','B. Para tareas simples de alto volumen donde necesitas consistencia','C. Para análisis complejos donde la primera respuesta suele ser incorrecta y el costo adicional está justificado por el impacto de la decisión','D. Cuando quieres ahorrar tokens — Opus es más eficiente'],cor:2,lv:'Aplicado',exp:'Extended Thinking cobra los tokens de razonamiento interno como output ($25/M). Justificado solo cuando el problema es genuinamente difícil y el costo de una respuesta incorrecta es alto (análisis de riesgo, contratos complejos). Para tareas estándar: Sonnet.',lec:'vertex-intro'},
  {q:'¿Qué diferencia a Managed Agents de usar la API clásica de mensajes?',opts:['A. Managed Agents es gratis; la API clásica se paga por token','B. Managed Agents gestiona automáticamente el container de ejecución, el estado de sesión, las credenciales de terceros y la trazabilidad — la API clásica requiere que tú construyas toda esa infraestructura','C. Managed Agents solo funciona con Claude Haiku','D. La API clásica tiene más herramientas disponibles que Managed Agents'],cor:1,lv:'Intermedio',exp:'API clásica: tú construyes el harness, el estado, el manejo de credenciales y el logging. Managed Agents: Anthropic gestiona los containers, el estado persiste entre sesiones, los vaults protegen las credenciales, y cada tool_call es visible en Console. A cambio: $0.08/hora de sesión activa.',lec:'skills'},
  {q:'¿Cuánto cuesta aproximadamente un mes de atención al cliente con 10K mensajes/mes en WhatsApp usando Claude Haiku?',opts:['A. $0.15 — casi gratuito','B. $220 — Haiku cobra por sesión','C. $22 — ~$0.0022 por mensaje','D. $1.500 — WhatsApp cobra por mensaje en Business API'],cor:2,lv:'Aplicado',exp:'$0.0022 por mensaje × 10.000 = $22/mes solo en tokens de Claude. A comparar con un agente humano: 10.000 mensajes a 50 msg/hora = 200 horas × $8/hora = $1.600/mes.',lec:'costos'},
  {q:'Para implementar RAG en producción con alta disponibilidad, ¿qué base vectorial usarías si ya tienes PostgreSQL?',opts:['A. Pinecone — es managed y más confiable','B. pgvector — extensión de PostgreSQL que añade soporte vectorial sin servicio adicional','C. ChromaDB — es open source y gratuito','D. FAISS — es la más rápida en todos los casos'],cor:1,lv:'Aplicado',exp:'pgvector si ya tienes Postgres: agrega soporte vectorial sin introducir otro servicio. Menos infra, menos puntos de fallo, facturación unificada. Pinecone si no tienes Postgres y prefieres fully-managed. ChromaDB para prototipos locales.',lec:'patrones'},
  {q:'¿Cuál es la estructura correcta para manejar Tool Parallelism en Python?',opts:['A. for tool in tool_calls: result = execute(tool) — secuencial estándar','B. asyncio.gather(*[execute_async(t) for t in tool_calls]) — todas simultáneas','C. threading.Thread para cada herramienta — múltiples hilos','D. Claude no soporta múltiples tools en una sola respuesta'],cor:1,lv:'Aplicado',exp:'asyncio.gather() es la forma correcta para I/O concurrente en Python. Las llamadas a APIs externas son I/O-bound — asyncio las maneja eficientemente. threading.Thread funciona pero es menos eficiente para I/O. El tiempo total = la herramienta más lenta.',lec:'bedrock-agents'},
];

// Quiz renderer
// ═══ QUIZ ENGINE — one question at a time ═══
const QANS={};
const LEC_NAMES={
  llms:'Cómo funcionan los LLMs',
  rag:'RAG, Fine-tuning y contexto',
  costos:'Tokens y costos',
  ecosistema:'Ecosistema y precios',
  prompting:'Prompt Engineering',
  agentes:'Arquitectura de Agentes',
  patrones:'Patrones avanzados 1-4',
  plataformas:'Claude vs GPT',
  'seg-planes':'Planes y privacidad',
  'seg-datos':'Seguridad de datos',
  'bedrock-intro':'AWS Bedrock — ¿Qué es?',
  'bedrock-tech':'Bedrock — Arquitectura',
  'bedrock-costos':'Bedrock — Costos y decisión',
  'bedrock-agents':'Bedrock Agents y Knowledge Bases',
  'vertex-intro':'Vertex AI — ¿Qué es?',
  'vertex-practica':'Vertex vs Bedrock vs API',
  'vertex-avanzado':'Vertex Avanzado',
  mcp:'MCP — ¿Qué es?',
  'mcp-usar':'MCP — Cómo conectar',
  'console-org':'Console — Workspaces',
  skills:'Agent Skills',
  nocode:'Sin código (n8n)',
  python:'Tutorial Python',
  tam:'Tu agente TAM',
  ejercicios:'Ejercicios prácticos'
};
// Per-quiz state: {current, results[], done}
const QZ_STATE={};

function getQS(qid){
  if(qid==='exam')return EXAM_QS;
  if(qid==='qz5')return QS_M5;
  if(qid==='qz3a')return QS_M3A;
  if(qid==='qz6')return QS_M6;
  return QS[qid]||null;
}

function esc(s){return s.replace(/'/g,"\\'")||'';}



function toggleComparison(type){
  const el=document.getElementById('comparison-detail');
  if(!el)return;
  const data={
    chatbot:{color:'var(--blue)',title:'💬 Cuándo usar un Chatbot',content:'Usa un chatbot cuando: (1) las preguntas tienen respuestas predefinidas en un catálogo, (2) no necesitas acceder a sistemas externos en tiempo real, (3) el flujo es siempre pregunta-respuesta simple. <strong>No uses un chatbot</strong> si las respuestas requieren lógica compleja o acceso a múltiples fuentes.'},
    workflow:{color:'var(--orange)',title:'🔄 Cuándo usar un Workflow',content:'Usa un workflow cuando: (1) los pasos son siempre los mismos, (2) cada paso depende del anterior de forma predecible, (3) no necesitas que la IA decida qué hacer a continuación. <strong>No uses un workflow</strong> si las excepciones son frecuentes o si el proceso varía según el contexto.'},
    agente:{color:'var(--teal)',title:'🤖 Cuándo usar un Agente',content:'Usa un agente cuando: (1) los pasos no son predecibles de antemano, (2) la IA necesita decidir qué herramientas usar según el contexto, (3) el problema requiere razonamiento iterativo. <strong>No uses un agente</strong> si el flujo es simple y predecible — añades complejidad innecesaria.'},
  };
  const d=data[type];
  if(el.dataset.open===type){el.style.display='none';el.dataset.open='';return;}
  el.dataset.open=type;
  el.style.display='block';
  el.style.borderColor=d.color;
  el.innerHTML='<div style="font-weight:700;color:'+d.color+';margin-bottom:8px">'+d.title+'</div><div style="font-size:13px;line-height:1.7">'+d.content+'</div>';
}

function updateVolWidget(){
  const el=document.getElementById('vol-docs');
  if(!el)return;
  const docs=parseInt(el.value);
  document.getElementById('vol-docs-val').textContent=docs+' documentos/semana';
  // Costs: SOW = ~2000 tokens input + 3000 output with Sonnet = ~$0.054/doc
  const tokCost=docs*0.054*4; // monthly (4 weeks)
  // Managed: ~15min/doc * 0.08/hr = $0.02/doc + tokens
  const maCost=docs*(0.02+0.054)*4;
  const apiExtra=docs<20?'Sin costo fijo':'Considera caché para reducir';
  const maExtra=docs<20?'Sessions y Vault incluidos':'Infraestructura gestionada';
  document.getElementById('vol-api-detail').innerHTML='Solo tokens consumidos<br>'+apiExtra+'<br>Tú gestionas credenciales';
  document.getElementById('vol-ma-detail').innerHTML='Tokens + $0.08/hr sesión<br>'+maExtra+'<br>Vault write-only incluido';
  document.getElementById('vol-api-cost').textContent='~$'+tokCost.toFixed(0)+'/mes';
  document.getElementById('vol-ma-cost').textContent='~$'+maCost.toFixed(0)+'/mes';
  const rec=document.getElementById('vol-recommendation');
  if(docs<=15){rec.style.background='#e8f5e9';rec.style.color='#2e7d32';rec.textContent='✅ Recomendado a este volumen: API directa. El costo de Managed Agents no se justifica todavía.';}
  else if(docs<=50){rec.style.background='#fff3e0';rec.style.color='#e65100';rec.textContent='⚖️ Zona mixta: API si tienes equipo técnico, Managed Agents si quieres menos mantenimiento.';}
  else{rec.style.background='#e3f2fd';rec.style.color='#1565c0';rec.textContent='🤖 Recomendado a este volumen: Managed Agents. La reducción de mantenimiento y la gestión de credenciales justifican el costo.';}
}

function updateCostCalc(){
  const modelEl=document.getElementById('cost-model');
  const taskEl=document.getElementById('cost-task');
  const dailyEl=document.getElementById('cost-daily');
  const daysEl=document.getElementById('cost-days');
  if(!modelEl)return;
  const [inPrice,outPrice]=modelEl.value.split(',').map(Number);
  const [inTok,outTok]=taskEl.value.split(',').map(Number);
  const daily=parseInt(dailyEl.value);
  const days=parseInt(daysEl.value);
  document.getElementById('cost-daily-val').textContent=daily+' llamadas/día';
  document.getElementById('cost-days-val').textContent=days+' días/mes';
  const perCall=inTok/1e6*inPrice + outTok/1e6*outPrice;
  const dailyTotal=perCall*daily;
  const monthly=dailyTotal*days;
  document.getElementById('cost-per-call').textContent='$'+perCall.toFixed(4);
  document.getElementById('cost-daily-total').textContent='$'+dailyTotal.toFixed(2);
  document.getElementById('cost-monthly').textContent='$'+monthly.toFixed(2);
  const ctx=monthly<1?'Costo muy bajo — adecuado para prototipo o uso individual.':monthly<10?'Costo bajo — viable para equipo pequeño.':monthly<50?'Costo moderado — considera Prompt Caching para reducirlo.':'Costo significativo — evalúa Batch API (50% off) o modelos más económicos.';
  document.getElementById('cost-context').textContent='💡 '+ctx;
}