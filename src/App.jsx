// 文件路径: src/App.jsx

import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth' 
import SpeakingPractice from './SpeakingPractice'; 
import WritingPractice from './WritingPractice'; 
import Dashboard from './Dashboard'; 
import CourseMaterials from './CourseMaterials'; 
import ReadingPractice from './ReadingPractice'; 

// -------------------------------------------------------------------
// 词汇本主页组件 (Home - 已登录用户视图)
// -------------------------------------------------------------------
function Home() { 
    // 【状态定义】
    const [currentView, setCurrentView] = useState('dashboard'); 
    
    // 仪表盘统计数据
    const [stats, setStats] = useState({
        vocab_count: 0,
        writing_count: 0,
        reading_accuracy: 0,   
        latest_speaking: '-',  
        exam_countdown: '计算中...' 
    });

    // 词汇本相关状态
    const [word, setWord] = useState('')
    const [definition, setDefinition] = useState(null)
    const [savedWords, setSavedWords] = useState([])
    const [loading, setLoading] = useState(false)
    
    // 1. 页面加载时，获取所有数据 (🔥 PWA 延迟修复)
    useEffect(() => {
        // 关键修复：添加 500 毫秒延迟，让 PWA 壳层稳定后再开始网络请求
        setTimeout(() => {
            fetchStats(); 
            fetchSavedWords(); 
        }, 500); 
    }, []);

    // ------------------------------------
    // 获取进度统计数据 (fetchStats)
    // ------------------------------------
    const fetchStats = async () => {
        const user = (await supabase.auth.getSession()).data.session?.user;
        if (!user) return;

        // 1. 获取单词总数
        const { count: vocab_count } = await supabase
            .from('vocabulary')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id); 

        // 2. 获取作文总数
        const { count: writing_count } = await supabase
            .from('writing_exercises')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id); 

        // 3. 计算阅读平均正确率
        const { data: readingData } = await supabase
            .from('reading_exercises')
            .select('accuracy_percent')
            .eq('user_id', user.id);
        
        let avgAccuracy = 0;
        if (readingData && readingData.length > 0) {
            const total = readingData.reduce((sum, item) => sum + (item.accuracy_percent || 0), 0);
            avgAccuracy = Math.round(total / readingData.length);
        }

        // 4. 获取最新口语得分
        const { data: speakingData } = await supabase
            .from('speaking_assessments')
            .select('self_band_score')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);
        
        const lastScore = speakingData && speakingData.length > 0 ? (speakingData[0].self_band_score / 10).toFixed(1) : '-';

        // 5. 倒计时
        const targetDate = new Date('2028-12-03'); 
        const today = new Date();
        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // 更新状态
        setStats({
            vocab_count: vocab_count || 0,
            writing_count: writing_count || 0,
            reading_accuracy: avgAccuracy,
            latest_speaking: lastScore,
            exam_countdown: diffDays > 0 ? `${diffDays} 天` : '目标已达成！'
        });
    };

    // 获取单词列表函数
    const fetchSavedWords = async () => {
        const user = (await supabase.auth.getSession()).data.session?.user
        if (!user) {
            setSavedWords([]) 
            return
        }
        const { data, error } = await supabase
            .from('vocabulary')
            .select('*')
            .eq('user_id', user.id) 
            .order('created_at', { ascending: false })
            
        if (error) console.log('获取单词错误', error)
        else setSavedWords(data || [])
    }
    
    // 保存单词函数
    const saveToCloud = async () => {
        if (!definition) return
        const meaningText = definition.meanings[0].definitions[0].definition
        const user = (await supabase.auth.getSession()).data.session?.user
        if (!user) {
            alert("请先登录！") 
            return
        }
        const { error } = await supabase
            .from('vocabulary')
            .insert([{ 
                word: word, 
                meaning: meaningText, 
                user_id: user.id 
            }])

        if (error) {
            alert("保存失败: " + error.message)
        } else {
            alert("已保存到云端！")
            fetchSavedWords() 
            fetchStats() 
            setWord('')
            setDefinition(null)
        }
    }
    
    // 查词函数
    const searchWord = async () => {
        if (!word) return
        setLoading(true)
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            const data = await response.json()
            if (data && data[0]) {
                setDefinition(data[0])
            } else {
                alert("未找到该单词")
                setDefinition(null)
            }
        } catch (error) {
            console.error("API Error:", error)
        }
        setLoading(false)
    }

    // 登出函数
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) alert(error.message)
    }

    // ------------------------------------
    // 页面渲染 (UI)
    // ------------------------------------
    return ( 
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            {/* 顶部标题栏 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
            <h1>📚 雅思备考助手 (v1.0)</h1>
                <button onClick={handleLogout} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}>
                    退出登录
                </button>
            </div>
            
            {/* 导航栏：切换模块 */}
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <button 
                    onClick={() => setCurrentView('dashboard')}
                    style={{ padding: '10px 15px', background: currentView === 'dashboard' ? '#c0392b' : '#f0f0f0', color: currentView === 'dashboard' ? 'white' : 'black', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px' }}
                >
                    🚀 仪表盘
                </button>
                <button 
                    onClick={() => setCurrentView('vocabulary')}
                    style={{ padding: '10px 15px', background: currentView === 'vocabulary' ? '#3498db' : '#f0f0f0', color: currentView === 'vocabulary' ? 'white' : 'black', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px' }}
                >
                    词汇本
                </button>
                <button 
                    onClick={() => setCurrentView('reading')}
                    style={{ padding: '10px 15px', background: currentView === 'reading' ? '#3498db' : '#f0f0f0', color: currentView === 'reading' ? 'white' : 'black', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px' }}
                >
                    📰 阅读计时
                </button>
                <button 
                    onClick={() => setCurrentView('speaking')}
                    style={{ padding: '10px 15px', background: currentView === 'speaking' ? '#3498db' : '#f0f0f0', color: currentView === 'speaking' ? 'white' : 'black', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px' }}
                >
                    口语模拟
                </button>
                <button 
                    onClick={() => setCurrentView('writing')}
                    style={{ padding: '10px 15px', background: currentView === 'writing' ? '#3498db' : '#f0f0f0', color: currentView === 'writing' ? 'white' : 'black', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px' }}
                >
                    写作练习
                </button>
                <button 
                    onClick={() => setCurrentView('materials')}
                    style={{ padding: '10px 15px', background: currentView === 'materials' ? '#3498db' : '#f0f0f0', color: currentView === 'materials' ? 'white' : 'black', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px' }}
                >
                    📚 资料
                </button>
            </div>

            {/* --- 内容显示区域 --- */}

            {/* 1. 仪表盘 */}
            {currentView === 'dashboard' && <Dashboard stats={stats} />} 

            {/* 2. 词汇本 */}
            {currentView === 'vocabulary' && (
                <div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input type="text" value={word} onChange={(e) => setWord(e.target.value)} placeholder="输入雅思生词 (例如: achieve)" style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}/>
                        <button onClick={searchWord} disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px' }}>{loading ? '查询中...' : '查询'}</button>
                    </div>

                    {definition && (
                        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px', background: '#f9f9f9' }}>
                            <h2>{definition.word}</h2>
                            <p><i>{definition.phonetic}</i></p>
                            <p><strong>释义：</strong> {definition.meanings[0].definitions[0].definition}</p>
                            {definition.phonetics[0]?.audio && (<audio controls src={definition.phonetics[0].audio} style={{ marginTop: '10px' }}></audio>)}
                            <button onClick={saveToCloud} style={{ display: 'block', marginTop: '15px', background: '#4CAF50', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>☁️ 保存到云端词库</button>
                        </div>
                    )}

                    <hr />
                    <h3>📚 我的积累 ({savedWords.length})</h3>
                    <ul style={{ paddingLeft: '20px' }}>
                        {savedWords.map((item) => (
                            <li key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                <strong>{item.word}</strong>: {item.meaning}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 3. 阅读计时 */}
            {currentView === 'reading' && <ReadingPractice />}

            {/* 4. 口语模拟 */}
            {currentView === 'speaking' && <SpeakingPractice />}
            
            {/* 5. 写作练习 */}
            {currentView === 'writing' && <WritingPractice />}
            
            {/* 6. 课程资料 */}
            {currentView === 'materials' && <CourseMaterials />} 

        </div>
    )
}

// -------------------------------------------------------------------
// 主应用逻辑 (App)
// -------------------------------------------------------------------
export default function App() {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session)
                setLoading(false)
            }
        )

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, [])

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '100px' }}>正在加载用户状态...</div>
    }

    return (
        session ? <Home /> : <Auth />
    )
}