import type { InputRef} from 'antd';
import { Tag } from 'antd';
import { Button, Form, Input, Modal, Popconfirm, Table } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './style.less';
//@ts-ignore
import { FormattedMessage } from 'umi';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: React.Key;
  position: string;
  type: string;
  frequency: string;
  method: string;
}

interface EditableRowProps {
  index: number;
}

// 可编辑的单元格组件
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

// 可编辑单元格
const EditableCell: React.FC<EditableCellProps> = ({
                                                     title,
                                                     editable,
                                                     children,
                                                     dataIndex,
                                                     record,
                                                     handleSave,
                                                     ...restProps
                                                   }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('save failed');
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className={styles.editableCellValueWrap}
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  position: string;
  type: string;
  frequency: string;
  method: string;
  fileName: string;
  dataAddress: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const PreHeartTable: React.FC<{
  visible: boolean;
  onOk: (data: any[]) => void;
  onCancel: (data: any[]) => void;
  value: any;
}> = (props: any) => {
  const { visible, onOk, onCancel, value } = props;

  const HFX12 = [
    {
      key: '0',
      position: 'V:1',
      type: 'Solvent',
      frequency: '3',
      method: 'file1',
      fileName: 'pos_Prerun_Solvent',
      dataAddress: '',
    },
    {
      key: '1',
      position: 'V:2',
      type: 'MixQC',
      frequency: '3',
      method: 'file2',
      fileName: 'pos_Prerun_MixQC',
      dataAddress: '',
    },
    {
      key: '2',
      position: 'V:3',
      type: 'Blank',
      frequency: '1',
      method: 'file3',
      fileName: 'pos_Prerun_Blank',
      dataAddress: '',
    },
  ];

  const HF = [
    {
      key: '0',
      position: 'Y:F1',
      type: 'Solvent',
      frequency: '3',
      method: 'D:/data/file1',
      fileName: 'pos_Prerun_Solvent',
      dataAddress: '',
    },
    {
      key: '1',
      position: 'Y:F2',
      type: 'MixQC',
      frequency: '3',
      method: 'D:/data/file1',
      fileName: 'pos_Prerun_MixQC',
      dataAddress: '',
    },
    {
      key: '2',
      position: 'Y:F3',
      type: 'Blank',
      frequency: '1',
      method: 'D:/data/file1',
      fileName: 'pos_Prerun_Blank',
      dataAddress: '',
    },
  ];

  const AB6500 = [
    {
      key: '0',
      position: '20001',
      type: 'Solvent',
      frequency: '3',
      method: 'D:/data/file1',
      fileName: 'pos_Prerun_Solvent',
      dataAddress: '',
    },
    {
      key: '1',
      position: '20002',
      type: 'MixQC',
      frequency: '3',
      method: 'D:/data/file1',
      fileName: 'pos_Prerun_MixQC',
      dataAddress: '',
    },
    {
      key: '2',
      position: '20003',
      type: 'Blank',
      frequency: '1',
      method: 'D:/data/file1',
      fileName: 'pos_Prerun_Blank',
      dataAddress: '',
    },
  ];

  const GCMS = [
    {
      key: '0',
      position: '150',
      type: 'Solvent',
      frequency: '3',
      method: 'D:/data/file1',
      fileName: 'pos_Prerun_Solvent',
      dataAddress: '',
    },
    {
      key: '1',
      position: '151',
      type: 'MixQC',
      frequency: '3',
      method: 'D:/data/file2',
      fileName: 'pos_Prerun_MixQC',
      dataAddress: '',
    },
    {
      key: '2',
      position: '152',
      type: 'Blank',
      frequency: '1',
      method: 'D:/data/file2',
      fileName: 'pos_Prerun_Blank',
      dataAddress: '',
    },
  ];

  const [dataSource, setDataSource] = useState<DataType[]>(HFX12);
  const [count, setCount] = useState(2);
  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };
  useEffect(() => {
    if (value) {
      switch (value) {
        case 'HFX-1':
          setDataSource(HFX12);
          break;
        case 'HFX-2':
          setDataSource(HFX12);
          break;
        case 'HF':
          setDataSource(HF);
          break;
        case 'GCMS-1':
          setDataSource(GCMS);
          break;
        case 'GCMS-2':
          setDataSource(GCMS);
          break;
        case '6500+':
          setDataSource(AB6500);
          break;
        default:
          break;
      }
    }
  }, [value]);

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: <FormattedMessage id='warmup.position'/>,
      dataIndex: 'position',
      width: '20%',
      editable: true,
    },
    {
      title: <FormattedMessage id='qc.type'/>,
      dataIndex: 'type',
      width: '20%',
      editable: true,
    },
    {
      title: <FormattedMessage id='injection.times'/>,
      dataIndex: 'frequency',
      width: '20%',
      editable: true,
    },
    {
      title: <FormattedMessage id='file.name'/>,
      dataIndex: 'fileName',
      width: '30%',
      editable: true,
    },
    {
      title: <FormattedMessage id='acquisition.method'/>,
      dataIndex: 'method',
      width: '28%',
      editable: true,
    },
    // {
    //   title: '采集方法（路径）',
    //   dataIndex: 'dataAddress',
    //   width: '23%',
    //   editable: true,
    // },
    {
      title: <FormattedMessage id='option'/>,
      width: '10%',
      dataIndex: 'operation',
      // @ts-ignore
      render: (_, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <Popconfirm title={<FormattedMessage id='confirm.delete'/>} onConfirm={() => handleDelete(record.key)}>
            <Tag color="red"><FormattedMessage id='delete'/></Tag>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: `${count}`,
      position: '',
      type: '',
      frequency: '',
      method: '',
      fileName: '',
      dataAddress: '',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <Modal
      width={1000}
      title={<FormattedMessage id='warmup.table'/>}
      visible={visible}
      destroyOnClose
      onOk={() => {
        onOk(dataSource);
      }}
      onCancel={() => {
        switch (value) {
          case 'HFX-1':
            onCancel(HFX12);
            setDataSource(HFX12);
            break;
          case 'HFX-2':
            onCancel(HFX12);
            setDataSource(HFX12);
            break;
          case 'HF':
            onCancel(HF);
            setDataSource(HF);
            break;
          case 'GCMS':
            onCancel(GCMS);
            setDataSource(GCMS);
            break;
          case '6500+':
            onCancel(AB6500);
            setDataSource(AB6500);
            break;
          default:
            onCancel([]);
            setDataSource(HFX12);
            break;
        }
      }}
    >
      <div>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
          <FormattedMessage id='add.a.row'/>
        </Button>
        <Table
          components={components}
          rowClassName={() => `${styles.editableRow}`}
          bordered
          dataSource={dataSource}
          columns={columns as ColumnTypes}
        />
      </div>
    </Modal>
  );
};

export default PreHeartTable;
