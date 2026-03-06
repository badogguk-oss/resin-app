import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

// ── THEME ──────────────────────────────────────────────────────────────────
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

// ── UTILS ──────────────────────────────────────────────────────────────────
const idr = n => 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(n||0))
const uid = () => Math.random().toString(36).slice(2,9)
const pct = n => ((n||0)*100).toFixed(1)+'%'
const cl  = (n,a,b) => Math.min(b,Math.max(a,n))

// ── ICONS ──────────────────────────────────────────────────────────────────
const Ic = ({p,s=18,c='currentColor',sw=1.8}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(p)?p:[p]).map((d,i)=><path key={i} d={d}/>)}
  </svg>
)
const I = {
  home:  ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z','M9 22V12h6v10'],
  star:  ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  box:   ['M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z'],
  order: ['M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2','M9 5a2 2 0 002 2h2a2 2 0 002-2','M9 12h6','M9 16h4'],
  money: ['M12 2v20','M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'],
  tools: ['M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z'],
  chart: ['M18 20V10','M12 20V4','M6 20v-6'],
  plus:  ['M12 5v14','M5 12h14'],
  trash: ['M3 6h18','M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6','M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2'],
  check: ['M20 6L9 17l-5-5'],
  warn:  ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z','M12 9v4','M12 17h.01'],
  clock: ['M12 22a10 10 0 100-20 10 10 0 000 20z','M12 6v6l4 2'],
  trend: ['M23 6l-9.5 9.5-5-5L1 18','M17 6h6v6'],
  eye:   ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 100 6 3 3 0 000-6z'],
  menu:  ['M3 12h18','M3 6h18','M3 18h18'],
  x:     ['M18 6L6 18','M6 6l12 12'],
  user:  ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2','M12 3a4 4 0 100 8 4 4 0 000-8z'],
  logout:['M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4','M16 17l5-5-5-5','M21 12H9'],
  save:  ['M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z','M17 21v-8H7v8','M7 3v5h8'],
  sync:  ['M23 4v6h-6','M1 20v-6h6','M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15'],
}

// ── ATOMS ──────────────────────────────────────────────────────────────────
const Lbl = ({children,c=C.text2}) => (
  <span style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',color:c,textTransform:'uppercase',display:'block',marginBottom:5}}>{children}</span>
)

const Inp = ({label,value,onChange,type='text',ph='',pre,suf,rows,disabled}) => (
  <div style={{display:'flex',flexDirection:'column',gap:4}}>
    {label && <Lbl>{label}</Lbl>}
    <div style={{position:'relative',display:'flex',alignItems:rows?'flex-start':'center'}}>
      {pre && <span style={{position:'absolute',left:10,fontSize:12,color:C.text3,pointerEvents:'none',top:rows?11:'50%',transform:rows?'none':'translateY(-50%)'}}>{pre}</span>}
      {rows
        ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} rows={rows} disabled={disabled}
            style={{width:'100%',padding:'9px 11px',border:`1.5px solid ${C.border2}`,borderRadius:8,background:disabled?C.bg:C.surface,color:C.text,fontFamily:'inherit',fontSize:13,outline:'none',resize:'vertical',lineHeight:1.6}}/>
        : <input type={type} value={value}
            onChange={e=>onChange(type==='number'?(parseFloat(e.target.value)||0):e.target.value)}
            placeholder={ph} disabled={disabled}
            style={{width:'100%',padding:`9px ${suf?'34px':'11px'} 9px ${pre?'32px':'11px'}`,border:`1.5px solid ${C.border2}`,borderRadius:8,background:disabled?C.bg:C.surface,color:C.text,fontFamily:'inherit',fontSize:13,outline:'none'}}/>
      }
      {suf && <span style={{position:'absolute',right:10,fontSize:12,color:C.text3,pointerEvents:'none'}}>{suf}</span>}
    </div>
  </div>
)

