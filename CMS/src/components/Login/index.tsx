// import { loginApi } from '@/api/login';
import { apiLogin } from '@/api/loginApi';
import { SUCCESS } from '@/utils/contrants';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import './style.scss';
import { useDispatch } from 'react-redux';
import { getPresidentSignIn } from '@/redux/reducer/userInfoSlice';


const LoginComponent: React.FC = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { account: string; password: string }) => {
    setLoading(true)
    const dataUsername = values.account?.trim()
    const dataPassword = values.password?.trim()
    const isGlobalAdmin = dataUsername === 'admin' || dataUsername === 'admin@local.test';
    if (!isGlobalAdmin) {
      dispatch(getPresidentSignIn({ email: dataUsername, password: dataPassword }))
    }
    else {
      if (isGlobalAdmin && dataPassword === '123456') {
        // const data = await apiLogin({
        //   username: dataUsername,
        //   password: dataPassword,
        // })
        // if (data.status === SUCCESS) {
        message.success('Đăng nhập thành công!')
        // localStorage.setItem('sessionId', data.data.sessionId);
        localStorage.removeItem('presidentToken');
        localStorage.removeItem('presidentInfo');
        localStorage.setItem('sessionId', 'A2299F8F-386E-476C-AA1C-42227C54F478-1672740676352_1672740676352');
        localStorage.setItem('admin', dataUsername);
        window.location.href = process.env.PATH_NAME ?? '/'
        // } else {
        //   message.error('Tài khoản mật khẩu không chính xác!')
        // }
        setLoading(false)
      }
      else {
        setLoading(false)
        message.error('Tài khoản mật khẩu không hợp lệ!')
      }
    }

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-page" >
      <div className="container-page">
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: "#0350AF", fontSize: '30px', marginTop: '20px', marginBottom: '10px', fontWeight: 600 }}>Đăng nhập</h2>
        </div>
        <Form
          name="basic"
          style={{ width: '100%' }}
          className="form-login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="account"
            rules={[{ required: true, message: 'Tên tài khoản không hợp lệ!' }]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Tài khoản đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Mật khẩu không hợp lệ!' }]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button
              loading={loading}
              size="large"
              type="primary"
              htmlType="submit"
              style={{ background: '#0350AF', fontWeight: 600, borderRadius: '5px' }}
            >
              ĐĂNG NHẬP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginComponent;
