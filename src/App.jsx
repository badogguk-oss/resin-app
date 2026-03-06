import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

const C = {
  bg:'#F7F3EE', surface:'#FFFFFF', card:'#FFFCF8',
  border:'#E8DDD0', border2:'#D4C4B0',
  amber:'#B8722A', amberL:'#FDF3E3', amberD:'#7A4A10',
  gold:'#C9961E', goldL:'#FEF6E0',
  teal:'#2A7070', tealL:'#E4F0F0',
  rose:'#B54040', roseL:'#FDEAEA',
  sage:'#4A7050', sageL:'#EAF2EA',
  purple:'#6B4E8A', purpleL:'#F3EEF8',
  text:'#2C1F10', text2:'#7A6040', text3:'#B09878',
}
const idr = n => 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(n||0))
const genId = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)+Date.now())
const pct = n => ((n||0)*100).toFixed(1)+'%'
const clamp = (n,a,b) => Math.min(b,Math.max(a,n))

function useIsMobile() {
  const [m,setM]=useState(window.innerWidth<768)
  useEffect(()=>{const fn=()=>setM(window.innerWidth<768);window.addEventListener('resize',fn);return()=>window.removeEventListener('resize',fn)},[])
  return m
}

const Ic=({p,s=18,c='currentColor',sw=1.8})=>(
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(p)?p:[p]).map((d,i)=><path key={i} d={d}/>)}
  </svg>
)
const I={
  home:['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z','M9 22V12h6v10'],
  user:['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2','M12 3a4 4 0 100 8 4 4 0 000-8z'],
  box:['M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z'],
  order:['M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2','M9 5a2 2 0 002 2h2a2 2 0 002-2','M9 12h6','M9 16h4'],
  money:['M12 2v20','M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'],
  tools:['M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z'],
  chart:['M18 20V10','M12 20V4','M6 20v-6'],
  plus:['M12 5v14','M5 12h14'],
  trash:['M3 6h18','M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6','M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2'],
  check:['M20 6L9 17l-5-5'],
  warn:['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z','M12 9v4','M12 17h.01'],
  clock:['M12 22a10 10 0 100-20 10 10 0 000 20z','M12 6v6l4 2'],
  trend:['M23 6l-9.5 9.5-5-5L1 18','M17 6h6v6'],
  logout:['M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4','M16 17l5-5-5-5','M21 12H9'],
  save:['M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z','M17 21v-8H7v8','M7 3v5h8'],
  sync:['M23 4v6h-6','M1 20v-6h6','M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15'],
  eye:['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 100 6 3 3 0 000-6z'],
  eyeoff:['M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24','M1 1l22 22'],
}

const Lbl=({children})=>(<span style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',color:C.text2,textTransform:'uppercase',display:'block',marginBottom:5}}>{children}</span>)

const Inp=({label,value,onChange,type='text',ph='',pre,suf,rows,disabled,autoComplete})=>{
  const [sp,setSp]=useState(false)
  const isP=type==='password'
  return(
    <div style={{display:'flex',flexDirection:'column',gap:4}}>
      {label&&<Lbl>{label}</Lbl>}
      <div style={{position:'relative',display:'flex',alignItems:rows?'flex-start':'center'}}>
        {pre&&<span style={{position:'absolute',left:10,fontSize:12,color:C.text3,pointerEvents:'none',top:rows?11:'50%',transform:rows?'none':'translateY(-50%)'}}>{pre}</span>}
        {rows
          ?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} rows={rows} disabled={disabled} style={{width:'100%',padding:'9px 11px',border:`1.5px solid ${C.border2}`,borderRadius:8,background:disabled?C.bg:C.surface,color:C.text,fontFamily:'inherit',fontSize:13,outline:'none',resize:'vertical',lineHeight:1.6}}/>
          :<input type={isP?(sp?'text':'password'):type} value={value} onChange={e=>onChange(type==='number'?(parseFloat(e.target.value)||0):e.target.value)} placeholder={ph} disabled={disabled} autoComplete={autoComplete} style={{width:'100%',padding:`9px ${(suf||isP)?'38px':'11px'} 9px ${pre?'32px':'11px'}`,border:`1.5px solid ${C.border2}`,borderRadius:8,background:disabled?C.bg:C.surface,color:C.text,fontFamily:'inherit',fontSize:13,outline:'none'}}/>
        }
        {isP&&<button type="button" onClick={()=>setSp(v=>!v)} style={{position:'absolute',right:10,background:'none',border:'none',cursor:'pointer',color:C.text3,display:'flex',alignItems:'center',top:'50%',transform:'translateY(-50%)'}}><Ic p={sp?I.eyeoff:I.eye} s={15}/></button>}
        {suf&&!isP&&<span style={{position:'absolute',right:10,fontSize:12,color:C.text3,pointerEvents:'none'}}>{suf}</span>}
      </div>
    </div>
  )
}

