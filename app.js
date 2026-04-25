// 1) ใส่ค่า Supabase ของคุณตรงนี้หลังสร้างโปรเจกต์
const SUPABASE_URL = "https://mrakcyiyztqrldnmgemy.supabase.co";
const SUPABASE_ANON_KEY = sb_publishable_JNIBifUx3oqIhLSaVFG_sw_fXkS_I15
const hasSupabase = !SUPABASE_URL.includes('PASTE_');
const supabaseClient = hasSupabase ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const demoRows = [
  {seller_name:'สมชาย ใจดี',mill_name:'XYZ ปาล์มน้ำมัน',price:4.90,net_weight:7430,district:'คลองท่อม',created_at:'19/05 08:45'},
  {seller_name:'วิชัย เกษตรกร',mill_name:'ABC ปาล์ม',price:4.85,net_weight:6120,district:'คลองท่อม',created_at:'19/05 08:20'},
  {seller_name:'แพรัตน์ ฟาร์ม',mill_name:'ปาล์มรุ่งเรือง',price:4.80,net_weight:5300,district:'อ่าวลึก',created_at:'19/05 07:58'},
  {seller_name:'ประสิทธิ์ ทองดี',mill_name:'สุขนานาปาล์ม',price:4.75,net_weight:8100,district:'ปลายพระยา',created_at:'19/05 07:30'},
  {seller_name:'แดง โรงปาล์ม',mill_name:'กระบี่ปาล์มออยล์',price:4.65,net_weight:7200,district:'เมืองกระบี่',created_at:'19/05 07:15'}
];

document.getElementById('date').valueAsDate = new Date();
document.getElementById('time').value = new Date().toTimeString().slice(0,5);

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = document.getElementById('status');
  status.textContent = 'กำลังบันทึก...';

  const data = {
    seller_name: val('seller_name'),
    mill_name: val('mill_name'),
    price: Number(val('price')),
    gross_weight: Number(val('gross_weight')),
    net_weight: Number(val('net_weight')),
    district: val('district'),
    weigh_date: val('date'),
    weigh_time: val('time'),
    lat: null,
    lng: null,
  };

  if (navigator.geolocation) {
    try { const pos = await getLocation(); data.lat = pos.coords.latitude; data.lng = pos.coords.longitude; } catch(_){}
  }

  if (!hasSupabase) {
    demoRows.unshift({...data, created_at:'เมื่อสักครู่'});
    renderFeed(demoRows);
    status.textContent = 'บันทึกใน demo แล้ว (ยังไม่ได้ต่อ Supabase)';
    e.target.reset();
    return;
  }

  let imagePath = null;
  const file = document.getElementById('ticket').files[0];
  if (file) {
    imagePath = `tickets/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabaseClient.storage.from('ticket-images').upload(imagePath, file);
    if (uploadError) { status.textContent = 'อัปโหลดรูปไม่สำเร็จ: ' + uploadError.message; return; }
  }
  const { error } = await supabaseClient.from('transactions').insert([{...data, ticket_image_path:imagePath}]);
  if (error) status.textContent = 'บันทึกไม่สำเร็จ: ' + error.message;
  else { status.textContent = 'บันทึกสำเร็จ'; e.target.reset(); await loadTransactions(); }
});

function val(id){ return document.getElementById(id).value; }
function getLocation(){ return new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject)); }

async function loadTransactions(){
  if (!hasSupabase) { renderFeed(demoRows); return; }
  const { data, error } = await supabaseClient.from('transactions').select('*').order('created_at',{ascending:false}).limit(20);
  if (error) { document.getElementById('feedList').innerHTML = '<p>โหลดข้อมูลไม่สำเร็จ</p>'; return; }
  renderFeed(data);
}
function renderFeed(rows){
  document.getElementById('feedList').innerHTML = rows.map(r=>`<div class="feedItem"><div class="avatar">👨‍🌾</div><div><b>${r.seller_name||'-'}</b><br><small>ลาน ${r.mill_name||'-'}</small></div><div class="price">${Number(r.price).toFixed(2)}</div><div>${Number(r.net_weight||0).toLocaleString()} กก.<br><small>${r.created_at||''}</small></div><div class="district">📍 ${r.district||'-'}</div></div>`).join('');
  const prices = rows.map(r=>Number(r.price)).filter(Boolean);
  if (prices.length) document.getElementById('avgPrice').textContent = (prices.reduce((a,b)=>a+b,0)/prices.length).toFixed(2);
}
loadTransactions();
