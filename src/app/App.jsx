import React, {useMemo, useState, useEffect} from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import Home from '../pages/Home.jsx'
import Complaints from '../pages/Complaints.jsx'
import Achievements from '../pages/Achievements.jsx'
import Structure from '../pages/Structure.jsx'

const STRINGS = {
    en: {
        brand:"Student Advisory Council",
        home:"Home",
        complaints:"Complaints & Suggestions",
        achievements:"Achievements",
        structure:"Council Structure",
        heroTitle:"The Student Advisory Council",
        heroBody:"Represents the voice of students and reinforces their role in the decision-making process.",
        ctaComplaints:"Go to Complaints",
        ctaLearn:"Learn more",
        footerNote:"All rights reserved",
        // lang:"Language",
        followUs:"Follow Us",
        university:"King Fahd University of Petroleum & Minerals",
        deanshipStudentAffairs:"Deanship of Student Affairs",
        contactUs:"Contact Us"
    },
    ar: {
        brand:"المجلس الاستشاري الطلابي",
        home:"الرئيسية",
        complaints:"الشكاوى والمقترحات",
        achievements:"إنجازات المجلس",
        structure:"هيكلة المجلس",
        heroTitle:"المجلس الاستشاري الطلابي",
        heroBody:"لتمثيل صوت الطلاب وتأكيد دورهم في صناعة القرار",
        ctaComplaints:"الذهاب لصفحة الشكاوى والمقترحات",
        ctaLearn:"اعرف المزيد",
        footerNote:"جميع الحقوق محفوظة",
        // lang:"اللغة",
        followUs:"تابعنا",
        university:"جامعة الملك فهد للبترول والمعادن",
        deanshipStudentAffairs:"عمادة شؤون الطلاب",
        contactUs:"تواصل معنا"
    }
}

