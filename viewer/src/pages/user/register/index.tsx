import type {FC} from 'react';
import {useState, useEffect} from 'react';
import {Form, Button, Input, Popover, Progress, message} from 'antd';
import type {Store} from 'antd/es/form/interface';
import {Link, useRequest, history} from 'umi';
import {UserRegister} from './service';

import styles from './style.less';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <span>Strength: strong</span>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <span>Strength: middle</span>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <span>Strength: low</span>
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const Register: FC = () => {
  const [visible, setVisible]: [boolean, any] = useState(false);
  const [popover, setPopover]: [boolean, any] = useState(false);
  const confirmDirty = false;
  let interval: number | undefined;
  const [form] = Form.useForm();

  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );
  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  //@ts-ignore
  const {loading: submitting, run: register} = useRequest<{ data: any }>(UserRegister, {
    manual: true,
    onSuccess: (data) => {
      console.log(data)
      if (data.id) {
        message.success('Register Successful！');
        history.push({
          pathname: '/user/login',
        });
      }
    },
  });
  const onFinish = (values: Store) => {
    console.log(values)
    register(values);
  };

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('Two passwords do not match!');
    }
    return promise.resolve();
  };

  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setVisible(!!value);
      return promise.reject('Input Password!');
    }
    // 有值的情况
    if (!visible) {
      setVisible(!!value);
    }
    setPopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };


  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <div className={styles.main}>
      <h2>Register</h2>
      <Form form={form} name="UserRegister" onFinish={onFinish}>
        <FormItem
          name="username"
          rules={[
            {
              required: true,
              message: 'please input username',
            },
          ]}
        >
          <Input size="large" placeholder="please input username"/>
        </FormItem>
        <Popover
          getPopupContainer={(node) => {
            if (node && node.parentNode) {
              return node.parentNode as HTMLElement;
            }
            return node;
          }}
          content={
            visible && (
              <div style={{padding: '4px 0'}}>
                {passwordStatusMap[getPasswordStatus()]}
                {renderPasswordProgress()}
                <div style={{marginTop: 10}}>
                  <span>At least 6 character</span>
                </div>
              </div>
            )
          }
          overlayStyle={{width: 240}}
          placement="right"
          visible={visible}
        >
          <FormItem
            name="password"
            className={
              form.getFieldValue('password') &&
              form.getFieldValue('password').length > 0 &&
              styles.password
            }
            rules={[
              {
                validator: checkPassword,
              },
            ]}
          >
            <Input size="large" type="password" placeholder="At least 6-digit password, case sensitive"/>
          </FormItem>
        </Popover>
        <FormItem
          name="confirm"
          rules={[
            {
              required: true,
              message: 'Password Confirm',
            },
            {
              validator: checkConfirm,
            },
          ]}
        >
          <Input size="large" type="password" placeholder="Confirm Password"/>
        </FormItem>
        <FormItem>
          <Button
            size="large"
            loading={submitting}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            <span>Register</span>
          </Button>
          <Link className={styles.login} to="/user/login">
            <span>Login</span>
          </Link>
        </FormItem>
      </Form>
    </div>
  );
};
export default Register;
