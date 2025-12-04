// 文件路径: src/CourseMaterials.jsx

import React, { useState, useEffect } from 'react';
console.log("CourseMaterials 组件正在加载..."); // <--- 新增这行
import { supabase } from './supabaseClient';

function CourseMaterials() {
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [notes, setNotes] = useState('');
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMaterials();
    }, []);

    // 获取并显示学习资料
   // 文件路径: src/CourseMaterials.jsx (替换 fetchMaterials 函数)

const fetchMaterials = async () => {
    setLoading(true);
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) {
        setLoading(false);
        return;
    }

    try {
        const { data, error } = await supabase
            .from('study_materials') // ⚠️ 确保表名是完全小写且正确的
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            // 🔥 新增：在控制台打印 Supabase 错误详情
            console.error('Supabase Error fetching materials:', error.message);
            alert("加载学习资料失败：" + error.message); // 显示错误给用户
        } else {
            setMaterials(data || []);
        }
    } catch (e) {
        // 🔥 新增：捕获任何 JavaScript 运行时错误
        console.error('JS Runtime Error in fetchMaterials:', e);
        alert("组件运行时发生错误，请检查控制台。");
    }

    setLoading(false);
};
    // 保存学习资料到 Supabase
    const saveMaterial = async (e) => {
        e.preventDefault();
        if (!title) {
            alert("标题是必填项！");
            return;
        }

        setLoading(true);
        const user = (await supabase.auth.getSession()).data.session?.user;

        const materialData = {
            user_id: user.id,
            title: title,
            link_url: link,
            notes: notes,
        };

        const { error } = await supabase
            .from('study_materials') // 目标表名
            .insert([materialData]);

        if (error) {
            alert("保存失败: " + error.message);
        } else {
            alert("✅ 资料已成功保存！");
            // 清空表单并刷新列表
            setTitle('');
            setLink('');
            setNotes('');
            fetchMaterials(); 
        }
        setLoading(false);
    };

    // 文件路径: src/CourseMaterials.jsx (替换 const styles = { ... };)

// 样式快捷定义
const styles = {
    container: { maxWidth: '900px', margin: '20px auto', padding: '20px' },
    form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' },
    inputGroup: { display: 'flex', flexDirection: 'column' },
    input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px' },
    textarea: { padding: '10px', minHeight: '100px', border: '1px solid #ccc', borderRadius: '4px' },
    list: { listStyleType: 'none', padding: 0 },
    listItem: { border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '10px', background: '#f9f9f9' },
    
    // 关键修复：必须写成箭头函数 (color) => ({ ... })
    button: (color) => ({ 
        padding: '10px 20px', 
        margin: '5px 0', 
        background: color, 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px', 
        cursor: 'pointer' 
    })
};
    return (
        <div style={styles.container}>
            <h2>📚 课程与学习资料管理</h2>

            <form onSubmit={saveMaterial} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label>资料/课程标题 (*)</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} required />
                </div>
                
                <div style={styles.inputGroup}>
                    <label>外部链接 (URL)</label>
                    <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="如：YouTube 课程链接" style={styles.input} />
                </div>

                <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                    <label>学习笔记/重点</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={styles.textarea} />
                </div>

                <button type="submit" disabled={loading || !title} style={{ ...styles.button('#3498db'), gridColumn: 'span 2', padding: '12px' }}>
                    {loading ? '保存中...' : '💾 保存资料到云端'}
                </button>
            </form>

            <h3>📖 我的学习资料 ({materials.length})</h3>
            <ul style={styles.list}>
                {materials.map((m) => (
                    <li key={m.id} style={styles.listItem}>
                        <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{m.title}</p>
                        {m.link_url && (
                            <p style={{ margin: '0 0 5px 0' }}>
                                链接: <a href={m.link_url} target="_blank" rel="noopener noreferrer">{m.link_url.substring(0, 50)}...</a>
                            </p>
                        )}
                        {m.notes && (
                            <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>笔记: {m.notes}</p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CourseMaterials;