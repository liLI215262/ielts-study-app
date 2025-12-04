// 文件路径: src/Dashboard.jsx

import React from 'react';

function Dashboard({ stats }) {
    
    // 从 stats 中解构新数据 (需要在 App.jsx 中传递)
    const { vocab_count, writing_count, exam_countdown, reading_accuracy, latest_speaking } = stats;

    const styles = {
        cardContainer: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' },
        card: (color) => ({ 
            flex: 1, 
            minWidth: '200px',
            padding: '20px', 
            borderRadius: '10px', 
            background: color, 
            color: 'white', 
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }),
        metric: { fontSize: '36px', fontWeight: 'bold', margin: '0 0 5px 0' },
        title: { margin: '0', fontSize: '14px', opacity: 0.9 },
        subtext: { margin: 0, fontSize: '12px', opacity: 0.8 }
    };

    return (
        <div>
            <h2>📊 学习进度仪表盘</h2>
            <p style={{ color: '#888' }}>总目标：雅思 7 分（2028年计划）</p>

            <div style={styles.cardContainer}>
                
                {/* 1. 倒计时 */}
                <div style={styles.card('#c0392b')}>
                    <p style={styles.title}>距离目标</p>
                    <p style={styles.metric}>{exam_countdown}</p>
                    <p style={styles.subtext}>目标日期：2028/12/03</p>
                </div>
                
                {/* 2. 阅读正确率 (新增) */}
                <div style={styles.card('#8e44ad')}>
                    <p style={styles.title}>阅读平均正确率</p>
                    <p style={styles.metric}>{reading_accuracy}%</p>
                    <p style={styles.subtext}>目标：稳定在 75% 以上</p>
                </div>

                {/* 3. 口语得分 (新增) */}
                <div style={styles.card('#f39c12')}>
                    <p style={styles.title}>最新口语自评</p>
                    <p style={styles.metric}>{latest_speaking}</p>
                    <p style={styles.subtext}>目标：Band 7.0</p>
                </div>

                {/* 4. 词汇量 */}
                <div style={styles.card('#2980b9')}>
                    <p style={styles.title}>生词积累</p>
                    <p style={styles.metric}>{vocab_count}</p>
                    <p style={styles.subtext}>词汇是高分的基础</p>
                </div>

                {/* 5. 写作量 */}
                <div style={styles.card('#27ae60')}>
                    <p style={styles.title}>Task 2 练习</p>
                    <p style={styles.metric}>{writing_count}</p>
                    <p style={styles.subtext}>保持每周一篇</p>
                </div>
            </div>
            
            <h3 style={{ marginTop: '40px' }}>备考建议</h3>
            <ul style={{ color: '#555', lineHeight: '1.6' }}>
                <li>**阅读**：如果正确率低于 70%，请在“阅读计时”中多做几篇，并分析错题。</li>
                <li>**口语**：如果自评低于 6.0，请尝试使用更复杂的句型，并回听录音检查流利度。</li>
                <li>**写作**：写作练习是提分最慢的，请坚持积累高分词汇到生词本中。</li>
            </ul>
        </div>
    );
}

export default Dashboard;