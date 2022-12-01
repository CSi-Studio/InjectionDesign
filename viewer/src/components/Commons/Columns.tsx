import {isNull} from 'lodash';
import {notBlank} from '@/utils/StringUtil';
import {Tag, Tooltip} from 'antd';

export const AdductColumns = [
  {
    title: 'ionForm',
    key: 'ionForm',
    dataIndex: 'ionForm',
    sorter: (a: any, b: any) => a.ionForm.localeCompare(b.ionForm),
  },
  {
    title: 'Compound m/z',
    key: 'mz',
    dataIndex: 'mz',
    render: (text: number) => text.toFixed(4),
    sorter: (a: any, b: any) => a.mz - b.mz,
  },
  {
    title: 'Charge',
    key: 'charge',
    dataIndex: 'charge',
    render: (text: number) => {
      return text > 0 ? '+' + text : text;
    },
    sorter: (a: any, b: any) => a.charge - b.charge,
  },
  {
    title: 'adductMw',
    key: 'mw',
    dataIndex: 'mw',
    render: (text: number) => text.toFixed(4),
    sorter: (a: any, b: any) => a.mw - b.mw,
  },
];

export const splitToTag = (kvStr: string) => {
  if (isNull(kvStr)) {
    return '';
  }
  const kvList = kvStr.split(';');
  const tagList: any[] = [];
  kvList.forEach((kv) => {
    if (notBlank(kv.trim())) {
      const kAndV = kv.split(':');
      tagList.push(<Tag color="blue">{kAndV[1]}</Tag>);
    }
  });
  return <>{tagList}</>;
};

export function transToTags(tags: string[], color?: string) {
  if (tags) {
    const tagList: any[] = [];
    tags.forEach((tag) => {
      if (notBlank(tag?.trim())) {
        tagList.push(<Tag key={tag} color={color ? color : 'blue'}>{tag}</Tag>);
      }
    });
    return tagList;
  } else {
    return [];
  }
}

export function transToLabelArrange(tags: string[], color?: string) {
  if (tags) {
    const tagList: any[] = [];
    tags.forEach((tag) => {
      if (notBlank(tag?.trim())) {
        tagList.push(<Tag key={tag} color={color ? color : 'gold'}>{tag}</Tag>);
      }
    });
    if (tags.length <= 3) {
      return tagList;
    }
    else {
      const test = tags.map(Number)
      const max = Math.max(...test)
      const min = Math.min(...test)
      const result: any[] = [];
      result.push(
        <span>
          <Tooltip title={<div>{tagList}</div>}>
            <div style={{float: "left", maxWidth: '100%'}}>
                <Tag color={'gold'}>{min}</Tag>... <Tag color={'gold'}>{max}</Tag>
            </div>
          </Tooltip>
        </span>
      )
      return result;
    }
  } else {
    return '';
  }
}


export function transToLabel(tags: string[], color?: string) {
  if (tags) {
    const tagList: any[] = [];
    tags.forEach((tag) => {
      if (notBlank(tag?.trim())) {
        tagList.push(<Tag key={tag} color={color ? color : 'gold'}>{tag}</Tag>);
      }
    });
    return tagList;
  } else {
    return [];
  }
}

export function purpleToTags(tags: string[]) {
  if (tags) {
    const tagList: any[] = [];
    tags.forEach((tag) => {
      if (notBlank(tag?.trim())) {
        tagList.push(<Tag color="purple">{tag}</Tag>);
      }
    });
    return tagList;
  } else {
    return [];
  }
}
