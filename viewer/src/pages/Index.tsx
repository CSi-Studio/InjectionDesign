import {PageContainer} from '@ant-design/pro-layout';

import {Card, Col, Divider, Row} from 'antd';
import type {FC} from 'react';
import {url} from "@/utils/request";

const Basic: FC = () => {

  return (
    <PageContainer>
      <Row gutter={[5, 5]}>
        <Col span={24}>
          <Card title={'About Injection Design'}>
            <h4>
              InjectionDesign helps GC/LC-MS pre-processing operators with well plate design.
              Appropriate sample stratification balancing and block randomization algorithms can effectively reduce the signal drift and batch effect of the instrument.
            </h4>
            <Divider style={{marginBottom: 32}}/>
            <div style={{color: '#e95420', fontSize: 18, marginBottom: 32}}>How to use</div>
            <div style={{marginBottom: 32}}>
              <h3>
                <b style={{color: "#e95420"}}>Step1: Upload Samples</b><br/>
                1. Download the sample Excel template.   <a href={`${url}/static/SampleTemplate.xlsx`}>Click to Download Template</a>;<br/>
                2. The experimenter simply fills in the SampleID of each sample and the corresponding grouping, PlateDesign supports up to three different grouping dimensions;<br/>
                3. Users must ensure that this SampleID is unique within the same Excel;<br/>
                4. After successful upload, the system will automatically create a corresponding project. Users can edit it again and again after uploading, without having to upload it again;<br/>
              </h3>
              <h3>
                <b style={{color: "#e95420"}}>Step2: Design Params </b><br/>
                1. <b>Plate</b>: Choose the plate specification.(91-well plate, 96-well plate and 384-well plate);<br/>
                2. <b>Max Samples on Single Plate</b>: The maximum number of common samples carried on each plate; Total number of wells in the plate = MaxSamplesOnSinglePlate + QC Samples;<br/>
                3. <b>Plate Number</b>: yAxis format of the plate. Both numeric and English formats are supported;<br/>
                4. <b>Direction</b>: The orientation of the sample layout;<br/>
                5. <b>QC Type</b>: The system currently supports 5 QC types: Blank, Long-Term Reference, Pooled, Solvent and Custom QC Samples;<br/>

                Users can simply select multiple empty spaces on the well-plate (supports multi-selection mode with Ctrl or Shift key). Users can also set the position directly by dragging and dropping the relevant position with the mouse.
              </h3>
              <h3>
                <b style={{color: "#e95420"}}>Step3: Balancing&Randomization</b><br/>
                1. The default balancing and randomization algorithms are stratified balancing algorithm and block randomization algorithm. The default algorithms are used and dim1 is chosen as default when starting Step3.<br/>
                2. Uses can choose the different dims and other balancing and randomization algorithms as options;<br/>
                The regular samples are interpolated into the blank holes defined in Step2 with the setting direction. The distribution of uploaded samples is visualized on the page. It also shows the sequence of intra-batch sequence after the data has been processed.
              </h3>
              <h3>
                <b style={{color: "#e95420"}}>Step4: Worksheet </b><br/>
                Users can download the sequence order of all plates in bulk directly from this page. Or you can download the order of individual plate one by one.
              </h3>
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
