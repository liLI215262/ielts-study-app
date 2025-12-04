// 文件路径: src/App.jsx

import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth' // 导入 Auth 组件
import SpeakingPractice from './SpeakingPractice'; // 导入口语组件
import WritingPractice from './WritingPractice'; // 导入写作组件
import Dashboard from './Dashboard'; // 导入 Dashboard 组件
import CourseMaterials from './CourseMaterials'; // 导入课程资料组件
import ReadingPractice from './ReadingPractice'; // <-- 新增导入
// -------------------------------------------------------------------
// 词汇本主页组件 (Home - 已登录用户视图)
// -------------------------------------------------------------------
function Home() { 
    // 【状态定义】
    const [currentView, setCurrentView] = useState('dashboard'); 
    
    const [stats, setStats] = useState({
        vocab_count: 0,
        writing_count: 0,
        exam_countdown: '计算中...' 
    });

    const [word, setWord] = useState('')
    const [definition, setDefinition] = useState(null)
    const [savedWords, setSavedWords] = useState([])
    const [loading, setLoading] = useState(false)
    
    // 1. 页面加载时，调用统计和单词函数
    useEffect(() => {
        fetchStats(); 
        fetchSavedWords(); 
    }, []);

    // ------------------------------------
    // 【已修复】获取进度统计数据函数 (fetchStats)
    // ------------------------------------
    // 文件路径: src/App.jsx (替换 fetchStats 函数)

    const fetchStats = async () => {
        const user = (await supabase.auth.getSession()).data.session?.user;
        if (!user) return;

        // 1. 基础统计
        const { count: vocab_count } = await supabase
            .from('vocabulary')
            .select('*', { count: 'exact', head: true }).eq('user_id', user.id); 

        const { count: writing_count } = await supabase
            .from('writing_exercises')
            .select('*', { count: 'exact', head: true }).eq('user_id', user.id); 

        // 2. 🔥【新增】计算阅读平均正确率
        const { data: readingData } = await supabase
            .from('reading_exercises')
            .select('accuracy_percent')
            .eq('user_id', user.id);
        
        let avgAccuracy = 0;
        if (readingData && readingData.length > 0) {
            const total = readingData.reduce((sum, item) => sum + (item.accuracy_percent || 0), 0);
            avgAccuracy = Math.round(total / readingData.length);
        }

        // 3. 🔥【新增】获取最新口语得分
        const { data: speakingData } = await supabase
            .from('speaking_assessments')
            .select('self_band_score')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);
        
        const lastScore = speakingData && speakingData.length > 0 ? (speakingData[0].self_band_score / 10).toFixed(1) : '-';

        // 4. 倒计时
        const targetDate = new Date('2028-12-03'); 
        const today = new Date();
        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // 5. 更新状态
        setStats({
            vocab_count: vocab_count || 0,
            writing_count: writing_count || 0,
            exam_countdown: diffDays > 0 ? `${diffDays} 天` : '目标已达成！',
            reading_accuracy: avgAccuracy, // 新增
            latest_speaking: lastScore     // 新增
        });
    };
    // 获取单词列表函数 (fetchSavedWords - 安全版本)
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
    
    // 保存单词函数 (saveToCloud - 安全版本)
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
            setWord('')
            setDefinition(null)
        }
    }
    
    // 查词函数 (searchWord)
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

    // 登出函数 (handleLogout)
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) alert(error.message)
    }

    // ------------------------------------
    // Home 组件的返回 (return) 部分
    // ------------------------------------
    return ( 
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                <h1>📚 雅思备考助手</h1>
                <button onClick={handleLogout} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer' }}>
                    退出登录
                </button>
            </div>
            
            // 文件路径: src/App.jsx (Home 组件的 return 区域 - 导航栏)

{/* 导航栏：切换模块 */}
<div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
    <button 
        onClick={() => setCurrentView('dashboard')}
        style={{ padding: '10px 15px', background: currentView === 'dashboard' ? '#c0392b' : '#f0f0f0', color: currentView === 'dashboard' ? 'white' : 'black', border: '1px solid #ccc', cursor: 'pointer' }}
    >
        🚀 仪表盘 (进度)
    </button>
    <button 
        onClick={() => setCurrentView('vocabulary')}
        style={{ padding: '10px 15px', background: currentView === 'vocabulary' ? '#3498db' : '#f0f0f0', color: currentView === 'vocabulary' ? 'white' : 'black', border: '1px solid #ccc', cursor: 'pointer' }}
    >
        词汇本 (查词)
    </button>
    
    {/* 🔥 修正点：这里必须是 'reading' */}
    <button 
        onClick={() => setCurrentView('reading')} 
        style={{ padding: '10px 15px', background: currentView === 'reading' ? '#3498db' : '#f0f0f0', color: currentView === 'reading' ? 'white' : 'black', border: '1px solid #ccc', cursor: 'pointer' }}
    >
        📰 阅读计时
    </button>
    
    {/* 口语按钮保持 'speaking' */}
    <button 
        onClick={() => setCurrentView('speaking')}
        style={{ padding: '10px 15px', background: currentView === 'speaking' ? '#3498db' : '#f0f0f0', color: currentView === 'speaking' ? 'white' : 'black', border: '1px solid #ccc', cursor: 'pointer' }}
    >
        口语模拟
    </button>
    
    <button 
        onClick={() => setCurrentView('writing')}
        style={{ padding: '10px 15px', background: currentView === 'writing' ? '#3498db' : '#f0f0f0', color: currentView === 'writing' ? 'white' : 'black', border: '1px solid #ccc', cursor: 'pointer' }}
    >
        写作练习 (Task 2)
    </button>
    <button 
        onClick={() => setCurrentView('materials')}
        style={{ padding: '10px 15px', background: currentView === 'materials' ? '#3498db' : '#f0f0f0', color: currentView === 'materials' ? 'white' : 'black', border: '1px solid #ccc', cursor: 'pointer' }}
    >
        📚 课程与资料
    </button>
</div>
            {/* 内容区：根据状态显示组件 */}
            {currentView === 'dashboard' && <Dashboard stats={stats} />} 

            {currentView === 'vocabulary' && (
                <div>
                    {/* 搜索区域 */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input type="text" value={word} onChange={(e) => setWord(e.target.value)} placeholder="输入雅思生词 (例如: achieve)" style={{ flex: 1, padding: '10px' }}/>
                        <button onClick={searchWord} disabled={loading}>{loading ? '查询中...' : '查询'}</button>
                    </div>

                    {/* 结果展示 */}
                    {definition && (
                        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px', background: '#f9f9f9' }}>
                            <h2>{definition.word}</h2>
                            <p><i>{definition.phonetic}</i></p>
                            <p><strong>释义：</strong> {definition.meanings[0].definitions[0].definition}</p>
                            {definition.phonetics[0]?.audio && (<audio controls src={definition.phonetics[0].audio} style={{ marginTop: '10px' }}></audio>)}
                            <button onClick={saveToCloud} style={{ display: 'block', marginTop: '15px', background: '#4CAF50', color: 'white' }}>☁️ 保存到云端词库</button>
                        </div>
                    )}

                    <hr />

                    {/* 单词列表 */}
                    <h3>📚 我的积累 ({savedWords.length})</h3>
                    <ul>
                        {savedWords.map((item) => (
                            <li key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                <strong>{item.word}</strong>: {item.meaning}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
{currentView === 'reading' && <ReadingPractice />}

            {currentView === 'speaking' && <SpeakingPractice />}
            
            {currentView === 'writing' && <WritingPractice />}
            
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