const Pill = ({color,bg,children}) => (
  <span style={{fontSize:10,fontWeight:700,color,background:bg,padding:'2px 9px',borderRadius:20,letterSpacing:'0.05em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{children}</span>
)

const Bar = ({val,max,color,h=5}) => (
  <div style={{height:h,background:C.border,borderRadius:3,overflow:'hidden'}}>
    <div style={{height:'100%',width:cl(max?val/max*100:0,0,100)+'%',background:color,borderRadius:3,transition:'width .5s'}}/>
  </div>
)

const KPI = ({label,value,sub,color,icon}) => (
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:'14px 16px',borderTop:`3px solid ${color}`}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
      <div>
        <div style={{fontSize:10,fontWeight:700,color:C.text2,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>{label}</div>
        <div style={{fontSize:18,fontWeight:900,color,letterSpacing:'-0.5px'}}>{value}</div>
        {sub && <div style={{fontSize:11,color:C.text3,marginTop:3}}>{sub}</div>}
      </div>
      {icon && <div style={{color,opacity:0.3}}><Ic p={icon} s={20}/></div>}
    </div>
  </div>
)

const SH = ({icon,title,sub,color=C.amber}) => (
  <div style={{borderLeft:`3px solid ${color}`,paddingLeft:14,marginBottom:20}}>
    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
      {icon && <Ic p={icon} s={17} c={color}/>}
      <span style={{fontSize:18,fontWeight:900,color:C.text,letterSpacing:'-0.3px'}}>{title}</span>
    </div>
    {sub && <div style={{fontSize:13,color:C.text2,marginTop:2}}>{sub}</div>}
  </div>
)

const DelBtn = ({onClick}) => (
  <button onClick={onClick} style={{width:28,height:28,borderRadius:6,border:'none',background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.text3,flexShrink:0,fontFamily:'inherit'}}
    onMouseOver={e=>{e.currentTarget.style.color=C.rose;e.currentTarget.style.background=C.roseL}}
    onMouseOut={e=>{e.currentTarget.style.color=C.text3;e.currentTarget.style.background='transparent'}}>
    <Ic p={I.trash} s={13}/>
  </button>
)

const AddBtn = ({onClick,label,color=C.amber}) => (
  <button onClick={onClick}
    style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 14px',border:`1.5px dashed ${C.border2}`,borderRadius:8,background:'transparent',color:C.text2,cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:'inherit'}}
    onMouseOver={e=>{e.currentTarget.style.borderColor=color;e.currentTarget.style.color=color}}
    onMouseOut={e=>{e.currentTarget.style.borderColor=C.border2;e.currentTarget.style.color=C.text2}}>
    <Ic p={I.plus} s={13}/> {label}
  </button>
)

const Spinner = () => (
  <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:40}}>
    <div style={{width:32,height:32,border:`3px solid ${C.border}`,borderTop:`3px solid ${C.amber}`,borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
  </div>
)

const Toast = ({msg,type='success',onClose}) => (
  <div style={{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',zIndex:9999,background:type==='error'?C.rose:C.sage,color:'#fff',padding:'12px 22px',borderRadius:30,fontSize:13,fontWeight:700,boxShadow:'0 4px 20px rgba(0,0,0,0.2)',display:'flex',alignItems:'center',gap:8,animation:'slideUp .3s ease'}}>
    <Ic p={type==='error'?I.warn:I.check} s={15} c="#fff"/> {msg}
  </div>
)

// ── AUTH PAGE ──────────────────────────────────────────────────────────────
const AuthPage = ({onAuth}) => {
  const [mode,setMode] = useState('login')
  const [email,setEmail] = useState('')
  const [pass,setPass] = useState('')
  const [name,setName] = useState('')
  const [loading,setLoading] = useState(false)
  const [err,setErr] = useState('')
  const [msg,setMsg] = useState('')

  const submit = async () => {
    setErr(''); setMsg(''); setLoading(true)
    try {
      if (mode==='login') {
        const {data,error} = await supabase.auth.signInWithPassword({email,password:pass})
        if (error) throw error
        onAuth(data.user)
      } else {
        const {data,error} = await supabase.auth.signUp({
          email, password:pass,
          options:{data:{nama:name}}
        })
        if (error) throw error
        if (data.user && !data.session) {
          setMsg('Cek email kamu untuk konfirmasi akun, lalu login.')
          setMode('login')
        } else if (data.user) {
          onAuth(data.user)
        }
      }
    } catch(e) {
      setErr(e.message || 'Terjadi kesalahan')
    }
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',background:`linear-gradient(135deg,${C.amberL},${C.bg})`,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{width:'100%',maxWidth:400,background:C.surface,borderRadius:20,padding:32,boxShadow:'0 8px 40px rgba(184,114,42,0.12)'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:44,marginBottom:8}}>🪬</div>
          <div style={{fontSize:22,fontWeight:900,color:C.text,letterSpacing:'-0.5px'}}>Resin Planner</div>
          <div style={{fontSize:13,color:C.text2,marginTop:4}}>Bisnis resin art kamu, terorganisir.</div>
        </div>

        <div style={{display:'flex',gap:4,marginBottom:24,background:C.bg,borderRadius:10,padding:4}}>
          {['login','register'].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr('');setMsg('')}}
              style={{flex:1,padding:'9px',border:'none',borderRadius:8,background:mode===m?C.surface:'transparent',color:mode===m?C.amber:C.text2,fontWeight:mode===m?800:500,fontSize:13,cursor:'pointer',fontFamily:'inherit',transition:'all .2s',boxShadow:mode===m?'0 2px 8px rgba(0,0,0,0.08)':'none'}}>
              {m==='login'?'Masuk':'Daftar'}
            </button>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {mode==='register' && <Inp label="Nama Lengkap" value={name} onChange={setName} ph="Nama kamu"/>}
          <Inp label="Email" value={email} onChange={setEmail} type="email" ph="email@kamu.com"/>
          <Inp label="Password" value={pass} onChange={setPass} type="password" ph="Min. 6 karakter"/>
        </div>

        {err && <div style={{marginTop:12,padding:'10px 12px',background:C.roseL,borderRadius:8,fontSize:12,color:C.rose,fontWeight:600}}>{err}</div>}
        {msg && <div style={{marginTop:12,padding:'10px 12px',background:C.sageL,borderRadius:8,fontSize:12,color:C.sage,fontWeight:600}}>{msg}</div>}

        <button onClick={submit} disabled={loading||!email||!pass}
          style={{marginTop:20,width:'100%',padding:'13px',border:'none',borderRadius:10,background:C.amber,color:'#fff',fontSize:14,fontWeight:800,cursor:loading?'wait':'pointer',fontFamily:'inherit',opacity:(!email||!pass)?0.5:1,transition:'all .2s'}}>
          {loading?'Loading...':(mode==='login'?'Masuk':'Buat Akun')}
        </button>

        <div style={{marginTop:16,textAlign:'center',fontSize:12,color:C.text3}}>
          Data tersimpan aman di cloud · Bisa akses dari HP manapun
        </div>
      </div>
    </div>
  )
}

// ── PAGE: DASHBOARD ────────────────────────────────────────────────────────
const PageDash = ({produk,bahan,orders,operasional,modal,profile,isMobile}) => {
  const totalModal = modal.reduce((s,i)=>s+(i.harga||0),0)
  const totalOps   = operasional.items.reduce((s,i)=>s+(i.amt||0),0)
  const target     = operasional.targetOmzet||0
  const labaBulan  = target-totalOps
  const bep        = labaBulan>0?Math.ceil(totalModal/labaBulan):0
  const stokRendah = bahan.filter(b=>b.stok<=b.min).length
  const pendingOrd = orders.filter(o=>o.status==='Proses').length

  const calcPrice = p => {
    const tenaga = (p.waktu||0)*(profile.hargaTenagaPerJam||20000)
    const over   = (p.bahanCost+tenaga)*((p.overhead||20)/100)
    const hpp    = p.bahanCost+tenaga+over
    const jual   = hpp*(1+(p.markup||200)/100)
    return {profit:jual-hpp, margin:jual>0?(jual-hpp)/jual:0, hargaJual:jual}
  }

  const topProduk = [...produk].map(p=>({...p,...calcPrice(p)})).sort((a,b)=>b.margin-a.margin).slice(0,4)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {/* Hero */}
      <div style={{background:`linear-gradient(135deg,${C.amber}22,${C.amberL})`,border:`1px solid ${C.border}`,borderRadius:16,padding:'18px 20px'}}>
        <div style={{fontSize:11,fontWeight:700,color:C.amber,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:4}}>🪬 Resin Planner</div>
        <div style={{fontSize:isMobile?18:22,fontWeight:900,color:C.text}}>{profile.nama||<span style={{color:C.text3,fontStyle:'italic',fontWeight:400}}>Brand belum diisi</span>}</div>
        <div style={{display:'flex',gap:6,marginTop:8,flexWrap:'wrap'}}>
          <Pill color={C.amber} bg={C.amberL}>{profile.strategi==='premium'?'🎨 Premium':profile.strategi==='volume'?'📦 Volume':'⚡ Hybrid'}</Pill>
          {profile.ig && <Pill color={C.rose} bg={C.roseL}>@{profile.ig}</Pill>}
        </div>
      </div>

      {/* Alerts */}
      {stokRendah>0 && <div style={{background:C.roseL,border:`1px solid ${C.rose}44`,borderRadius:10,padding:'11px 14px',display:'flex',gap:8,alignItems:'center'}}><Ic p={I.warn} s={15} c={C.rose}/><span style={{fontSize:13,color:C.rose,fontWeight:700}}>{stokRendah} bahan hampir habis!</span></div>}
      {pendingOrd>0 && <div style={{background:C.tealL,border:`1px solid ${C.teal}44`,borderRadius:10,padding:'11px 14px',display:'flex',gap:8,alignItems:'center'}}><Ic p={I.order} s={15} c={C.teal}/><span style={{fontSize:13,color:C.teal,fontWeight:700}}>{pendingOrd} order sedang diproses</span></div>}

      {/* KPI */}
      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:10}}>
        <KPI label="Modal Awal"       value={idr(totalModal)} color={C.amber} icon={I.chart}/>
        <KPI label="Target Omzet/Bln" value={idr(target)}     color={C.sage}  icon={I.trend}/>
        <KPI label="Laba Proyeksi"    value={idr(labaBulan)}  color={labaBulan>=0?C.teal:C.rose} sub={`Margin ${target>0?pct(labaBulan/target):'–'}`} icon={I.money}/>
        <KPI label="Break Even"       value={bep>0?`Bln ke-${bep}`:'–'} color={C.gold} icon={I.clock}/>
      </div>

      {/* Top produk */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16}}>
        <div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:12}}>🏆 Produk Margin Terbaik</div>
        {topProduk.length===0
          ? <div style={{fontSize:13,color:C.text3,fontStyle:'italic'}}>Belum ada produk</div>
          : topProduk.map(p=>(
            <div key={p.id} style={{marginBottom:12}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:600,color:C.text}}>{p.nama||'(tanpa nama)'}</span>
                <span style={{fontSize:12,fontWeight:700,color:p.line==='premium'?C.purple:C.teal}}>+{idr(p.profit)}</span>
              </div>
              <Bar val={p.margin} max={1} color={p.margin>0.5?C.sage:p.margin>0.3?C.amber:C.rose}/>
              <div style={{fontSize:10,color:C.text3,marginTop:2}}>Margin {pct(p.margin)} · {idr(p.hargaJual)}/pcs</div>
            </div>
          ))
        }
      </div>

      {/* Stok bahan mini */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16}}>
        <div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:12}}>📦 Status Stok Bahan</div>
        {bahan.slice(0,5).map(b=>{
          const low=b.stok<=b.min
          return (
            <div key={b.id} style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:12,color:low?C.rose:C.text,fontWeight:low?700:400}}>{b.nama} {low&&'⚠️'}</span>
                <span style={{fontSize:11,color:C.text3}}>{b.stok} {b.satuan}</span>
              </div>
              <Bar val={b.stok} max={b.min*3} color={low?C.rose:C.sage}/>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── PAGE: PRODUK ───────────────────────────────────────────────────────────
const PageProduk = ({produk,profile,onAdd,onDel,onUpd,loading,isMobile}) => {
  const [tab,setTab] = useState('all')
  const KATS = ['Dekorasi','Aksesoris','Custom','Souvenir','Lainnya']
  const CHANNELS = ['Instagram','Instagram DM','TikTok','Shopee','Tokopedia','WhatsApp','Offline']

  const calcPrice = p => {
    const tenaga = (p.waktu||0)*(profile.hargaTenagaPerJam||20000)
    const over   = (p.bahanCost+tenaga)*((p.overhead||20)/100)
    const hpp    = p.bahanCost+tenaga+over
    const jual   = hpp*(1+(p.markup||200)/100)
    return {hpp,hargaJual:jual,profit:jual-hpp,margin:jual>0?(jual-hpp)/jual:0,tenaga,over}
  }

  const filtered = tab==='all'?produk:produk.filter(p=>p.line===tab)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <SH icon={I.box} title="Produk & Harga" sub="Harga dihitung otomatis dari HPP + tenaga + overhead + markup" color={C.rose}/>

      {/* Tab */}
      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
        {[['all','Semua',C.amber],['premium','🎨 Premium',C.purple],['volume','📦 Volume',C.teal]].map(([id,lbl,col])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{padding:'7px 14px',border:`1.5px solid ${tab===id?col:C.border}`,borderRadius:8,background:tab===id?col+'18':'transparent',color:tab===id?col:C.text2,cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:'inherit'}}>
            {lbl}
          </button>
        ))}
      </div>

      {loading && <Spinner/>}

      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
        {filtered.map(item=>{
          const {hpp,hargaJual,profit,margin,tenaga,over} = calcPrice(item)
          const col = item.line==='premium'?C.purple:C.teal
          return (
            <div key={item.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:'hidden',borderTop:`3px solid ${col}`}}>
              <div style={{padding:'12px 14px',borderBottom:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',gap:6}}>
                  <Pill color={col} bg={col+'18'}>{item.line==='premium'?'Premium':'Volume'}</Pill>
                  <Pill color={C.text2} bg={C.border}>{item.kategori}</Pill>
                </div>
                <DelBtn onClick={()=>onDel(item.id)}/>
              </div>
              <div style={{padding:'12px 14px',display:'flex',flexDirection:'column',gap:10}}>
                <input value={item.nama} onChange={e=>onUpd(item.id,'nama',e.target.value)} placeholder="Nama produk..."
                  style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.text,fontFamily:'inherit',fontSize:14,fontWeight:700,width:'100%'}}/>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  <Inp label="HPP Bahan (Rp)" value={item.bahanCost} onChange={v=>onUpd(item.id,'bahanCost',v)} type="number"/>
                  <Inp label="Waktu (jam)" value={item.waktu} onChange={v=>onUpd(item.id,'waktu',v)} type="number" suf="j"/>
                  <Inp label="Overhead (%)" value={item.overhead} onChange={v=>onUpd(item.id,'overhead',v)} type="number" suf="%"/>
                  <Inp label="Markup (%)" value={item.markup} onChange={v=>onUpd(item.id,'markup',v)} type="number" suf="%"/>
                </div>
                <div style={{background:col+'10',border:`1px solid ${col}33`,borderRadius:10,padding:'10px 12px'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginBottom:8}}>
                    {[['HPP Total',idr(hpp)],['💰 Jual',idr(hargaJual)],['Profit/pcs',idr(profit)]].map(([l,v])=>(
                      <div key={l} style={{textAlign:'center'}}>
                        <div style={{fontSize:10,color:C.text2,marginBottom:1}}>{l}</div>
                        <div style={{fontSize:12,fontWeight:800,color:l.includes('💰')?col:C.text}}>{v}</div>
                      </div>
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
        <AddBtn onClick={()=>onAdd('volume')}  label="+ Volume"  color={C.teal}/>
      </div>
    </div>
  )
}

// ── PAGE: ORDER ────────────────────────────────────────────────────────────
const PageOrder = ({orders,onAdd,onDel,onUpd,loading,isMobile}) => {
  const STATUS   = ['Pending','Proses','Selesai','Dikirim','Batal']
  const PLATFORM = ['Instagram DM','WhatsApp','Shopee','Tokopedia','TikTok Shop','Offline']
  const sCol = {Pending:C.gold,Proses:C.amber,Selesai:C.sage,Dikirim:C.teal,Batal:C.rose}

  const total    = orders.filter(o=>o.status!=='Batal').reduce((s,o)=>s+(o.total||0),0)
  const dpMasuk  = orders.filter(o=>['Proses','Pending'].includes(o.status)).reduce((s,o)=>s+(o.dp||0),0)
  const stCounts = STATUS.reduce((a,s)=>({...a,[s]:orders.filter(o=>o.status===s).length}),{})

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <SH icon={I.order} title="Tracker Order" sub="Catat semua pesanan dari semua platform" color={C.teal}/>

      {/* Status summary */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8}}>
        {STATUS.map(s=>(
          <div key={s} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 8px',textAlign:'center',borderTop:`2px solid ${sCol[s]}`}}>
            <div style={{fontSize:isMobile?18:22,fontWeight:900,color:sCol[s]}}>{stCounts[s]||0}</div>
            <div style={{fontSize:9,fontWeight:700,color:C.text2,textTransform:'uppercase',letterSpacing:'0.04em',marginTop:2}}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <div style={{background:C.sageL,border:`1px solid ${C.sage}33`,borderRadius:10,padding:'11px 14px'}}>
          <div style={{fontSize:11,color:C.sage,fontWeight:600,marginBottom:2}}>Total Omzet</div>
          <div style={{fontSize:16,fontWeight:900,color:C.sage}}>{idr(total)}</div>
        </div>
        <div style={{background:C.amberL,border:`1px solid ${C.amber}33`,borderRadius:10,padding:'11px 14px'}}>
          <div style={{fontSize:11,color:C.amber,fontWeight:600,marginBottom:2}}>DP Masuk</div>
          <div style={{fontSize:16,fontWeight:900,color:C.amber}}>{idr(dpMasuk)}</div>
        </div>
      </div>

      {loading && <Spinner/>}

      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {orders.length===0 && !loading && (
          <div style={{background:C.card,border:`2px dashed ${C.border}`,borderRadius:12,padding:28,textAlign:'center',color:C.text3,fontSize:13,fontStyle:'italic'}}>
            Belum ada order. Catat pesanan pertama kamu!
          </div>
        )}
        {orders.map(o=>(
          <div key={o.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:'12px 14px',borderLeft:`3px solid ${sCol[o.status]||C.border}`}}>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'1fr 1fr 50px 110px 100px',gap:8,marginBottom:8}}>
              <input value={o.nama} onChange={e=>onUpd(o.id,'nama',e.target.value)} placeholder="Nama pemesan..."
                style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.text,fontFamily:'inherit',fontSize:13,fontWeight:700,gridColumn:isMobile?'span 2':'auto'}}/>
              <input value={o.produk} onChange={e=>onUpd(o.id,'produk',e.target.value)} placeholder="Produk..."
                style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.text2,fontFamily:'inherit',fontSize:13,gridColumn:isMobile?'span 2':'auto'}}/>
              {!isMobile && <input type="number" value={o.qty||''} onChange={e=>onUpd(o.id,'qty',parseInt(e.target.value)||1)} min={1}
                style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.text,fontFamily:'inherit',fontSize:13,textAlign:'center',width:'100%'}}/>}
              <input type="number" value={o.total||''} onChange={e=>onUpd(o.id,'total',parseFloat(e.target.value)||0)} placeholder="Total..."
                style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.amber,fontFamily:'inherit',fontSize:13,fontWeight:700,textAlign:'right',width:'100%'}}/>
              {!isMobile && <input type="number" value={o.dp||''} onChange={e=>onUpd(o.id,'dp',parseFloat(e.target.value)||0)} placeholder="DP..."
                style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.sage,fontFamily:'inherit',fontSize:13,textAlign:'right',width:'100%'}}/>}
            </div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
              <select value={o.platform} onChange={e=>onUpd(o.id,'platform',e.target.value)}
                style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,outline:'none',color:C.text2,fontFamily:'inherit',fontSize:11,padding:'4px 8px',cursor:'pointer'}}>
                {PLATFORM.map(p=><option key={p}>{p}</option>)}
              </select>
              <select value={o.status} onChange={e=>onUpd(o.id,'status',e.target.value)}
                style={{background:sCol[o.status]+'18',border:`1px solid ${sCol[o.status]}44`,borderRadius:6,outline:'none',color:sCol[o.status],fontFamily:'inherit',fontSize:11,fontWeight:700,padding:'4px 8px',cursor:'pointer'}}>
                {STATUS.map(s=><option key={s}>{s}</option>)}
              </select>
              {o.deadline && <span style={{fontSize:11,color:C.text3}}>📅 {o.deadline}</span>}
              <div style={{marginLeft:'auto'}}><DelBtn onClick={()=>onDel(o.id)}/></div>
            </div>
            <input value={o.catatan||''} onChange={e=>onUpd(o.id,'catatan',e.target.value)} placeholder="Catatan / request khusus..."
              style={{marginTop:8,width:'100%',background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.text3,fontFamily:'inherit',fontSize:12,fontStyle:'italic'}}/>
          </div>
        ))}
      </div>
      <AddBtn onClick={onAdd} label="Tambah Order" color={C.teal}/>
    </div>
  )
}

