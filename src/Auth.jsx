// 文件路径: src/Auth.jsx

import { useState } from 'react'
import { supabase } from './supabaseClient'

function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [view, setView] = useState('sign_in') // 'sign_in' 或 'sign_up'

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: 'test-password' })
    // 注意：我们在这里简化了流程，使用了一个固定的密码进行测试
    // 实际项目中需要添加密码输入框！

    if (error) {
      alert(error.message)
    } else {
      alert('登录成功！')
    }
    setLoading(false)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ 
        email, 
        password: 'test-password' 
    })

    if (error) {
        alert(error.message)
    } else {
        alert('注册成功！请检查你的邮箱（如果开启了邮件验证）')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>{view === 'sign_in' ? '用户登录' : '用户注册'}</h1>

      <form onSubmit={view === 'sign_in' ? handleLogin : handleSignup}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">邮箱:</label>
          <input
            id="email"
            type="email"
            placeholder="你的邮箱地址"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            required
          />
          {/* ⚠️ 提醒：我们省略了密码框，但在真实应用中必须要有！ */}
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', background: '#3498db', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {loading ? '处理中...' : (view === 'sign_in' ? '登录' : '注册')}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => setView(view === 'sign_in' ? 'sign_up' : 'sign_in')}
          style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer' }}
        >
          {view === 'sign_in' ? '没有账号？去注册' : '已有账号？去登录'}
        </button>
      </div>
    </div>
  )
}

export default Auth