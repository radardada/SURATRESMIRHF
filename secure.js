const USER = "admin";
const CODE_HASH = "a1b2c3";
const PASS_HASH = "x9y8z7";

function hash(x){ return btoa(x).substring(0,6); }

function step1(){
  const u = document.getElementById('user').value;
  const c = hash(document.getElementById('code').value);
  if(u === USER && c === CODE_HASH){
    sessionStorage.setItem('lv1','ok');
    location.href = 'verify.html';
  } else alert('Akses Ditolak');
}

function step2(){
  const p = hash(document.getElementById('pass').value);
  if(sessionStorage.getItem('lv1') && p === PASS_HASH){
    location.href = 'files.html';
  } else alert('Verifikasi gagal');
}
