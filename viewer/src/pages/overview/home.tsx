import {PageContainer} from '@ant-design/pro-layout';

import {Card, Col, Divider, Row} from 'antd';
import type {FC} from 'react';
//@ts-ignore
import React from 'react';
//@ts-ignore
import {useRequest} from 'umi';

const Basic: FC = () => {

  return (
    <PageContainer>
      <Row gutter={[5, 5]}>
        <Col span={10}>
          <Card bordered={true} style={{width: 1000}}>
            <div style={{color: '#e95420', fontSize: 18, marginBottom: 32}}>About</div>
            <div style={{marginBottom: 32}}>
              <h4>
                <b style={{color: "#e95420"}}>InjectionPro </b>
                helps researchers carry out well designed microplate
                experiments. Proper experimental design including blocking and randomization of experimental
                samples and conditions will help minimize unwanted bias and control
                for potential plate or batch effects.
              </h4>
            </div>
            <Divider style={{marginBottom: 32}}/>

            <div style={{color: '#e95420', fontSize: 18, marginBottom: 32}}>How to use</div>
            <div style={{marginBottom: 32}}>
              <h4>
                <b style={{color: "#e95420"}}>step1 </b>
                helps researchers carry out well designed microplate
                experiments. Proper experimental design including blocking and randomization of experimental
                samples and conditions will help minimize unwanted bias and control
                for potential plate or batch effects.
              </h4>

              <h4>
                <b style={{color: "#e95420"}}>step2 </b>
                helps researchers carry out well designed microplate
                experiments. Proper experimental design including blocking and randomization of experimental
                samples and conditions will help minimize unwanted bias and control
                for potential plate or batch effects.
              </h4>

              <h4>
                <b style={{color: "#e95420"}}>step3 </b>
                helps researchers carry out well designed microplate
                experiments. Proper experimental design including blocking and randomization of experimental
                samples and conditions will help minimize unwanted bias and control
                for potential plate or batch effects.
              </h4>


              <h4>
                <b style={{color: "#e95420"}}>step4 </b>
                helps researchers carry out well designed microplate
                experiments. Proper experimental design including blocking and randomization of experimental
                samples and conditions will help minimize unwanted bias and control
                for potential plate or batch effects.
              </h4>
            </div>
            <Divider style={{marginBottom: 32}}/>
            <div>
              <h4>
                <b style={{color: "#e95420"}}>step4 </b>
                helps researchers carry out well designed microplate
                experiments. Proper experimental design including blocking and randomization of experimental
                samples and conditions will help minimize unwanted bias and control
                for potential plate or batch effects.
              </h4>
            </div>
          </Card>
        </Col>
        <Col span={14}>
          <Card>



          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Basic;