// ── PAGE: BAHAN ────────────────────────────────────────────────────────────
const PageBahan = ({bahan,onAdd,onDel,onUpd,loading,isMobile}) => (
  <div style={{display:'flex',flexDirection:'column',gap:16}}>
    <SH icon={I.tools} title="Stok Bahan" sub="Pantau stok dan harga bahan baku resin art" color={C.teal}/>

    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
      {[{l:'Total Bahan',v:bahan.length,c:C.teal},{l:'Hampir Habis',v:bahan.filter(b=>b.stok>0&&b.stok<=b.min).length,c:C.gold},{l:'Habis',v:bahan.filter(b=>b.stok===0).length,c:C.rose}].map(s=>(
        <div key={s.l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:'12px 14px',borderTop:`3px solid ${s.c}`}}>
          <div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div>
          <div style={{fontSize:10,fontWeight:700,color:C.text2,textTransform:'uppercase',letterSpacing:'0.06em',marginTop:2}}>{s.l}</div>
        </div>
      ))}
    </div>

    {loading && <Spinner/>}

    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      {bahan.map(b=>{
        const habis=b.stok===0, low=b.stok>0&&b.stok<=b.min
        return (
          <div key={b.id} style={{background:habis?C.roseL+'80':low?C.goldL+'80':C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:'12px 14px'}}>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 80px 32px':'1fr 80px 100px 100px 100px 32px',gap:8,alignItems:'center',marginBottom:isMobile?8:0}}>
              <input value={b.nama} onChange={e=>onUpd(b.id,'nama',e.target.value)} placeholder="Nama bahan..."
                style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:habis?C.rose:low?C.gold:C.text,fontFamily:'inherit',fontSize:13,fontWeight:(habis||low)?700:400}}/>
              <div style={{textAlign:'center'}}>
                {habis?<Pill color={C.rose} bg={C.roseL}>Habis!</Pill>:low?<Pill color={C.gold} bg={C.goldL}>Tipis</Pill>:<Pill color={C.sage} bg={C.sageL}>Aman</Pill>}
              </div>
              {!isMobile && <>
                <input type="number" value={b.hpp||''} onChange={e=>onUpd(b.id,'hpp',parseFloat(e.target.value)||0)} placeholder="Harga/satuan"
                  style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.text,fontFamily:'inherit',fontSize:13,textAlign:'right',width:'100%'}}/>
                <input type="number" value={b.stok||''} onChange={e=>onUpd(b.id,'stok',parseFloat(e.target.value)||0)}
                  style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:habis?C.rose:low?C.gold:C.text,fontFamily:'inherit',fontSize:13,textAlign:'right',width:'100%'}}/>
                <input type="number" value={b.min||''} onChange={e=>onUpd(b.id,'min',parseFloat(e.target.value)||0)}
                  style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.text2,fontFamily:'inherit',fontSize:13,textAlign:'right',width:'100%'}}/>
              </>}
              <DelBtn onClick={()=>onDel(b.id)}/>
            </div>
            {isMobile && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:8}}>
                <Inp label="Harga/satuan" value={b.hpp} onChange={v=>onUpd(b.id,'hpp',v)} type="number"/>
                <Inp label={`Stok (${b.satuan})`} value={b.stok} onChange={v=>onUpd(b.id,'stok',v)} type="number"/>
                <Inp label="Stok Min" value={b.min} onChange={v=>onUpd(b.id,'min',v)} type="number"/>
              </div>
            )}
            <Bar val={b.stok} max={b.min*3} color={habis?C.rose:low?C.gold:C.sage} h={4}/>
          </div>
        )
      })}
    </div>
    <AddBtn onClick={onAdd} label="Tambah Bahan" color={C.teal}/>
  </div>
)