const Pill=({color,bg,children})=>(<span style={{fontSize:10,fontWeight:700,color,background:bg,padding:'2px 9px',borderRadius:20,letterSpacing:'0.05em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{children}</span>)
const Bar=({val,max,color,h=5})=>(<div style={{height:h,background:C.border,borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',width:clamp(max?val/max*100:0,0,100)+'%',background:color,borderRadius:3,transition:'width .5s'}}/></div>)
const KPI=({label,value,sub,color,icon})=>(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:'14px 16px',borderTop:`3px solid ${color}`}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}><div style={{flex:1,minWidth:0}}><div style={{fontSize:10,fontWeight:700,color:C.text2,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>{label}</div><div style={{fontSize:16,fontWeight:900,color,wordBreak:'break-all'}}>{value}</div>{sub&&<div style={{fontSize:11,color:C.text3,marginTop:3}}>{sub}</div>}</div>{icon&&<div style={{color,opacity:0.3,flexShrink:0,marginLeft:8}}><Ic p={icon} s={18}/></div>}</div></div>)
const SH=({icon,title,sub,color=C.amber})=>(<div style={{borderLeft:`3px solid ${color}`,paddingLeft:14,marginBottom:20}}><div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>{icon&&<Ic p={icon} s={17} c={color}/>}<span style={{fontSize:18,fontWeight:900,color:C.text}}>{title}</span></div>{sub&&<div style={{fontSize:13,color:C.text2,marginTop:2}}>{sub}</div>}</div>)
const DelBtn=({onClick})=>(<button onClick={onClick} style={{width:30,height:30,borderRadius:6,border:'none',background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.text3,flexShrink:0}} onMouseOver={e=>{e.currentTarget.style.color=C.rose;e.currentTarget.style.background=C.roseL}} onMouseOut={e=>{e.currentTarget.style.color=C.text3;e.currentTarget.style.background='transparent'}}><Ic p={I.trash} s={14}/></button>)
const AddBtn=({onClick,label,color=C.amber})=>(<button onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 14px',border:`1.5px dashed ${C.border2}`,borderRadius:8,background:'transparent',color:C.text2,cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:'inherit'}} onMouseOver={e=>{e.currentTarget.style.borderColor=color;e.currentTarget.style.color=color}} onMouseOut={e=>{e.currentTarget.style.borderColor=C.border2;e.currentTarget.style.color=C.text2}}><Ic p={I.plus} s={13}/> {label}</button>)
const Spinner=({size=32,pad=40})=>(<div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:pad}}><div style={{width:size,height:size,border:`3px solid ${C.border}`,borderTop:`3px solid ${C.amber}`,borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/></div>)
const Toast=({msg,type='success'})=>(<div style={{position:'fixed',bottom:90,left:'50%',transform:'translateX(-50%)',zIndex:9999,background:type==='error'?C.rose:C.sage,color:'#fff',padding:'11px 20px',borderRadius:30,fontSize:13,fontWeight:700,boxShadow:'0 4px 20px rgba(0,0,0,0.2)',display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap',animation:'slideUp .3s ease'}}><Ic p={type==='error'?I.warn:I.check} s={15} c="#fff"/> {msg}</div>)

const GoogleLogo=()=>(<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>)

// AUTH PAGE
const AuthPage=()=>{
  const [mode,setMode]=useState('login')
  const [email,setEmail]=useState('')
  const [pass,setPass]=useState('')
  const [nama,setNama]=useState('')
  const [loading,setLoading]=useState(false)
  const [gLoad,setGLoad]=useState(false)
  const [err,setErr]=useState('')
  const [info,setInfo]=useState('')
  const clear=()=>{setErr('');setInfo('')}

  const loginGoogle=async()=>{
    clear();setGLoad(true)
    const{error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin}})
    if(error){setErr('Gagal login Google: '+error.message);setGLoad(false)}
  }

  const submit=async()=>{
    clear()
    if(!email.trim())return setErr('Email wajib diisi')
    if(pass.length<6)return setErr('Password minimal 6 karakter')
    if(mode==='register'&&!nama.trim())return setErr('Nama wajib diisi')
    setLoading(true)
    try{
      if(mode==='login'){
        const{error}=await supabase.auth.signInWithPassword({email:email.trim(),password:pass})
        if(error)throw error
      }else{
        const{data,error}=await supabase.auth.signUp({email:email.trim(),password:pass,options:{data:{nama:nama.trim()}}})
        if(error)throw error
        if(!data.session){setInfo('Cek email kamu untuk konfirmasi, lalu masuk di sini.');setMode('login')}
      }
    }catch(e){
      const m=e.message||''
      if(m.includes('Invalid login credentials'))setErr('Email atau password salah.')
      else if(m.includes('Email not confirmed'))setErr('Konfirmasi email dulu. Cek inbox/spam.')
      else if(m.includes('User already registered'))setErr('Email sudah terdaftar. Silakan masuk.')
      else setErr(m||'Terjadi kesalahan.')
    }
    setLoading(false)
  }

  return(
    <div style={{minHeight:'100vh',background:`linear-gradient(135deg,${C.amberL},${C.bg} 60%)`,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{width:'100%',maxWidth:400}}>
        <div style={{background:C.surface,borderRadius:20,padding:32,boxShadow:'0 8px 40px rgba(184,114,42,0.13)',border:`1px solid ${C.border}`}}>
          <div style={{textAlign:'center',marginBottom:28}}>
            <div style={{fontSize:48,marginBottom:8}}>🪬</div>
            <div style={{fontSize:22,fontWeight:900,color:C.text}}>Resin Planner</div>
            <div style={{fontSize:13,color:C.text2,marginTop:4}}>Bisnis resin art kamu, lebih terorganisir.</div>
          </div>
          <div style={{display:'flex',gap:4,marginBottom:22,background:C.bg,borderRadius:10,padding:4}}>
            {[['login','Masuk'],['register','Daftar']].map(([m,lbl])=>(
              <button key={m} onClick={()=>{setMode(m);clear()}} style={{flex:1,padding:'9px',border:'none',borderRadius:8,background:mode===m?C.surface:'transparent',color:mode===m?C.amber:C.text2,fontWeight:mode===m?800:500,fontSize:13,cursor:'pointer',fontFamily:'inherit',transition:'all .15s',boxShadow:mode===m?'0 2px 8px rgba(0,0,0,0.07)':'none'}}>{lbl}</button>
            ))}
          </div>
          <button onClick={loginGoogle} disabled={gLoad} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:10,padding:'11px',border:`1.5px solid ${C.border2}`,borderRadius:10,background:C.surface,color:C.text,fontSize:13,fontWeight:700,cursor:gLoad?'wait':'pointer',fontFamily:'inherit',marginBottom:16,transition:'all .15s'}} onMouseOver={e=>e.currentTarget.style.borderColor=C.amber} onMouseOut={e=>e.currentTarget.style.borderColor=C.border2}>
            {gLoad?<Spinner size={16} pad={0}/>:<GoogleLogo/>}
            {gLoad?'Menghubungkan...':'Lanjut dengan Google'}
          </button>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
            <div style={{flex:1,height:1,background:C.border}}/><span style={{fontSize:11,color:C.text3,fontWeight:600}}>atau dengan email</span><div style={{flex:1,height:1,background:C.border}}/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:13}}>
            {mode==='register'&&<Inp label="Nama Lengkap" value={nama} onChange={setNama} ph="Nama kamu" autoComplete="name"/>}
            <Inp label="Email" value={email} onChange={setEmail} type="email" ph="email@kamu.com" autoComplete="email"/>
            <Inp label="Password" value={pass} onChange={setPass} type="password" ph="Min. 6 karakter" autoComplete={mode==='login'?'current-password':'new-password'}/>
          </div>
          {err&&<div style={{marginTop:12,padding:'10px 13px',background:C.roseL,borderRadius:8,fontSize:12,color:C.rose,fontWeight:600,display:'flex',gap:7,alignItems:'flex-start'}}><Ic p={I.warn} s={14} c={C.rose}/>{err}</div>}
          {info&&<div style={{marginTop:12,padding:'10px 13px',background:C.sageL,borderRadius:8,fontSize:12,color:C.sage,fontWeight:600}}>✅ {info}</div>}
          <button onClick={submit} disabled={loading} style={{marginTop:18,width:'100%',padding:'13px',border:'none',borderRadius:10,background:C.amber,color:'#fff',fontSize:14,fontWeight:800,cursor:loading?'wait':'pointer',fontFamily:'inherit',opacity:loading?0.7:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            {loading?<><Spinner size={16} pad={0}/> Loading...</>:(mode==='login'?'🔑 Masuk':'✨ Buat Akun')}
          </button>
          {mode==='login'&&<button onClick={async()=>{if(!email.trim())return setErr('Isi email dulu.');clear();const{error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin});if(error)setErr(error.message);else setInfo('Link reset dikirim ke email kamu.');}} style={{marginTop:10,width:'100%',padding:'8px',border:'none',background:'transparent',color:C.text3,fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Lupa password?</button>}
        </div>
        <div style={{marginTop:14,textAlign:'center',fontSize:11,color:C.text3}}>🔒 Data tersimpan aman · Bisa akses dari HP manapun</div>
      </div>
    </div>
  )
}

// DASHBOARD
const PageDash=({produk,bahan,orders,operasional,modal,profile,isMobile})=>{
  const totalModal=(modal||[]).reduce((s,i)=>s+(i.harga||0),0)
  const totalOps=(operasional?.items||[]).reduce((s,i)=>s+(i.amt||0),0)
  const target=operasional?.targetomzet||0
  const labaBulan=target-totalOps
  const bep=labaBulan>0?Math.ceil(totalModal/labaBulan):0
  const stokRendah=(bahan||[]).filter(b=>b.stok<=b.min).length
  const pendingOrd=(orders||[]).filter(o=>o.status==='Proses').length
  const calcPrice=p=>{const t=(p.waktu||0)*(profile?.hargatenagaperjam||20000);const ov=((p.bahancost||0)+t)*((p.overhead||20)/100);const hpp=(p.bahancost||0)+t+ov;const j=hpp*(1+(p.markup||200)/100);return{profit:j-hpp,margin:j>0?(j-hpp)/j:0,hargaJual:j}}
  const top=[...(produk||[])].map(p=>({...p,...calcPrice(p)})).sort((a,b)=>b.margin-a.margin).slice(0,4)
  return(
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{background:`linear-gradient(135deg,${C.amber}22,${C.amberL})`,border:`1px solid ${C.border}`,borderRadius:16,padding:'18px 20px'}}>
        <div style={{fontSize:11,fontWeight:700,color:C.amber,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:4}}>🪬 Resin Planner</div>
        <div style={{fontSize:isMobile?17:21,fontWeight:900,color:C.text}}>{profile?.nama||<span style={{color:C.text3,fontStyle:'italic',fontWeight:400}}>Nama brand belum diisi</span>}</div>
        <div style={{display:'flex',gap:6,marginTop:8,flexWrap:'wrap'}}>
          <Pill color={C.amber} bg={C.amberL}>{profile?.strategi==='premium'?'🎨 Premium':profile?.strategi==='volume'?'📦 Volume':'⚡ Hybrid'}</Pill>
          {profile?.ig&&<Pill color={C.rose} bg={C.roseL}>@{profile.ig}</Pill>}
          {profile?.lokasi&&<Pill color={C.teal} bg={C.tealL}>📍{profile.lokasi}</Pill>}
        </div>
      </div>
      {stokRendah>0&&<div style={{background:C.roseL,border:`1px solid ${C.rose}44`,borderRadius:10,padding:'11px 14px',display:'flex',gap:8,alignItems:'center'}}><Ic p={I.warn} s={15} c={C.rose}/><span style={{fontSize:13,color:C.rose,fontWeight:700}}>{stokRendah} bahan hampir habis!</span></div>}
      {pendingOrd>0&&<div style={{background:C.tealL,border:`1px solid ${C.teal}44`,borderRadius:10,padding:'11px 14px',display:'flex',gap:8,alignItems:'center'}}><Ic p={I.order} s={15} c={C.teal}/><span style={{fontSize:13,color:C.teal,fontWeight:700}}>{pendingOrd} order sedang diproses</span></div>}
      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:10}}>
        <KPI label="Modal Awal" value={idr(totalModal)} color={C.amber} icon={I.chart}/>
        <KPI label="Target Omzet/Bln" value={idr(target)} color={C.sage} icon={I.trend}/>
        <KPI label="Laba Proyeksi" value={idr(labaBulan)} color={labaBulan>=0?C.teal:C.rose} sub={`Margin ${target>0?pct(labaBulan/target):'–'}`} icon={I.money}/>
        <KPI label="Break Even" value={bep>0?`Bln ke-${bep}`:'–'} color={C.gold} icon={I.clock}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:14}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16}}>
          <div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:12}}>🏆 Produk Margin Terbaik</div>
          {top.length===0?<div style={{fontSize:13,color:C.text3,fontStyle:'italic'}}>Belum ada produk</div>:top.map(p=>(
            <div key={p.id} style={{marginBottom:12}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:600,color:C.text}}>{p.nama||'(tanpa nama)'}</span>
                <span style={{fontSize:12,fontWeight:700,color:p.line==='premium'?C.purple:C.teal}}>+{idr(p.profit)}</span>
              </div>
              <Bar val={p.margin} max={1} color={p.margin>0.5?C.sage:p.margin>0.3?C.amber:C.rose}/>
              <div style={{fontSize:10,color:C.text3,marginTop:2}}>Margin {pct(p.margin)} · {idr(p.hargaJual)}/pcs</div>
            </div>
          ))}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16}}>
          <div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:12}}>📦 Status Stok Bahan</div>
          {(bahan||[]).length===0?<div style={{fontSize:13,color:C.text3,fontStyle:'italic'}}>Belum ada data bahan</div>:(bahan||[]).slice(0,5).map(b=>{
            const low=b.stok<=b.min
            return(<div key={b.id} style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:12,color:low?C.rose:C.text,fontWeight:low?700:400}}>{b.nama}{low&&' ⚠️'}</span>
                <span style={{fontSize:11,color:C.text3}}>{b.stok} {b.satuan}</span>
              </div>
              <Bar val={b.stok} max={b.min*3} color={low?C.rose:C.sage}/>
            </div>)
          })}
        </div>
      </div>
    </div>
  )
}

