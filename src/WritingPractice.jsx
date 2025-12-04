// 文件路径: src/WritingPractice.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { writingTopics } from './ieltsWritingTopics';

function WritingPractice() {
    const [topic, setTopic] = useState(null);
    const [essayContent, setEssayContent] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [loading, setLoading] = useState(false);
    
    // 页面加载时随机选择一个话题
    useEffect(() => {
        selectRandomTopic();
    }, []);

    // 随机选择一个话题
    const selectRandomTopic = () => {
        const randomIndex = Math.floor(Math.random() * writingTopics.length);
        setTopic(writingTopics[randomIndex]);
        setEssayContent(''); // 重置内容
    };

    // 实时更新内容和字数统计
    const handleContentChange = (e) => {
        const content = e.target.value;
        setEssayContent(content);
        // 使用简单的正则表达式计算单词数量
        const words = content.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(words.length);
    };

    // 保存作文到 Supabase
    const saveEssay = async () => {
        if (wordCount < 250) {
            alert("雅思 Task 2 要求至少 250 词，请继续写作！");
            return;
        }

        setLoading(true);
        
        // 1. 获取当前登录用户的 ID
        const user = (await supabase.auth.getSession()).data.session?.user;
        if (!user) {
            alert("登录会话已过期，请重新登录！");
            setLoading(false);
            return;
        }

        // 2. 准备数据
        const essayData = {
            user_id: user.id,
            topic: topic.question,
            content: essayContent,
            word_count: wordCount,
        };

        // 3. 插入数据
        const { error } = await supabase
            .from('writing_exercises') // <-- 目标表名
            .insert([essayData]);

        if (error) {
            alert("保存失败: " + error.message);
        } else {
            alert("✅ 作文已成功保存到云端！");
            // 保存后可以清空或加载下一个话题
            setEssayContent('');
            setWordCount(0);
            selectRandomTopic();
        }
        setLoading(false);
    };

    // 简单的样式对象 (为了不引入 CSS 文件)
    const styles = {
        container: { maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' },
        topicCard: { border: '1px solid #f39c12', padding: '15px', borderRadius: '8px', marginBottom: '20px', background: '#fef5e7' },
        textarea: { width: '100%', minHeight: '300px', padding: '10px', fontSize: '16px', border: '1px solid #ccc', resize: 'vertical' },
        button: (color) => ({ padding: '10px 20px', margin: '5px 0', background: color, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' })
    };

    return (
        <div style={styles.container}>
            <h2>✍️ 雅思写作练习 (Task 2)</h2>

            {topic && (
                <div style={styles.topicCard}>
                    <p><strong>题目类型:</strong> {topic.type}</p>
                    <p><strong>题目:</strong> {topic.question}</p>
                    <p style={{ marginTop: '10px' }}>* 请用至少 250 词完成写作。</p>
                </div>
            )}

            <textarea
                value={essayContent}
                onChange={handleContentChange}
                placeholder="在此输入您的 Task 2 作文..."
                style={styles.textarea}
                disabled={loading}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <p>当前字数: <strong>{wordCount}</strong> / 250</p>
                
                {wordCount < 250 && (
                    <span style={{ color: '#e67e22' }}>还需 {250 - wordCount} 词</span>
                )}
            </div>

            <button 
                onClick={saveEssay} 
                disabled={loading || wordCount < 1} 
                style={styles.button('#2ecc71')}
            >
                {loading ? '保存中...' : '💾 保存作文到云端'}
            </button>
            <button 
                onClick={selectRandomTopic} 
                style={{ ...styles.button('#95a5a6'), marginLeft: '10px' }}
            >
                更换话题
            </button>

        </div>
    );
}

export default WritingPractice;