export default function App(){
    const location = useLocation()
    const navigate = useNavigate()
    const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ar')
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr'
        document.documentElement.lang = lang
        localStorage.setItem('lang', lang)

        // تطبيق الخط المناسب
        if (lang === 'ar') {
            document.body.style.fontFamily = `'CouncilArabic', 'Tajawal', -apple-system, sans-serif`
        } else {
            document.body.style.fontFamily = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
        }

        // إضافة CSS ديناميكي للعناوين بالإنجليزي
        let styleElement = document.getElementById('dynamic-typography')
        if (!styleElement) {
            styleElement = document.createElement('style')
            styleElement.id = 'dynamic-typography'
            document.head.appendChild(styleElement)
        }

        if (lang === 'en') {
            styleElement.textContent = `
            body, p, div, span {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
            .hero h1 {
                font-size: 28px !important;
                font-weight: 700 !important;
                letter-spacing: -0.02em !important;
            }
            .card h3 {
                font-size: 18px !important;
                font-weight: 600 !important;
            }
            .hd {
                font-size: 16px !important;
                font-weight: 700 !important;
            }
            .link {
                font-size: 14px !important;
            }
        `
        } else {
            styleElement.textContent = ''
        }
    }, [lang])

    const t = useMemo(() => STRINGS[lang], [lang])
    const isActive = (p) => location.pathname === p

    return (
        <div>
            {/*<nav className="nav" style={{*/}
            {/*    boxShadow: scrolled ? '0 8px 30px rgba(0, 0, 0, 0.12)' : '0 4px 20px rgba(0, 0, 0, 0.05)',*/}
            {/*    transition: 'all 0.3s ease'*/}
            {/*}}>*/}
            <nav className="nav" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                width: '100%',
                zIndex: 9999,
                boxShadow: scrolled
                    ? '0 8px 30px rgba(0, 0, 0, 0.12)'
                    : '0 4px 20px rgba(0, 0, 0, 0.05)',
                transition: 'box-shadow 0.3s ease'
            }}>


                <div className="nav-inner container">
                    <Link to="/" className="brand">
                        <img src="/logo.png" alt="Council logo" />
                        <div>
                            <div className="ttl" style={{fontFamily:"'Inter', Arial, sans-serif", fontWeight:"bold", fontSize: '18px'}}>
                                SAC
                            </div>
                            <div style={{fontSize: 12, color: '#6b7280', fontWeight: '500'}}>
                                {t.brand}
                            </div>
                        </div>
                    </Link>

                    <div className="links">
                        <Link className={"link " + (isActive('/') ? 'active' : '')} to="/">{t.home}</Link>
                        <Link className={"link " + (isActive('/complaints') ? 'active' : '')} to="/complaints">{t.complaints}</Link>
                        <Link className={"link " + (isActive('/achievements') ? 'active' : '')} to="/achievements">{t.achievements}</Link>
                        <Link className={"link " + (isActive('/structure') ? 'active' : '')} to="/structure">{t.structure}</Link>
                    </div>

                    <div className="lang">
                        <span style={{fontSize: 12, color: '#6b7280', fontWeight: '600'}}>{t.lang}</span>
                        <button className={lang === 'ar' ? 'active' : ''} onClick={() => setLang('ar')} style={{fontFamily: 'CouncilArabic, Tajawal, sans-serif'}}>AR</button>
                        <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')} style={{fontFamily: 'Inter, sans-serif'}}>EN</button>
                    </div>
                </div>
            </nav>

            <div style={{height: '80px'}}></div>

            <Routes>
                <Route path="/" element={<Home t={t} lang={lang}/>} />
                <Route path="/complaints" element={<Complaints t={t} lang={lang}/>} />
                <Route path="/achievements" element={<Achievements t={t} lang={lang}/>} />
                <Route path="/structure" element={<Structure t={t} lang={lang}/>} />
            </Routes>

            {/* FOOTER */}
            <div style={{
                marginTop: '60px',
                background: '#FFFFFF',
                borderTop: '1px solid #E5E7EB',
                padding: '40px 20px 24px'
            }}>
                <div className="container">
                    {/* Simple Grid Layout */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '48px',
                        marginBottom: '32px'
                    }}>
                        {/* Contact Us */}
                        <div>
                            <h4 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '12px'
                            }}>
                                {t.contactUs}
                            </h4>
                            <a
                                href="mailto:sac@kfupm.edu.sa"
                                style={{
                                    color: '#00733E',
                                    fontSize: '15px',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#005a31'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#00733E'}
                            >
                                sac@kfupm.edu.sa
                            </a>
                        </div>

                        {/* Follow Us */}
                        <div>
                            <h4 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '12px'
                            }}>
                                {t.followUs}
                            </h4>
                            <div style={{
                                display: 'flex',
                                gap: '12px'
                            }}>
                                {/* X (Twitter) */}
                                <a
                                    href="https://x.com/kfupm_sac"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="X"
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '10px',
                                        background: '#F9FAFB',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        border: '2px solid #E5E7EB'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#000000'
                                        e.currentTarget.style.borderColor = '#000000'
                                        e.currentTarget.style.transform = 'translateY(-3px)'
                                        e.currentTarget.querySelector('svg').style.stroke = '#FFFFFF'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#F9FAFB'
                                        e.currentTarget.style.borderColor = '#E5E7EB'
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.querySelector('svg').style.stroke = '#00733E'
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00733E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transition: 'stroke 0.3s ease'}}>
                                        <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                                        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                                    </svg>
                                </a>

                                {/* Instagram */}
                                <a
                                    href="https://instagram.com/kfupm_sac"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '10px',
                                        background: '#F9FAFB',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        border: '2px solid #E5E7EB'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#E4405F'
                                        e.currentTarget.style.borderColor = '#E4405F'
                                        e.currentTarget.style.transform = 'translateY(-3px)'
                                        e.currentTarget.querySelector('svg').style.stroke = '#FFFFFF'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#F9FAFB'
                                        e.currentTarget.style.borderColor = '#E5E7EB'
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.querySelector('svg').style.stroke = '#00733E'
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00733E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transition: 'stroke 0.3s ease'}}>
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Council Text + Deanship Logo */}
                        <div>

                            {/* Deanship Logo - Clickable */}
                            <a
                                href="https://studentaffairs.kfupm.edu.sa/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    transition: 'all 0.3s ease',
                                    marginTop: '12px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = '0.7'
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = '1'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                }}
                            >
                                <img
                                    src="/Full_Horizontal.png"
                                    alt={t.deanshipStudentAffairs}
                                    style={{
                                        maxWidth: '250px',
                                        width: '100%',
                                        height: 'auto'
                                    }}
                                />
                            </a>
                        </div>

                    </div>


                    {/* Copyright */}
                    <div style={{
                        borderTop: '1px solid #E5E7EB',
                        paddingTop: '20px',
                        textAlign: 'center',
                        color: '#9CA3AF',
                        fontSize: '14px'
                    }}>
                        © {new Date().getFullYear()} {t.brand} · {t.footerNote}
                    </div>
                </div>
            </div>
        </div>
    )
}