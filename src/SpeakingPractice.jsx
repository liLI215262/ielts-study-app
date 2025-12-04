// 文件路径: src/SpeakingPractice.jsx

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient'; // 确保导入 supabase
import { speakingTopics } from './ieltsTopics';

// 全局变量用于 MediaRecorder 实例和数据块
let mediaRecorder;
let audioChunks = [];

function SpeakingPractice() {
    // 状态管理
    const [topic, setTopic] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const audioRef = useRef(null); 

    // 🔥【新增状态】用于口语自评功能
    const [showAssessment, setShowAssessment] = useState(false); 
    const [selfScore, setSelfScore] = useState(60); 
    
    // 页面加载时，获取麦克风权限
    useEffect(() => {
        getMicrophoneAccess();
    }, []);

    // 获取麦克风权限的逻辑
    const getMicrophoneAccess = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Microphone access granted.");
        } catch (err) {
            alert("⚠️ 无法获取麦克风权限。请检查浏览器设置。");
            console.error("Microphone error:", err);
        }
    };

    // 随机选择一个话题
    const selectRandomTopic = () => {
        const randomIndex = Math.floor(Math.random() * speakingTopics.length);
        setTopic(speakingTopics[randomIndex]);
        setAudioBlob(null); 
    };
    
    // 开始录音
    const startRecording = async () => {
        if (!topic) {
            alert("请先选择一个话题卡片！");
            return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = []; 

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            setAudioBlob(audioBlob);
            stream.getTracks().forEach(track => track.stop()); 
        };

        mediaRecorder.start();
        setIsRecording(true);
        setAudioBlob(null);

        // 设置定时器
        const timerDuration = topic.time * 1000;
        setTimeout(() => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                stopRecording();
            }
        }, timerDuration);
    };

    // 停止录音
    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            setIsRecording(false);
            // 🔥 录音停止后，显示评分弹窗
            setShowAssessment(true); 
        }
    };

    // 保存自评分
    const saveAssessment = async () => {
        if (!topic) return;
        
        const user = (await supabase.auth.getSession()).data.session?.user;
        if (!user) {
            alert("请先登录！");
            return;
        }

        const assessmentData = {
            user_id: user.id,
            topic: topic.title, 
            self_band_score: selfScore, 
        };

        const { error } = await supabase
            .from('speaking_assessments') 
            .insert([assessmentData]);

        if (error) {
            alert("保存失败: " + error.message);
        } else {
            alert(`✅ 口语自评 ${selfScore / 10} 分已成功记录！`);
            setShowAssessment(false);
            setSelfScore(60); 
            // 可以在这里选择保留录音或重置
        }
    };

    // 播放录音
    const playRecording = () => {
        if (audioBlob) {
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;
            audioRef.current.play();
        }
    };

    // 简单的样式对象
    const styles = {
        container: { maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' },
        topicCard: { border: '2px solid #3498db', padding: '20px', borderRadius: '8px', marginBottom: '20px', background: '#ecf0f1' },
        button: (color) => ({ padding: '10px 20px', margin: '5px', background: color, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' })
    };

    // 🔥 渲染评分弹窗
    if (showAssessment) {
        return (
            <div style={{ padding: '40px', maxWidth: '400px', margin: '100px auto', background: '#fff', border: '1px solid #2ecc71', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <h3>完成口语练习，请自评得分</h3>
                
                <div style={{ margin: '20px 0' }}>
                    <label style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Band Score: {selfScore / 10} 分</label>
                    <input 
                        type="range" 
                        min="10" max="90" 
                        step="5" 
                        value={selfScore}
                        onChange={(e) => setSelfScore(e.target.value)}
                        style={{ width: '100%', marginTop: '10px' }}
                    />
                    <p style={{ fontSize: '0.9em', color: '#7f8c8d' }}>滑动以选择 Band 1.0 - 9.0</p>
                </div>

                <button 
                    onClick={saveAssessment} 
                    style={{ padding: '10px 20px', background: '#27ae60', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
                >
                    💾 确认并保存得分
                </button>
            </div>
        );
    }

    // 主界面渲染
    return (
        <div style={styles.container}>
            <h2>🎙️ 雅思口语模拟练习</h2>

            <button onClick={selectRandomTopic} style={styles.button('#2ecc71')}>
                抽取话题卡片
            </button>

            {topic && (
                <div style={styles.topicCard}>
                    <h3>Part {topic.part} 话题：{topic.title}</h3>
                    <p><strong>要求：</strong> {topic.prompt}</p>
                    <p><strong>建议时间：</strong> {topic.time} 秒</p>
                </div>
            )}

            <div style={{ marginBottom: '20px' }}>
                {/* 录音按钮 */}
                {!isRecording ? (
                    <button 
                        onClick={startRecording} 
                        disabled={!topic} 
                        style={styles.button(topic ? '#e74c3c' : '#bdc3c7')}
                    >
                        {topic ? '🔴 开始录音' : '请先抽取话题'}
                    </button>
                ) : (
                    <button onClick={stopRecording} style={styles.button('#f39c12')}>
                        ⏸️ 停止录音
                    </button>
                )}
            </div>

            // 文件路径: src/SpeakingPractice.jsx

// ------------------------------------
// 替换此代码块 (录音回放区域)
// ------------------------------------
            {/* 播放区域 */}
            {audioBlob && (
                <div style={{ padding: '15px', borderTop: '1px solid #ddd' }}>
                    <h3>录音回放</h3>
                    <button onClick={playRecording} style={styles.button('#3498db')}>
                        ▶️ 播放我的回答
                    </button>
                    {/* audio 元素用于实际播放 */}
                    <audio ref={audioRef} controls style={{ display: 'block', marginTop: '10px' }} />
                </div>
            )}
            
            <p style={{ fontSize: '0.8em', color: '#7f8c8d' }}>
                * 请注意：首次使用需授予浏览器麦克风权限。
            </p>
        </div>
    );
}

export default SpeakingPractice;