// PRODUK
const PageProduk=({produk,profile,onAdd,onDel,onUpd,loading,isMobile})=>{
  const [tab,setTab]=useState('all')
  const CHANNELS=['Instagram','Instagram DM','TikTok','Shopee','Tokopedia','WhatsApp','Offline']
  const calcPrice=p=>{const t=(p.waktu||0)*(profile?.hargatenagaperjam||20000);const ov=((p.bahancost||0)+t)*((p.overhead||20)/100);const hpp=(p.bahancost||0)+t+ov;const j=hpp*(1+(p.markup||200)/100);return{hpp,hargaJual:j,profit:j-hpp,margin:j>0?(j-hpp)/j:0}}
  const filtered=tab==='all'?(produk||[]):(produk||[]).filter(p=>p.line===tab)
  return(
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <SH icon={I.box} title="Produk & Harga" sub="Harga dihitung otomatis: HPP + tenaga + overhead + markup" color={C.rose}/>
      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
        {[['all','Semua',C.amber],['premium','🎨 Premium',C.purple],['volume','📦 Volume',C.teal]].map(([id,lbl,col])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:'7px 14px',border:`1.5px solid ${tab===id?col:C.border}`,borderRadius:8,background:tab===id?col+'18':'transparent',color:tab===id?col:C.text2,cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:'inherit'}}>{lbl}</button>
        ))}
      </div>
      {loading&&<Spinner/>}
      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
        {filtered.map(item=>{
          const{hpp,hargaJual,profit,margin}=calcPrice(item)
          const col=item.line==='premium'?C.purple:C.teal
          return(
            <div key={item.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:'hidden',borderTop:`3px solid ${col}`}}>
              <div style={{padding:'11px 14px',borderBottom:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',gap:6}}>
                  <Pill color={col} bg={col+'18'}>{item.line==='premium'?'Premium':'Volume'}</Pill>
                  <Pill color={C.text2} bg={C.border}>{item.kategori||'Aksesoris'}</Pill>
                </div>
                <DelBtn onClick={()=>onDel(item.id)}/>
              </div>
              <div style={{padding:'12px 14px',display:'flex',flexDirection:'column',gap:10}}>
                <input value={item.nama||''} onChange={e=>onUpd(item.id,'nama',e.target.value)} placeholder="Nama produk..." style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.text,fontFamily:'inherit',fontSize:14,fontWeight:700,width:'100%',padding:'2px 0'}}/>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  <Inp label="HPP Bahan (Rp)" value={item.bahancost||0} onChange={v=>onUpd(item.id,'bahancost',v)} type="number"/>
                  <Inp label="Waktu (jam)" value={item.waktu||0} onChange={v=>onUpd(item.id,'waktu',v)} type="number" suf="j"/>
                  <Inp label="Overhead (%)" value={item.overhead||20} onChange={v=>onUpd(item.id,'overhead',v)} type="number" suf="%"/>
                  <Inp label="Markup (%)" value={item.markup||200} onChange={v=>onUpd(item.id,'markup',v)} type="number" suf="%"/>
                </div>
                <div style={{background:col+'0E',border:`1px solid ${col}30`,borderRadius:10,padding:'10px 12px'}}>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:8}}>
                    {[['HPP Total',idr(hpp)],['💰 Harga Jual',idr(hargaJual)],['Profit/pcs',idr(profit)]].map(([l,v])=>(
                      <div key={l} style={{textAlign:'center'}}><div style={{fontSize:10,color:C.text2,marginBottom:2}}>{l}</div><div style={{fontSize:12,fontWeight:800,color:l.includes('💰')?col:C.text}}>{v}</div></div>
                    ))}
                  </div>
                  <Bar val={margin} max={1} color={margin>0.5?C.sage:margin>0.3?C.amber:C.rose} h={6}/>
                  <div style={{fontSize:10,color:C.text3,marginTop:3,textAlign:'right'}}>Margin {pct(margin)}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
        <AddBtn onClick={()=>onAdd('premium')} label="+ Premium" color={C.purple}/>
        <AddBtn onClick={()=>onAdd('volume')} label="+ Volume" color={C.teal}/>
      </div>
    </div>
  )
}

