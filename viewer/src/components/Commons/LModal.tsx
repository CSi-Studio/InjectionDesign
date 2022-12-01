import { Modal } from 'antd';
import React from 'react';

const LModal: React.FC = (props: any) => {
  return (
    <Modal
      width="482px"
      visible={props.visible}
      title={props.title}
      onOk={props.onOk}
      onCancel={props.onCancel}
    >
      <div
        style={{
          fontSize: '16px',
          fontWeight: '500px',
          color: '#333333',
        }}
      >
        {props.content}
      </div>
    </Modal>
  );
};

export default LModal;