// ── PAGE: KEUANGAN ─────────────────────────────────────────────────────────
const PageKeuangan = ({operasional,modal,onUpdOps,onAddOps,onDelOps,onUpdModal,onAddModal,onDelModal,isMobile}) => {
  const totalOps  = operasional.items.reduce((s,i)=>s+(i.amt||0),0)
  const totalMod  = modal.reduce((s,i)=>s+(i.harga||0),0)
  const target    = operasional.targetOmzet||0
  const laba      = target-totalOps
  const bep       = laba>0?Math.ceil(totalMod/laba):0
  const g         = (operasional.growthRate||20)/100

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <SH icon={I.money} title="Keuangan" sub="Modal, biaya operasional, dan proyeksi keuntungan" color={C.sage}/>

      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:10}}>
        <KPI label="Modal Awal"      value={idr(totalMod)}  color={C.amber} icon={I.chart}/>
        <KPI label="Target Omzet"   value={idr(target)}    color={C.sage}  icon={I.trend}/>
        <KPI label="Biaya Ops/Bln"  value={idr(totalOps)}  color={C.rose}  icon={I.warn}/>
        <KPI label="Break Even"     value={bep>0?`Bln ke-${bep}`:'–'} color={C.gold} sub={laba>0?`Laba ${idr(laba)}/bln`:''} icon={I.clock}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
        <Inp label="🎯 Target Omzet per Bulan (Rp)" value={operasional.targetOmzet}
          onChange={v=>onUpdOps('targetOmzet',v)} type="number"/>
        <Inp label="📈 Target Pertumbuhan (%/bln)" value={operasional.growthRate}
          onChange={v=>onUpdOps('growthRate',v)} type="number" suf="%"/>
      </div>

      {/* Modal */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden'}}>
        <div style={{padding:'12px 16px',background:C.amberL,borderBottom:`1px solid ${C.amber}33`,display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:14,fontWeight:800,color:C.text}}>💰 Modal Awal</span>
          <span style={{fontSize:14,fontWeight:900,color:C.amber}}>{idr(totalMod)}</span>
        </div>
        {modal.map(item=>(
          <div key={item.id} style={{display:'grid',gridTemplateColumns:'1fr 130px 32px',gap:8,padding:'9px 14px',borderTop:`1px solid ${C.border}`,alignItems:'center'}}>
            <input value={item.nama} onChange={e=>onUpdModal(item.id,'nama',e.target.value)} placeholder="Nama item..."
              style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.text,fontFamily:'inherit',fontSize:13}}/>
            <input type="number" value={item.harga||''} onChange={e=>onUpdModal(item.id,'harga',parseFloat(e.target.value)||0)}
              style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.amber,fontFamily:'inherit',fontSize:13,fontWeight:700,textAlign:'right',width:'100%'}}/>
            <DelBtn onClick={()=>onDelModal(item.id)}/>
          </div>
        ))}
        <div style={{padding:'8px 12px',borderTop:`1px solid ${C.border}`}}>
          <AddBtn onClick={onAddModal} label="Tambah Item" color={C.amber}/>
        </div>
      </div>

      {/* Ops */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden'}}>
        <div style={{padding:'12px 16px',background:C.roseL,borderBottom:`1px solid ${C.rose}33`,display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:14,fontWeight:800,color:C.text}}>💸 Biaya Operasional/Bulan</span>
          <span style={{fontSize:14,fontWeight:900,color:C.rose}}>{idr(totalOps)}</span>
        </div>
        {operasional.items.map(op=>(
          <div key={op.id} style={{display:'grid',gridTemplateColumns:'1fr 130px 32px',gap:8,padding:'9px 14px',borderTop:`1px solid ${C.border}`,alignItems:'center'}}>
            <input value={op.nama} onChange={e=>onUpdOps('item',op.id,'nama',e.target.value)} placeholder="Nama biaya..."
              style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.text,fontFamily:'inherit',fontSize:13}}/>
            <input type="number" value={op.amt||''} onChange={e=>onUpdOps('item',op.id,'amt',parseFloat(e.target.value)||0)}
              style={{background:'transparent',border:'none',borderBottom:`1px dashed ${C.border2}`,outline:'none',color:C.rose,fontFamily:'inherit',fontSize:13,fontWeight:700,textAlign:'right',width:'100%'}}/>
            <DelBtn onClick={()=>onDelOps(op.id)}/>
          </div>
        ))}
        <div style={{padding:'8px 12px',borderTop:`1px solid ${C.border}`}}>
          <AddBtn onClick={onAddOps} label="Tambah Biaya" color={C.rose}/>
        </div>
      </div>

      {/* Proyeksi 6 bulan */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden'}}>
        <div style={{padding:'12px 16px',background:C.sageL,borderBottom:`1px solid ${C.sage}33`}}>
          <span style={{fontSize:14,fontWeight:800,color:C.text}}>📈 Proyeksi 6 Bulan</span>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:500}}>
            <thead>
              <tr style={{background:C.bg}}>
                {['',1,2,3,4,5,6].map((h,i)=>(
                  <td key={i} style={{padding:'8px 12px',fontSize:10,fontWeight:700,color:C.text3,textTransform:'uppercase',letterSpacing:'0.06em',textAlign:i>0?'right':'left',borderBottom:`1px solid ${C.border}`}}>
                    {i===0?'':(`Bln ${h}`)}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {l:'Omzet',  fn:m=>target*Math.pow(1+g,m), c:C.sage,  bold:false},
                {l:'Biaya',  fn:m=>totalOps*Math.pow(1+g*0.4,m), c:C.rose, bold:false},
                {l:'Laba',   fn:m=>(target*Math.pow(1+g,m))-(totalOps*Math.pow(1+g*0.4,m)), c:C.amber, bold:true},
              ].map(row=>(
                <tr key={row.l} style={{background:row.bold?row.c+'0D':'transparent'}}>
                  {[null,0,1,2,3,4,5].map((m,i)=>(
                    <td key={i} style={{padding:'8px 12px',fontSize:i===0?12:13,fontWeight:i===0?700:(row.bold?800:400),color:i===0?C.text2:row.c,textAlign:i>0?'right':'left',borderBottom:`1px solid ${C.border}`}}>
                      {i===0?row.l:idr(row.fn(m))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── PAGE: PROFIL & STRATEGI ────────────────────────────────────────────────
const PageProfil = ({profile,onUpd,isMobile}) => {
  const STRAT = [
    {id:'premium',label:'🎨 Premium',col:C.purple,desc:'Margin tinggi, volume kecil, brand kuat.',pros:['Margin 150–300%','Harga sendiri','Pelanggan loyal'],cons:['Produksi lebih lama','Foto & branding penting']},
    {id:'volume', label:'📦 Volume', col:C.teal,  desc:'Ready stock massal, marketplace.',pros:['Cash flow stabil','Mudah scale up'],cons:['Perang harga','Margin 30–60%']},
    {id:'hybrid', label:'⚡ Hybrid', col:C.amber, desc:'Premium untuk brand, volume untuk cash flow.',pros:['Best of both','Risiko tersebar','Fleksibel'],cons:['Butuh manajemen dua lini']},
  ]
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <SH icon={I.user} title="Profil & Strategi" color={C.amber}/>
      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
        <Inp label="Nama Brand" value={profile.nama} onChange={v=>onUpd('nama',v)} ph="Resin by Arya"/>
        <Inp label="Tagline" value={profile.tagline} onChange={v=>onUpd('tagline',v)} ph="Handcrafted with love"/>
        <Inp label="Instagram" value={profile.ig} onChange={v=>onUpd('ig',v)} ph="tanpa @" pre="@"/>
        <Inp label="Marketplace" value={profile.marketplace} onChange={v=>onUpd('marketplace',v)} ph="Shopee / Tokopedia"/>
        <Inp label="Kota" value={profile.lokasi} onChange={v=>onUpd('lokasi',v)} ph="Jakarta Selatan"/>
        <Inp label="Tarif Tenaga/Jam (Rp)" value={profile.hargaTenagaPerJam} onChange={v=>onUpd('hargaTenagaPerJam',parseFloat(v)||0)} type="number"/>
      </div>
      <div>
        <div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:12}}>⚡ Pilih Strategi Bisnis</div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:10}}>
          {STRAT.map(s=>{
            const active=profile.strategi===s.id
            return (
              <div key={s.id} onClick={()=>onUpd('strategi',s.id)}
                style={{background:active?s.col+'14':C.card,border:`2px solid ${active?s.col:C.border}`,borderRadius:14,padding:16,cursor:'pointer',transition:'all .2s'}}>
                <div style={{fontSize:14,fontWeight:800,color:active?s.col:C.text,marginBottom:4}}>{s.label}</div>
                <div style={{fontSize:12,color:C.text2,marginBottom:10,lineHeight:1.5}}>{s.desc}</div>
                {s.pros.map(p=><div key={p} style={{fontSize:11,color:C.sage,marginBottom:2}}>✓ {p}</div>)}
                {s.cons.map(c=><div key={c} style={{fontSize:11,color:C.rose,marginBottom:2}}>✗ {c}</div>)}
                {active && <div style={{marginTop:10,padding:'5px 10px',background:s.col,borderRadius:6,textAlign:'center',fontSize:11,fontWeight:700,color:'#fff'}}>✓ Aktif</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
const PAGES = [
  {id:'dash',    label:'Dashboard',  icon:I.home,  color:C.amber},
  {id:'profil',  label:'Profil',     icon:I.user,  color:C.purple},
  {id:'produk',  label:'Produk',     icon:I.box,   color:C.rose},
  {id:'order',   label:'Order',      icon:I.order, color:C.teal},
  {id:'bahan',   label:'Stok',       icon:I.tools, color:C.teal},
  {id:'keuangan',label:'Keuangan',   icon:I.money, color:C.sage},
]

export default function App() {
  const [user,     setUser]     = useState(null)
  const [authLoading,setAuthLoading] = useState(true)
  const [page,     setPage]     = useState('dash')
  const [toast,    setToast]    = useState(null)
  const [syncing,  setSyncing]  = useState(false)
  const [mobileNav,setMobileNav]= useState(false)

  // Data state
  const [profile,    setProfile]    = useState({nama:'',tagline:'',ig:'',marketplace:'',lokasi:'',strategi:'hybrid',hargaTenagaPerJam:20000})
  const [produk,     setProduk]     = useState([])
  const [bahan,      setBahan]      = useState([])
  const [orders,     setOrders]     = useState([])
  const [modal,      setModal]      = useState([])
  const [operasional,setOperasional]= useState({items:[],targetOmzet:3000000,growthRate:20})
  const [loadingData,setLoadingData]= useState(false)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const showToast = (msg,type='success') => {
    setToast({msg,type})
    setTimeout(()=>setToast(null),3000)
  }

  // ── AUTH ──
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user||null)
      setAuthLoading(false)
    })
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session)=>{
      setUser(session?.user||null)
    })
    return ()=>subscription.unsubscribe()
  },[])

  // ── LOAD DATA ──
  useEffect(()=>{
    if(!user) return
    loadAll()
  },[user])

  const loadAll = async () => {
    setLoadingData(true)
    try {
      const uid = user.id
      const [p,pr,b,o,m,op] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id',uid).single(),
        supabase.from('produk').select('*').eq('user_id',uid).order('created_at'),
        supabase.from('bahan').select('*').eq('user_id',uid).order('created_at'),
        supabase.from('orders').select('*').eq('user_id',uid).order('created_at',{ascending:false}),
        supabase.from('modal').select('*').eq('user_id',uid).order('created_at'),
        supabase.from('operasional').select('*').eq('user_id',uid).single(),
      ])
      if(p.data)  setProfile(p.data)
      if(pr.data) setProduk(pr.data)
      if(b.data)  setBahan(b.data)
      if(o.data)  setOrders(o.data)
      if(m.data)  setModal(m.data)
      if(op.data) setOperasional(op.data)
    } catch(e) {
      // First login — no data yet, that's ok
    }
    setLoadingData(false)
  }

  // ── SAVE PROFILE ──
  const saveProfile = async (updated) => {
    setSyncing(true)
    const {error} = await supabase.from('profiles').upsert({...updated,user_id:user.id},{onConflict:'user_id'})
    if(error) showToast('Gagal simpan profil','error')
    else showToast('Profil tersimpan!')
    setSyncing(false)
  }

  const updProfile = (k,v) => {
    const updated = {...profile,[k]:v}
    setProfile(updated)
  }
  const saveProfileNow = () => saveProfile(profile)

  // ── PRODUK CRUD ──
  const addProduk = async (line) => {
    const item = {id:uid(),user_id:user.id,nama:'',line,kategori:'Aksesoris',waktu:2,bahanCost:0,overhead:20,markup:line==='premium'?200:150,stok:0,channelUtama:line==='premium'?'Instagram':'Shopee',minOrder:1,created_at:new Date().toISOString()}
    const {data,error} = await supabase.from('produk').insert(item).select().single()
    if(error) showToast('Gagal tambah produk','error')
    else { setProduk(p=>[...p,data||item]); showToast('Produk ditambahkan!') }
  }
  const delProduk = async (id) => {
    setProduk(p=>p.filter(x=>x.id!==id))
    await supabase.from('produk').delete().eq('id',id).eq('user_id',user.id)
  }
  const updProduk = async (id,k,v) => {
    setProduk(p=>p.map(x=>x.id===id?{...x,[k]:v}:x))
    await supabase.from('produk').update({[k]:v}).eq('id',id).eq('user_id',user.id)
  }

  // ── BAHAN CRUD ──
  const addBahan = async () => {
    const item = {id:uid(),user_id:user.id,nama:'',satuan:'gram',hpp:0,stok:0,min:50,created_at:new Date().toISOString()}
    const {data,error} = await supabase.from('bahan').insert(item).select().single()
    if(error) showToast('Gagal tambah bahan','error')
    else { setBahan(b=>[...b,data||item]); showToast('Bahan ditambahkan!') }
  }
  const delBahan = async (id) => {
    setBahan(b=>b.filter(x=>x.id!==id))
    await supabase.from('bahan').delete().eq('id',id).eq('user_id',user.id)
  }
  const updBahan = async (id,k,v) => {
    setBahan(b=>b.map(x=>x.id===id?{...x,[k]:v}:x))
    await supabase.from('bahan').update({[k]:v}).eq('id',id).eq('user_id',user.id)
  }

  // ── ORDER CRUD ──
  const addOrder = async () => {
    const item = {id:uid(),user_id:user.id,nama:'',produk:'',qty:1,total:0,dp:0,platform:'Instagram DM',status:'Pending',tgl:new Date().toISOString().slice(0,10),deadline:'',catatan:'',created_at:new Date().toISOString()}
    const {data,error} = await supabase.from('orders').insert(item).select().single()
    if(error) showToast('Gagal tambah order','error')
    else { setOrders(o=>[data||item,...o]); showToast('Order ditambahkan!') }
  }
  const delOrder = async (id) => {
    setOrders(o=>o.filter(x=>x.id!==id))
    await supabase.from('orders').delete().eq('id',id).eq('user_id',user.id)
  }
  const updOrder = async (id,k,v) => {
    setOrders(o=>o.map(x=>x.id===id?{...x,[k]:v}:x))
    await supabase.from('orders').update({[k]:v}).eq('id',id).eq('user_id',user.id)
  }

  // ── MODAL CRUD ──
  const addModal = async () => {
    const item = {id:uid(),user_id:user.id,nama:'',kategori:'Bahan',harga:0,created_at:new Date().toISOString()}
    const {data,error} = await supabase.from('modal').insert(item).select().single()
    if(error) showToast('Gagal tambah item','error')
    else setModal(m=>[...m,data||item])
  }
  const delModal = async (id) => {
    setModal(m=>m.filter(x=>x.id!==id))
    await supabase.from('modal').delete().eq('id',id).eq('user_id',user.id)
  }
  const updModal = async (id,k,v) => {
    setModal(m=>m.map(x=>x.id===id?{...x,[k]:v}:x))
    await supabase.from('modal').update({[k]:v}).eq('id',id).eq('user_id',user.id)
  }

  // ── OPERASIONAL ──
  const updOps = async (kOrAction,idOrVal,k,v) => {
    if(kOrAction==='item') {
      // update item
      const updated = {...operasional,items:operasional.items.map(i=>i.id===idOrVal?{...i,[k]:v}:i)}
      setOperasional(updated)
      await supabase.from('operasional').upsert({...updated,user_id:user.id},{onConflict:'user_id'})
    } else {
      // update top-level key
      const updated = {...operasional,[kOrAction]:idOrVal}
      setOperasional(updated)
      await supabase.from('operasional').upsert({...updated,user_id:user.id},{onConflict:'user_id'})
    }
  }
  const addOps = async () => {
    const newItem = {id:uid(),nama:'',amt:0}
    const updated = {...operasional,items:[...operasional.items,newItem]}
    setOperasional(updated)
    await supabase.from('operasional').upsert({...updated,user_id:user.id},{onConflict:'user_id'})
  }
  const delOps = async (id) => {
    const updated = {...operasional,items:operasional.items.filter(i=>i.id!==id)}
    setOperasional(updated)
    await supabase.from('operasional').upsert({...updated,user_id:user.id},{onConflict:'user_id'})
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProduk([]); setBahan([]); setOrders([]); setModal([])
    setProfile({nama:'',tagline:'',ig:'',marketplace:'',lokasi:'',strategi:'hybrid',hargaTenagaPerJam:20000})
    setOperasional({items:[],targetOmzet:3000000,growthRate:20})
  }

  const stokAlert = bahan.filter(b=>b.stok<=b.min).length

  // ── RENDER ──
  if(authLoading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:C.bg}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:40,marginBottom:12}}>🪬</div>
        <Spinner/>
      </div>
    </div>
  )

  if(!user) return <AuthPage onAuth={setUser}/>

  const curPage = PAGES.find(p=>p.id===page)

  const renderPage = () => {
    const common = {isMobile}
    switch(page) {
      case 'dash':     return <PageDash {...common} produk={produk} bahan={bahan} orders={orders} operasional={operasional} modal={modal} profile={profile}/>
      case 'profil':   return <PageProfil {...common} profile={profile} onUpd={updProfile}/>
      case 'produk':   return <PageProduk {...common} produk={produk} profile={profile} onAdd={addProduk} onDel={delProduk} onUpd={updProduk} loading={loadingData}/>
      case 'order':    return <PageOrder  {...common} orders={orders} onAdd={addOrder} onDel={delOrder} onUpd={updOrder} loading={loadingData}/>
      case 'bahan':    return <PageBahan  {...common} bahan={bahan} onAdd={addBahan} onDel={delBahan} onUpd={updBahan} loading={loadingData}/>
      case 'keuangan': return <PageKeuangan {...common} operasional={operasional} modal={modal} onUpdOps={updOps} onAddOps={addOps} onDelOps={delOps} onUpdModal={updModal} onAddModal={addModal} onDelModal={delModal}/>
      default:         return <PageDash {...common} produk={produk} bahan={bahan} orders={orders} operasional={operasional} modal={modal} profile={profile}/>
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Nunito',sans-serif;background:${C.bg};color:${C.text};min-height:100vh}
        input,textarea,select,button{font-family:'Nunito',sans-serif}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:${C.border2};border-radius:2px}
        input[type=number]::-webkit-inner-spin-button{opacity:.3}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes slideUp{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
        .pg{animation:fadeIn .2s ease}
        /* Mobile bottom nav */
        @media(max-width:767px){
          .desktop-sidebar{display:none!important}
          .mobile-topbar{display:flex!important}
          .mobile-bottom-nav{display:flex!important}
          .main-content{margin-left:0!important;padding-bottom:72px!important;padding-top:60px!important}
        }
        @media(min-width:768px){
          .mobile-topbar{display:none!important}
          .mobile-bottom-nav{display:none!important}
          .main-content{margin-left:220px!important;padding-top:0!important}
        }
      `}</style>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="desktop-sidebar" style={{width:220,background:C.surface,borderRight:`1px solid ${C.border}`,display:'flex',flexDirection:'column',position:'fixed',top:0,left:0,height:'100vh',zIndex:100}}>
        <div style={{padding:'18px 16px 14px',borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.amber},${C.gold})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🪬</div>
            <div>
              <div style={{fontSize:13,fontWeight:900,color:C.text}}>Resin Planner</div>
              <div style={{fontSize:10,color:C.text3,fontWeight:600}}>{profile.nama||user.email?.split('@')[0]}</div>
            </div>
          </div>
        </div>

        <nav style={{flex:1,padding:'10px 8px',overflowY:'auto'}}>
          {PAGES.map(p=>{
            const active=page===p.id
            return (
              <button key={p.id} onClick={()=>setPage(p.id)}
                style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:'10px 12px',borderRadius:9,border:'none',background:active?p.color+'16':'transparent',color:active?p.color:C.text2,cursor:'pointer',fontSize:13,fontWeight:active?700:500,textAlign:'left',marginBottom:2,fontFamily:'inherit',borderLeft:active?`2px solid ${p.color}`:'2px solid transparent'}}
                onMouseOver={e=>{if(!active){e.currentTarget.style.background=C.border;e.currentTarget.style.color=C.text}}}
                onMouseOut={e=>{if(!active){e.currentTarget.style.background='transparent';e.currentTarget.style.color=C.text2}}}>
                <Ic p={p.icon} s={15} c={active?p.color:C.text3}/>
                {p.label}
                {p.id==='bahan'&&stokAlert>0&&<span style={{marginLeft:'auto',fontSize:10,fontWeight:800,color:'#fff',background:C.rose,borderRadius:10,padding:'1px 6px'}}>{stokAlert}</span>}
              </button>
            )
          })}
        </nav>

        <div style={{padding:'10px 8px',borderTop:`1px solid ${C.border}`,display:'flex',flexDirection:'column',gap:6}}>
          {page==='profil' && (
            <button onClick={saveProfileNow} disabled={syncing}
              style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'9px',borderRadius:9,border:'none',background:C.amber,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:800,fontFamily:'inherit'}}>
              <Ic p={syncing?I.sync:I.save} s={13} c="#fff"/> {syncing?'Menyimpan...':'Simpan Profil'}
            </button>
          )}
          <button onClick={logout}
            style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'9px',borderRadius:9,border:`1px solid ${C.border}`,background:'transparent',color:C.text2,cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:'inherit'}}>
            <Ic p={I.logout} s={13} c={C.text2}/> Keluar
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOPBAR ── */}
      <div className="mobile-topbar" style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:C.surface,borderBottom:`1px solid ${C.border}`,padding:'10px 16px',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:20}}>🪬</span>
          <span style={{fontSize:14,fontWeight:900,color:C.text}}>{curPage?.label}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {stokAlert>0 && <span style={{fontSize:10,fontWeight:800,color:'#fff',background:C.rose,borderRadius:10,padding:'2px 7px'}}>{stokAlert} ⚠️</span>}
          {page==='profil' && (
            <button onClick={saveProfileNow} style={{padding:'6px 12px',border:'none',borderRadius:8,background:C.amber,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
              Simpan
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content" style={{marginLeft:220,padding:'20px 24px',minHeight:'100vh'}}>
        <div style={{maxWidth:1080,width:'100%'}} key={page} className="pg">
          {renderPage()}
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="mobile-bottom-nav" style={{position:'fixed',bottom:0,left:0,right:0,zIndex:100,background:C.surface,borderTop:`1px solid ${C.border}`,padding:'8px 4px',paddingBottom:'calc(8px + env(safe-area-inset-bottom))',justifyContent:'space-around',alignItems:'center'}}>
        {PAGES.map(p=>{
          const active=page===p.id
          return (
            <button key={p.id} onClick={()=>setPage(p.id)}
              style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'4px 8px',border:'none',background:'transparent',cursor:'pointer',fontFamily:'inherit',position:'relative',flex:1}}>
              <div style={{width:32,height:32,borderRadius:10,background:active?p.color+'18':'transparent',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s'}}>
                <Ic p={p.icon} s={18} c={active?p.color:C.text3}/>
              </div>
              <span style={{fontSize:9,fontWeight:active?800:500,color:active?p.color:C.text3,letterSpacing:'0.04em'}}>{p.label}</span>
              {p.id==='bahan'&&stokAlert>0&&<span style={{position:'absolute',top:2,right:6,fontSize:9,fontWeight:800,color:'#fff',background:C.rose,borderRadius:8,padding:'0px 4px'}}>{stokAlert}</span>}
            </button>
          )
        })}
      </nav>

      {toast && <Toast msg={toast.msg} type={toast.type}/>}
    </>
  )
}