// ORDER
const PageOrder=({orders,onAdd,onDel,onUpd,loading,isMobile})=>{
  const STATUS=['Pending','Proses','Selesai','Dikirim','Batal']
  const PLATFORM=['Instagram DM','WhatsApp','Shopee','Tokopedia','TikTok Shop','Offline']
  const sCol={Pending:C.gold,Proses:C.amber,Selesai:C.sage,Dikirim:C.teal,Batal:C.rose}
  const list=orders||[]
  const total=list.filter(o=>o.status!=='Batal').reduce((s,o)=>s+(o.total||0),0)
  const dpMasuk=list.filter(o=>['Proses','Pending'].includes(o.status)).reduce((s,o)=>s+(o.dp||0),0)
  const stC=STATUS.reduce((a,s)=>({...a,[s]:list.filter(o=>o.status===s).length}),{})
  return(
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <SH icon={I.order} title="Tracker Order" sub="Catat semua pesanan dari semua platform" color={C.teal}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8}}>
        {STATUS.map(s=>(<div key={s} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 8px',textAlign:'center',borderTop:`2px solid ${sCol[s]}`}}><div style={{fontSize:isMobile?18:22,fontWeight:900,color:sCol[s]}}>{stC[s]||0}</div><div style={{fontSize:9,fontWeight:700,color:C.text2,textTransform:'uppercase',marginTop:2}}>{s}</div></div>))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <div style={{background:C.sageL,border:`1px solid ${C.sage}33`,borderRadius:10,padding:'11px 14px'}}><div style={{fontSize:11,color:C.sage,fontWeight:600,marginBottom:2}}>Total Omzet</div><div style={{fontSize:16,fontWeight:900,color:C.sage}}>{idr(total)}</div></div>
        <div style={{background:C.amberL,border:`1px solid ${C.amber}33`,borderRadius:10,padding:'11px 14px'}}><div style={{fontSize:11,color:C.amber,fontWeight:600,marginBottom:2}}>DP Masuk</div><div style={{fontSize:16,fontWeight:900,color:C.amber}}>{idr(dpMasuk)}</div></div>
      </div>
      {loading&&<Spinner/>}
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {list.length===0&&!loading&&<div style={{background:C.card,border:`2px dashed ${C.border}`,borderRadius:12,padding:28,textAlign:'center',color:C.text3,fontSize:13,fontStyle:'italic'}}>Belum ada order.</div>}
        {list.map(o=>(
          <div key={o.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:'12px 14px',borderLeft:`3px solid ${sCol[o.status]||C.border}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <input value={o.nama||''} onChange={e=>onUpd(o.id,'nama',e.target.value)} placeholder="Nama pemesan..." style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.text,fontFamily:'inherit',fontSize:13,fontWeight:700,flex:1,marginRight:8,padding:'2px 0'}}/>
              <DelBtn onClick={()=>onDel(o.id)}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'1fr 1fr 120px 120px',gap:8,marginBottom:8}}>
              <Inp label="Produk" value={o.produk||''} onChange={v=>onUpd(o.id,'produk',v)}/>
              <div style={{display:'flex',flexDirection:'column',gap:4}}><Lbl>Status</Lbl><select value={o.status||'Pending'} onChange={e=>onUpd(o.id,'status',e.target.value)} style={{padding:'9px 10px',background:(sCol[o.status]||C.gold)+'18',border:`1.5px solid ${C.border2}`,borderRadius:8,outline:'none',color:sCol[o.status]||C.gold,fontFamily:'inherit',fontSize:12,fontWeight:700,cursor:'pointer'}}>{STATUS.map(s=><option key={s}>{s}</option>)}</select></div>
              <Inp label="Total (Rp)" value={o.total||0} onChange={v=>onUpd(o.id,'total',v)} type="number"/>
              <Inp label="DP (Rp)" value={o.dp||0} onChange={v=>onUpd(o.id,'dp',v)} type="number"/>
            </div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
              <select value={o.platform||'Instagram DM'} onChange={e=>onUpd(o.id,'platform',e.target.value)} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,outline:'none',color:C.text2,fontFamily:'inherit',fontSize:11,padding:'4px 8px',cursor:'pointer'}}>{PLATFORM.map(p=><option key={p}>{p}</option>)}</select>
              {o.deadline&&<span style={{fontSize:11,color:C.text3}}>📅 {o.deadline}</span>}
            </div>
            <input value={o.catatan||''} onChange={e=>onUpd(o.id,'catatan',e.target.value)} placeholder="Catatan / request khusus..." style={{marginTop:8,width:'100%',background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.text3,fontFamily:'inherit',fontSize:12,fontStyle:'italic',padding:'2px 0'}}/>
          </div>
        ))}
      </div>
      <AddBtn onClick={onAdd} label="Tambah Order" color={C.teal}/>
    </div>
  )
}

// BAHAN
const PageBahan=({bahan,onAdd,onDel,onUpd,loading,isMobile})=>{
  const list=bahan||[]
  return(
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <SH icon={I.tools} title="Stok Bahan" sub="Pantau stok dan harga bahan baku resin art" color={C.teal}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
        {[{l:'Total Bahan',v:list.length,c:C.teal},{l:'Hampir Habis',v:list.filter(b=>b.stok>0&&b.stok<=b.min).length,c:C.gold},{l:'Habis',v:list.filter(b=>b.stok===0).length,c:C.rose}].map(s=>(
          <div key={s.l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:'12px 14px',borderTop:`3px solid ${s.c}`}}><div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div><div style={{fontSize:10,fontWeight:700,color:C.text2,textTransform:'uppercase',marginTop:2}}>{s.l}</div></div>
        ))}
      </div>
      {loading&&<Spinner/>}
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {list.map(b=>{
          const habis=b.stok===0,low=b.stok>0&&b.stok<=b.min
          return(
            <div key={b.id} style={{background:habis?C.roseL+'80':low?C.goldL+'80':C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:'12px 14px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <input value={b.nama||''} onChange={e=>onUpd(b.id,'nama',e.target.value)} placeholder="Nama bahan..." style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:habis?C.rose:low?C.gold:C.text,fontFamily:'inherit',fontSize:13,fontWeight:(habis||low)?700:500,flex:1,marginRight:10,padding:'2px 0'}}/>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  {habis?<Pill color={C.rose} bg={C.roseL}>Habis!</Pill>:low?<Pill color={C.gold} bg={C.goldL}>Tipis</Pill>:<Pill color={C.sage} bg={C.sageL}>Aman</Pill>}
                  <DelBtn onClick={()=>onDel(b.id)}/>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 70px',gap:8,marginBottom:8}}>
                <Inp label="Harga/satuan" value={b.hpp||0} onChange={v=>onUpd(b.id,'hpp',v)} type="number"/>
                <Inp label={`Stok (${b.satuan||'gram'})`} value={b.stok||0} onChange={v=>onUpd(b.id,'stok',v)} type="number"/>
                <Inp label="Stok Min" value={b.min||0} onChange={v=>onUpd(b.id,'min',v)} type="number"/>
                <div style={{display:'flex',flexDirection:'column',gap:4}}><Lbl>Satuan</Lbl><input value={b.satuan||'gram'} onChange={e=>onUpd(b.id,'satuan',e.target.value)} style={{padding:'9px 8px',border:`1.5px solid ${C.border2}`,borderRadius:8,background:C.surface,color:C.text,fontFamily:'inherit',fontSize:13,outline:'none'}}/></div>
              </div>
              <Bar val={b.stok} max={b.min*3} color={habis?C.rose:low?C.gold:C.sage} h={4}/>
            </div>
          )
        })}
      </div>
      <AddBtn onClick={onAdd} label="Tambah Bahan" color={C.teal}/>
    </div>
  )
}

// KEUANGAN
const PageKeuangan=({operasional,modal,onUpdOps,onAddOps,onDelOps,onUpdModal,onAddModal,onDelModal})=>{
  const ops=operasional?.items||[]
  const totalOps=ops.reduce((s,i)=>s+(i.amt||0),0)
  const totalMod=(modal||[]).reduce((s,i)=>s+(i.harga||0),0)
  const target=operasional?.targetomzet||0
  const laba=target-totalOps
  const bep=laba>0?Math.ceil(totalMod/laba):0
  const g=(operasional?.growthrate||20)/100
  return(
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <SH icon={I.money} title="Keuangan" sub="Modal, biaya operasional, dan proyeksi keuntungan" color={C.sage}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
        <KPI label="Modal Awal" value={idr(totalMod)} color={C.amber} icon={I.chart}/>
        <KPI label="Target Omzet/Bln" value={idr(target)} color={C.sage} icon={I.trend}/>
        <KPI label="Biaya Ops/Bln" value={idr(totalOps)} color={C.rose} icon={I.warn}/>
        <KPI label="Break Even" value={bep>0?`Bln ke-${bep}`:'–'} color={C.gold} sub={laba>0?`Laba ${idr(laba)}/bln`:''} icon={I.clock}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <Inp label="🎯 Target Omzet/Bulan (Rp)" value={operasional?.targetomzet||0} onChange={v=>onUpdOps('targetomzet',v)} type="number"/>
        <Inp label="📈 Pertumbuhan (%/bln)" value={operasional?.growthrate||20} onChange={v=>onUpdOps('growthrate',v)} type="number" suf="%"/>
      </div>
      {/* Modal table */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden'}}>
        <div style={{padding:'12px 16px',background:C.amberL,borderBottom:`1px solid ${C.amber}33`,display:'flex',justifyContent:'space-between'}}><span style={{fontSize:14,fontWeight:800,color:C.text}}>💰 Modal Awal</span><span style={{fontSize:14,fontWeight:900,color:C.amber}}>{idr(totalMod)}</span></div>
        {(modal||[]).map(item=>(<div key={item.id} style={{display:'grid',gridTemplateColumns:'1fr 130px 32px',gap:8,padding:'9px 14px',borderTop:`1px solid ${C.border}`,alignItems:'center'}}>
          <input value={item.nama||''} onChange={e=>onUpdModal(item.id,'nama',e.target.value)} placeholder="Nama item..." style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.text,fontFamily:'inherit',fontSize:13,padding:'2px 0'}}/>
          <input type="number" value={item.harga||''} onChange={e=>onUpdModal(item.id,'harga',parseFloat(e.target.value)||0)} style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.amber,fontFamily:'inherit',fontSize:13,fontWeight:700,textAlign:'right',width:'100%',padding:'2px 0'}}/>
          <DelBtn onClick={()=>onDelModal(item.id)}/>
        </div>))}
        <div style={{padding:'8px 12px',borderTop:`1px solid ${C.border}`}}><AddBtn onClick={onAddModal} label="Tambah Item" color={C.amber}/></div>
      </div>
      {/* Ops table */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden'}}>
        <div style={{padding:'12px 16px',background:C.roseL,borderBottom:`1px solid ${C.rose}33`,display:'flex',justifyContent:'space-between'}}><span style={{fontSize:14,fontWeight:800,color:C.text}}>💸 Biaya Operasional/Bulan</span><span style={{fontSize:14,fontWeight:900,color:C.rose}}>{idr(totalOps)}</span></div>
        {ops.map(op=>(<div key={op.id} style={{display:'grid',gridTemplateColumns:'1fr 130px 32px',gap:8,padding:'9px 14px',borderTop:`1px solid ${C.border}`,alignItems:'center'}}>
          <input value={op.nama||''} onChange={e=>onUpdOps('item',op.id,'nama',e.target.value)} placeholder="Nama biaya..." style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.text,fontFamily:'inherit',fontSize:13,padding:'2px 0'}}/>
          <input type="number" value={op.amt||''} onChange={e=>onUpdOps('item',op.id,'amt',parseFloat(e.target.value)||0)} style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.rose,fontFamily:'inherit',fontSize:13,fontWeight:700,textAlign:'right',width:'100%',padding:'2px 0'}}/>
          <DelBtn onClick={()=>onDelOps(op.id)}/>
        </div>))}
        <div style={{padding:'8px 12px',borderTop:`1px solid ${C.border}`}}><AddBtn onClick={onAddOps} label="Tambah Biaya" color={C.rose}/></div>
      </div>
      {/* Proyeksi */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden'}}>
        <div style={{padding:'12px 16px',background:C.sageL,borderBottom:`1px solid ${C.sage}33`}}><span style={{fontSize:14,fontWeight:800,color:C.text}}>📈 Proyeksi 6 Bulan</span></div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:480}}>
            <thead><tr style={{background:C.bg}}>{['',1,2,3,4,5,6].map((h,i)=>(<td key={i} style={{padding:'8px 12px',fontSize:10,fontWeight:700,color:C.text3,textTransform:'uppercase',letterSpacing:'0.06em',textAlign:i>0?'right':'left',borderBottom:`1px solid ${C.border}`}}>{i===0?'':(`Bln ${h}`)}</td>))}</tr></thead>
            <tbody>{[{l:'Omzet',fn:m=>target*Math.pow(1+g,m),c:C.sage,b:false},{l:'Biaya',fn:m=>totalOps*Math.pow(1+g*0.4,m),c:C.rose,b:false},{l:'Laba',fn:m=>(target*Math.pow(1+g,m))-(totalOps*Math.pow(1+g*0.4,m)),c:C.amber,b:true}].map(row=>(
              <tr key={row.l} style={{background:row.b?row.c+'0D':'transparent'}}>{[null,0,1,2,3,4,5].map((m,i)=>(<td key={i} style={{padding:'8px 12px',fontSize:i===0?12:13,fontWeight:i===0?700:(row.b?800:400),color:i===0?C.text2:row.c,textAlign:i>0?'right':'left',borderBottom:`1px solid ${C.border}`}}>{i===0?row.l:idr(row.fn(m))}</td>))}</tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// PROFIL
const PageProfil=({profile,onUpd,isMobile})=>{
  const STRAT=[
    {id:'premium',label:'🎨 Premium',col:C.purple,desc:'Margin tinggi, volume kecil.',pros:['Margin 150–300%','Harga sendiri','Pelanggan loyal'],cons:['Produksi lama','Butuh branding']},
    {id:'volume',label:'📦 Volume',col:C.teal,desc:'Ready stock massal, marketplace.',pros:['Cash flow stabil','Mudah scale up'],cons:['Perang harga','Margin 30–60%']},
    {id:'hybrid',label:'⚡ Hybrid',col:C.amber,desc:'Premium+volume sekaligus.',pros:['Best of both','Risiko tersebar'],cons:['Manajemen lebih kompleks']},
  ]
  return(
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <SH icon={I.user} title="Profil & Strategi" color={C.amber}/>
      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
        <Inp label="Nama Brand" value={profile?.nama||''} onChange={v=>onUpd('nama',v)} ph="Resin by Arya"/>
        <Inp label="Tagline" value={profile?.tagline||''} onChange={v=>onUpd('tagline',v)} ph="Handcrafted with love"/>
        <Inp label="Instagram" value={profile?.ig||''} onChange={v=>onUpd('ig',v)} ph="tanpa @" pre="@"/>
        <Inp label="Marketplace" value={profile?.marketplace||''} onChange={v=>onUpd('marketplace',v)} ph="Shopee / Tokopedia"/>
        <Inp label="Kota" value={profile?.lokasi||''} onChange={v=>onUpd('lokasi',v)} ph="Jakarta Selatan"/>
        <Inp label="Tarif Tenaga/Jam (Rp)" value={profile?.hargatenagaperjam||20000} onChange={v=>onUpd('hargatenagaperjam',parseFloat(v)||0)} type="number"/>
      </div>
      <div>
        <div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:12}}>⚡ Pilih Strategi</div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:10}}>
          {STRAT.map(s=>{
            const active=profile?.strategi===s.id
            return(<div key={s.id} onClick={()=>onUpd('strategi',s.id)} style={{background:active?s.col+'14':C.card,border:`2px solid ${active?s.col:C.border}`,borderRadius:14,padding:16,cursor:'pointer',transition:'all .2s'}}>
              <div style={{fontSize:14,fontWeight:800,color:active?s.col:C.text,marginBottom:4}}>{s.label}</div>
              <div style={{fontSize:12,color:C.text2,marginBottom:10,lineHeight:1.5}}>{s.desc}</div>
              {s.pros.map(p=><div key={p} style={{fontSize:11,color:C.sage,marginBottom:2}}>✓ {p}</div>)}
              {s.cons.map(c=><div key={c} style={{fontSize:11,color:C.rose,marginBottom:2}}>✗ {c}</div>)}
              {active&&<div style={{marginTop:10,padding:'5px 10px',background:s.col,borderRadius:6,textAlign:'center',fontSize:11,fontWeight:700,color:'#fff'}}>✓ Aktif</div>}
            </div>)
          })}
        </div>
      </div>
    </div>
  )
}

const PAGES=[
  {id:'dash',label:'Dashboard',icon:I.home,color:C.amber},
  {id:'profil',label:'Profil',icon:I.user,color:C.purple},
  {id:'produk',label:'Produk',icon:I.box,color:C.rose},
  {id:'order',label:'Order',icon:I.order,color:C.teal},
  {id:'bahan',label:'Stok',icon:I.tools,color:C.teal},
  {id:'keuangan',label:'Keuangan',icon:I.money,color:C.sage},
]

export default function App(){
  const [user,setUser]=useState(null)
  const [authLoading,setAuthLoading]=useState(true)
  const [page,setPage]=useState('dash')
  const [toast,setToast]=useState(null)
  const [syncing,setSyncing]=useState(false)
  const isMobile=useIsMobile()
  const [profile,setProfile]=useState({nama:'',tagline:'',ig:'',marketplace:'',lokasi:'',strategi:'hybrid',hargatenagaperjam:20000})
  const [produk,setProduk]=useState([])
  const [bahan,setBahan]=useState([])
  const [orders,setOrders]=useState([])
  const [modal,setModal]=useState([])
  const [operasional,setOperasional]=useState({items:[],targetomzet:3000000,growthrate:20})
  const [loadingData,setLoadingData]=useState(false)
  const toastTimer=useRef(null)

  const showToast=(msg,type='success')=>{
    if(toastTimer.current)clearTimeout(toastTimer.current)
    setToast({msg,type})
    toastTimer.current=setTimeout(()=>setToast(null),3500)
  }

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user||null)
      setAuthLoading(false)
    })
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_ev,session)=>{
      setUser(session?.user||null)
      setAuthLoading(false)
    })
    return()=>subscription.unsubscribe()
  },[])

  useEffect(()=>{
    if(!user){
      setProduk([]);setBahan([]);setOrders([]);setModal([])
      setProfile({nama:'',tagline:'',ig:'',marketplace:'',lokasi:'',strategi:'hybrid',hargatenagaperjam:20000})
      setOperasional({items:[],targetomzet:3000000,growthrate:20})
      return
    }
    loadAll(user.id)
  },[user?.id])

  const loadAll=async(uid)=>{
    setLoadingData(true)
    const[profRes,prodRes,bahRes,ordRes,modRes,opsRes]=await Promise.allSettled([
      supabase.from('profiles').select('*').eq('user_id',uid).maybeSingle(),
      supabase.from('produk').select('*').eq('user_id',uid).order('created_at'),
      supabase.from('bahan').select('*').eq('user_id',uid).order('created_at'),
      supabase.from('orders').select('*').eq('user_id',uid).order('created_at',{ascending:false}),
      supabase.from('modal').select('*').eq('user_id',uid).order('created_at'),
      supabase.from('operasional').select('*').eq('user_id',uid).maybeSingle(),
    ])
    if(profRes.status==='fulfilled'&&profRes.value.data)setProfile(profRes.value.data)
    if(prodRes.status==='fulfilled'&&prodRes.value.data)setProduk(prodRes.value.data)
    if(bahRes.status==='fulfilled'&&bahRes.value.data)setBahan(bahRes.value.data)
    if(ordRes.status==='fulfilled'&&ordRes.value.data)setOrders(ordRes.value.data)
    if(modRes.status==='fulfilled'&&modRes.value.data)setModal(modRes.value.data)
    if(opsRes.status==='fulfilled'&&opsRes.value.data)setOperasional(opsRes.value.data)
    setLoadingData(false)
  }

  const updProfile=(k,v)=>setProfile(p=>({...p,[k]:v}))
  const saveProfile=async()=>{
    setSyncing(true)
    const{error}=await supabase.from('profiles').upsert({...profile,user_id:user.id},{onConflict:'user_id'})
    if(error)showToast('Gagal simpan: '+error.message,'error')
    else showToast('Profil tersimpan! ✓')
    setSyncing(false)
  }

  const addProduk=async(line)=>{
    const item={user_id:user.id,nama:'',line,kategori:'Aksesoris',waktu:2,bahancost:0,overhead:20,markup:line==='premium'?200:150,stok:0,channelusama:line==='premium'?'Instagram':'Shopee',minorder:1}
    const{data,error}=await supabase.from('produk').insert(item).select().single()
    if(error)showToast('Gagal tambah produk: '+error.message,'error')
    else{setProduk(p=>[...p,data]);showToast('Produk ditambahkan!')}
  }
  const delProduk=async(id)=>{setProduk(p=>p.filter(x=>x.id!==id));await supabase.from('produk').delete().eq('id',id).eq('user_id',user.id)}
  const updProduk=async(id,k,v)=>{setProduk(p=>p.map(x=>x.id===id?{...x,[k]:v}:x));await supabase.from('produk').update({[k]:v}).eq('id',id).eq('user_id',user.id)}

  const addBahan=async()=>{
    const item={user_id:user.id,nama:'',satuan:'gram',hpp:0,stok:0,min:50}
    const{data,error}=await supabase.from('bahan').insert(item).select().single()
    if(error)showToast('Gagal tambah bahan: '+error.message,'error')
    else{setBahan(b=>[...b,data]);showToast('Bahan ditambahkan!')}
  }
  const delBahan=async(id)=>{setBahan(b=>b.filter(x=>x.id!==id));await supabase.from('bahan').delete().eq('id',id).eq('user_id',user.id)}
  const updBahan=async(id,k,v)=>{setBahan(b=>b.map(x=>x.id===id?{...x,[k]:v}:x));await supabase.from('bahan').update({[k]:v}).eq('id',id).eq('user_id',user.id)}

  const addOrder=async()=>{
    const item={user_id:user.id,nama:'',produk:'',qty:1,total:0,dp:0,platform:'Instagram DM',status:'Pending',tgl:new Date().toISOString().slice(0,10),deadline:null,catatan:''}
    const{data,error}=await supabase.from('orders').insert(item).select().single()
    if(error)showToast('Gagal tambah order: '+error.message,'error')
    else{setOrders(o=>[data,...o]);showToast('Order ditambahkan!')}
  }
  const delOrder=async(id)=>{setOrders(o=>o.filter(x=>x.id!==id));await supabase.from('orders').delete().eq('id',id).eq('user_id',user.id)}
  const updOrder=async(id,k,v)=>{setOrders(o=>o.map(x=>x.id===id?{...x,[k]:v}:x));await supabase.from('orders').update({[k]:v}).eq('id',id).eq('user_id',user.id)}

  const addModal=async()=>{
    const item={user_id:user.id,nama:'',kategori:'Bahan',harga:0}
    const{data,error}=await supabase.from('modal').insert(item).select().single()
    if(error)showToast('Gagal: '+error.message,'error')
    else setModal(m=>[...m,data])
  }
  const delModal=async(id)=>{setModal(m=>m.filter(x=>x.id!==id));await supabase.from('modal').delete().eq('id',id).eq('user_id',user.id)}
  const updModal=async(id,k,v)=>{setModal(m=>m.map(x=>x.id===id?{...x,[k]:v}:x));await supabase.from('modal').update({[k]:v}).eq('id',id).eq('user_id',user.id)}

  const updOps=async(kOrAction,idOrVal,k,v)=>{
    let updated
    if(kOrAction==='item'){updated={...operasional,items:operasional.items.map(i=>i.id===idOrVal?{...i,[k]:v}:i)}}
    else{updated={...operasional,[kOrAction]:idOrVal}}
    setOperasional(updated)
    await supabase.from('operasional').upsert({...updated,user_id:user.id},{onConflict:'user_id'})
  }
  const addOps=async()=>{
    const updated={...operasional,items:[...(operasional.items||[]),{id:genId(),nama:'',amt:0}]}
    setOperasional(updated)
    await supabase.from('operasional').upsert({...updated,user_id:user.id},{onConflict:'user_id'})
  }
  const delOps=async(id)=>{
    const updated={...operasional,items:operasional.items.filter(i=>i.id!==id)}
    setOperasional(updated)
    await supabase.from('operasional').upsert({...updated,user_id:user.id},{onConflict:'user_id'})
  }

  const logout=async()=>{await supabase.auth.signOut();setUser(null)}
  const stokAlert=(bahan||[]).filter(b=>b.stok<=b.min).length
  const curPage=PAGES.find(p=>p.id===page)

  if(authLoading)return(
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:C.bg,flexDirection:'column',gap:16}}>
      <div style={{fontSize:44}}>🪬</div><Spinner size={28} pad={0}/>
      <div style={{fontSize:13,color:C.text3}}>Memuat...</div>
    </div>
  )

  if(!user)return <AuthPage/>

  const renderPage=()=>{
    const cm={isMobile}
    switch(page){
      case'dash':return<PageDash {...cm} produk={produk} bahan={bahan} orders={orders} operasional={operasional} modal={modal} profile={profile}/>
      case'profil':return<PageProfil {...cm} profile={profile} onUpd={updProfile}/>
      case'produk':return<PageProduk {...cm} produk={produk} profile={profile} onAdd={addProduk} onDel={delProduk} onUpd={updProduk} loading={loadingData}/>
      case'order':return<PageOrder {...cm} orders={orders} onAdd={addOrder} onDel={delOrder} onUpd={updOrder} loading={loadingData}/>
      case'bahan':return<PageBahan {...cm} bahan={bahan} onAdd={addBahan} onDel={delBahan} onUpd={updBahan} loading={loadingData}/>
      case'keuangan':return<PageKeuangan {...cm} operasional={operasional} modal={modal} onUpdOps={updOps} onAddOps={addOps} onDelOps={delOps} onUpdModal={updModal} onAddModal={addModal} onDelModal={delModal}/>
      default:return<PageDash {...cm} produk={produk} bahan={bahan} orders={orders} operasional={operasional} modal={modal} profile={profile}/>
    }
  }

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Nunito',sans-serif;background:${C.bg};color:${C.text};min-height:100vh;-webkit-tap-highlight-color:transparent}
        input,textarea,select,button{font-family:'Nunito',sans-serif}
        input:focus,textarea:focus,select:focus{border-color:${C.amber}!important;box-shadow:0 0 0 3px ${C.amber}22}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${C.border2};border-radius:2px}
        input[type=number]::-webkit-inner-spin-button{opacity:.3}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes slideUp{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
        .pg{animation:fadeIn .2s ease}
        .dsb{display:flex;flex-direction:column}
        .mtb,.mbn{display:none}
        @media(max-width:767px){
          .dsb{display:none!important}
          .mtb{display:flex!important}
          .mbn{display:flex!important}
          .mw{margin-left:0!important;padding-bottom:80px!important;padding-top:58px!important}
        }
      `}</style>

      {/* DESKTOP SIDEBAR */}
      <aside className="dsb" style={{width:220,background:C.surface,borderRight:`1px solid ${C.border}`,position:'fixed',top:0,left:0,height:'100vh',zIndex:100}}>
        <div style={{padding:'18px 16px 14px',borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.amber},${C.gold})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🪬</div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:13,fontWeight:900,color:C.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>Resin Planner</div>
              <div style={{fontSize:10,color:C.text3,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{profile?.nama||user.email?.split('@')[0]}</div>
            </div>
          </div>
        </div>
        <nav style={{flex:1,padding:'10px 8px',overflowY:'auto'}}>
          {PAGES.map(p=>{
            const active=page===p.id
            return(<button key={p.id} onClick={()=>setPage(p.id)} style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:'10px 12px',borderRadius:9,border:'none',background:active?p.color+'16':'transparent',color:active?p.color:C.text2,cursor:'pointer',fontSize:13,fontWeight:active?700:500,textAlign:'left',marginBottom:2,fontFamily:'inherit',borderLeft:active?`2px solid ${p.color}`:'2px solid transparent'}} onMouseOver={e=>{if(!active){e.currentTarget.style.background=C.border;e.currentTarget.style.color=C.text}}} onMouseOut={e=>{if(!active){e.currentTarget.style.background='transparent';e.currentTarget.style.color=C.text2}}}>
              <Ic p={p.icon} s={15} c={active?p.color:C.text3}/>
              {p.label}
              {p.id==='bahan'&&stokAlert>0&&<span style={{marginLeft:'auto',fontSize:10,fontWeight:800,color:'#fff',background:C.rose,borderRadius:10,padding:'1px 6px'}}>{stokAlert}</span>}
            </button>)
          })}
        </nav>
        <div style={{padding:'10px 8px',borderTop:`1px solid ${C.border}`,display:'flex',flexDirection:'column',gap:6}}>
          {page==='profil'&&<button onClick={saveProfile} disabled={syncing} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'9px',borderRadius:9,border:'none',background:syncing?C.sage:C.amber,color:'#fff',cursor:syncing?'wait':'pointer',fontSize:12,fontWeight:800,fontFamily:'inherit',transition:'background .2s'}}><Ic p={syncing?I.sync:I.save} s={13} c="#fff"/>{syncing?'Menyimpan...':'Simpan Profil'}</button>}
          <button onClick={logout} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'9px',borderRadius:9,border:`1px solid ${C.border}`,background:'transparent',color:C.text2,cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:'inherit'}}><Ic p={I.logout} s={13} c={C.text2}/>Keluar</button>
        </div>
      </aside>

      {/* MOBILE TOPBAR */}
      <div className="mtb" style={{position:'fixed',top:0,left:0,right:0,zIndex:200,background:C.surface,borderBottom:`1px solid ${C.border}`,padding:'10px 16px',alignItems:'center',justifyContent:'space-between',height:52}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:20}}>🪬</span><span style={{fontSize:15,fontWeight:900,color:C.text}}>{curPage?.label}</span></div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {stokAlert>0&&<span style={{fontSize:10,fontWeight:800,color:'#fff',background:C.rose,borderRadius:10,padding:'2px 7px'}}>⚠️{stokAlert}</span>}
          {page==='profil'&&<button onClick={saveProfile} disabled={syncing} style={{padding:'6px 14px',border:'none',borderRadius:8,background:C.amber,color:'#fff',fontSize:12,fontWeight:800,cursor:'pointer',fontFamily:'inherit'}}>{syncing?'...':'Simpan'}</button>}
          <button onClick={logout} style={{padding:'6px',border:`1px solid ${C.border}`,borderRadius:8,background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',color:C.text2,fontFamily:'inherit'}}><Ic p={I.logout} s={14} c={C.text2}/></button>
        </div>
      </div>

      {/* MAIN */}
      <main className="mw" style={{marginLeft:220,padding:'20px 24px',minHeight:'100vh'}}>
        <div style={{maxWidth:1080,width:'100%'}} key={page} className="pg">
          {loadingData&&page!=='dash'?<Spinner/>:renderPage()}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mbn" style={{position:'fixed',bottom:0,left:0,right:0,zIndex:200,background:C.surface,borderTop:`1px solid ${C.border}`,paddingBottom:'env(safe-area-inset-bottom)',justifyContent:'space-around',alignItems:'center',height:64}}>
        {PAGES.map(p=>{
          const active=page===p.id
          return(<button key={p.id} onClick={()=>setPage(p.id)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,padding:'6px 8px',border:'none',background:'transparent',cursor:'pointer',fontFamily:'inherit',position:'relative',flex:1,minWidth:0}}>
            <div style={{width:34,height:34,borderRadius:10,background:active?p.color+'18':'transparent',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s'}}><Ic p={p.icon} s={18} c={active?p.color:C.text3}/></div>
            <span style={{fontSize:9,fontWeight:active?800:500,color:active?p.color:C.text3}}>{p.label}</span>
            {p.id==='bahan'&&stokAlert>0&&<span style={{position:'absolute',top:4,right:8,fontSize:8,fontWeight:800,color:'#fff',background:C.rose,borderRadius:8,padding:'0 4px'}}>{stokAlert}</span>}
          </button>)
        })}
      </nav>

      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </>
  )
}
