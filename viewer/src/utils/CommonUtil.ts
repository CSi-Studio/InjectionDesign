import {groupBy} from "lodash";
import type {Sample} from "@/domains/Sample.d";
import {DimsEnum} from "@/components/Enums/Const";
import {message} from "antd";

export function groupBySample(array: Sample[]) {
  const dim1List = groupBy<Sample>(array, 'dim1')
  const dim2List = groupBy<Sample>(array, 'dim2')
  const dim3List = groupBy<Sample>(array, 'dim3')
  return {dim1List, dim2List, dim3List};
}

export function groupByAndCount4Samples(array: Sample[]) {
  const dim1 = groupBy(array, 'dim1')
  const dim2 = groupBy(array, 'dim2')
  const dim3 = groupBy(array, 'dim3')
  const dimRes1: Record<string, any>[] = [];
  const dimRes2: Record<string, any>[] = [];
  const dimRes3: Record<string, any>[] = [];
  Object.keys(dim1).forEach(key => {
    dimRes1.push({
      dim: 'dim1',
      name: key,
      count: dim1[key].length
    })
  })
  Object.keys(dim2).forEach(key => {
    dimRes2.push({
      dim: 'dim2',
      name: key,
      count: dim2[key].length
    })
  })
  Object.keys(dim3).forEach(key => {
    dimRes3.push({
      dim: 'dim3',
      name: key,
      count: dim3[key].length
    })
  })
  if (dimRes1.length > 4) {
    isAllNumbers(dimRes1);
  }

  //如果分组大于4,则需要对其重新分组
  if (dimRes1.length > 4) {
    //确认是否是数值型维度

  }
  return {dimRes1, dimRes2, dimRes3};
}

function isAllNumbers(items: Record<string, any>[]): boolean {
  //判断是否是数值类型
  let allNumber: boolean = true;
  for (let i = 0; i < items.length; i++) {
    if (!isNumber(items[i].name)) {
      allNumber = false;
      break;
    }
  }
  return allNumber;
}

function isNumber(value: string): boolean {
  return ((value != null) &&
    (value !== '') &&
    !isNaN(Number(value.toString())));
}

// 简单随机
export function simpleRandom(samples: Sample[]) {
  if (samples && samples.length > 0) {
    samples.sort(function () {
      return 0.5 - Math.random();
    });
    return samples;
  }

  return []
}

// 随机均衡
export function randomBalance(samples: Sample[], maxCount: number) {
  if (samples && samples.length > 0) {
    samples.sort(function () {
      return 0.5 - Math.random();
    });
    samples.forEach((item, index) => {
      item.set = Math.ceil((index + 1) / maxCount)
    })

    return samples;
  }
  return []
}

// 分组均衡
export function stratifiedBalance(samples: Sample[], maxCount: number, dim: string) {
  if (samples && samples.length > 0) {
    samples.sort(function () {
      return 0.5 - Math.random();
    });
    const plateCount = Math.ceil(samples.length / maxCount);
    const countOnSets = stratified(samples.length, plateCount);
    //计算板子数目以及均衡后各板子的载量
    const groups = groupBy(samples, DimsEnum[dim]);
    const sets = Array(plateCount);

    let groupRemainder: any[] = [];
    Object.values(groups).forEach(group => {
      let point = 0;
      const mean = Math.floor(group.length / plateCount);
      // const remainder = group.length - mean*plateCount;
      // groupRemainder.push(remainder);
      for (let i = 0; i < countOnSets.length; i++) {
        if (sets[i] === undefined) {
          sets[i] = [];
        }
        sets[i] = sets[i].concat(group.slice(point, point + mean));
        point = point + mean;
      }
      groupRemainder = groupRemainder.concat(group.slice(point, group.length))
    })

    for (let i = 0; i < groupRemainder.length; i++) {
      sets[i % plateCount].push(groupRemainder[i]);
    }
    let finalResults: any[] = [];
    for (let i = 0; i < sets.length; i++) {
      sets[i].forEach((item: Sample)=>{
        item.set = i+1;
      })
      finalResults = finalResults.concat(sets[i]);
    }

    return finalResults;
  }
  return []
}

function stratified(total: number, count: number) {
  const countOnSets: number[] = [];
  const mean = Math.floor(total / count);
  for (let i = 0; i < count; i++) {
    countOnSets.push(mean);
  }
  const remainder = total - mean * count;
  for (let i = 0; i < remainder; i++) {
    countOnSets[i] = countOnSets[i] + 1;
  }
  return countOnSets;
}

// 完全随机
export function completeRandom(samples: Sample[]) {
  const sets: any[] = Object.entries(groupBy<Sample>(JSON.parse(JSON.stringify(samples)), "set")).sort((a, b) => (a[0].localeCompare(b[0])));
  let finalResults: Sample[] = [];
  sets.forEach((set: any[]) => {
    if (set[1] && set[1].length > 0) {
      const groups = groupBy<Sample>(set[1], 'set')
      Object.values(groups).forEach(group => {
        finalResults = finalResults.concat(simpleRandom(group));
      })
    }
  })
  return finalResults;
}

// 区组随机
export function blockRandom(samples: Sample[], dim: string) {
  const sets: any[] = Object.entries(groupBy<Sample>(JSON.parse(JSON.stringify(samples)), "set")).sort((a, b) => (a[0].localeCompare(b[0])));
  let finalResults: Sample[] = [];

  // @ts-ignore
  sets.forEach((set: any[]) => {
    const randomSamples = set[1];
    const groupList = groupBy<Sample>(randomSamples, DimsEnum[dim]);
    let finalSeq: string = "";
    const results: Sample[] = [];

    //按照各个分组的长度从大到小排列各个分组
    let groups = Object.values(groupList).filter(group => group.length !== 0).sort((a: any, b: any) => b.length - a.length);

    //使用字符替换算法进行区块随机算法计算
    const seqList: any[] = [];
    while (groups.length != 0) {
      const groupCount = groups.length;
      //计算各个分组中长度最短的
      const minLength = groups[groups.length - 1].length
      let template: string = '';
      switch (groupCount) {
        case 1:
          template = "A";
          break;
        case 2:
          template = "AB";
          break;
        case 3:
          template = "ABC";
          break;
        case 4:
          template = "ABCD";
          break;
        case 5:
          template = "ABCDE";
          break;
        case 6:
          template = "ABCDEF";
          break;
        case 7:
          template = "ABCDEFG";
          break;
        case 8:
          template = "ABCDEFGH";
          break;
        default:
          message.error("Unsupport Dim Length.");
          return [];
      }

      const allEnums = blockGenerate(template);
      const currentSeqList = sequenceGenerate(allEnums, minLength);
      seqList.push(currentSeqList);
      const currentSeq = flat(currentSeqList);
      for (let i = 0; i < currentSeq.length; i++) {
        switch (currentSeq.charAt(i)) {
          case "A":
            groups[0].pop();
            break;
          case "B":
            groups[1].pop();
            break;
          case "C":
            groups[2].pop();
            break;
          case "D":
            groups[3].pop();
            break;
          case "E":
            groups[4].pop();
            break;
          case "F":
            groups[5].pop();
            break;
          case "G":
            groups[6].pop();
            break;
          case "H":
            groups[7].pop();
            break;
        }
      }

      groups = groups.filter(group => group.length !== 0);
    }

    groups = Object.values(groupBy<Sample>(JSON.parse(JSON.stringify(randomSamples)), DimsEnum[dim])).sort((a: any, b: any) => b.length - a.length);
    seqList.sort((a, b) => b.length - a.length)
    //seqList的长度一定是由大到小的排列,因此采用倒排随机插入
    for (let i = seqList.length - 1; i > 0; i--) {
      const stepLength = Math.floor(seqList[i - 1].length / seqList[i].length);
      let totalStep = 0;
      for (let j = 0; j < seqList[i].length; j++) {
        totalStep += stepLength;
        seqList[i - 1][totalStep] += seqList[i][j];
      }
    }
    finalSeq = flat(seqList[0]);
    for (let i = 0; i < finalSeq.length; i++) {
      switch (finalSeq.charAt(i)) {
        case "A":
          const sampleA = groups[0].pop();
          if (sampleA) {
            results.push(sampleA);
          }
          break;
        case "B":
          const sampleB = groups[1].pop();
          if (sampleB) {
            results.push(sampleB);
          }
          break;
        case "C":
          const sampleC = groups[2].pop();
          if (sampleC) {
            results.push(sampleC);
          }
          break;
        case "D":
          const sampleD = groups[3].pop();
          if (sampleD) {
            results.push(sampleD);
          }
          break;
        case "E":
          const sampleE = groups[4].pop();
          if (sampleE) {
            results.push(sampleE);
          }
          break;
        case "F":
          const sampleF = groups[5].pop();
          if (sampleF) {
            results.push(sampleF);
          }
          break;
        case "G":
          const sampleG = groups[6].pop();
          if (sampleG) {
            results.push(sampleG);
          }
          break;
        case "H":
          const sampleH = groups[7].pop();
          if (sampleH) {
            results.push(sampleH);
          }
          break;
      }
    }

    finalResults = finalResults.concat(results);
  })
  finalResults.sort((a,b)=>a.set - b.set);
  return finalResults;
}

function blockGenerate(template: string) {
  const result: any = [];
  if (template.length <= 1) {
    return [template];
  } else {
    for (let i = 0; i < template.length; i++) {
      const c = template[i];
      const newStr = template.slice(0, i) + template.slice(i + 1, template.length);
      const l = blockGenerate(newStr);

      for (let j = 0; j < l.length; j++) {
        const tmp = c + l[j];
        result.push(tmp);
      }
    }
  }
  return result;
}

function sequenceGenerate(enums: string[], length: number) {
  const sequenceList: string[] = [];
  for (let i = 0; i < length; i++) {
    sequenceList.push(enums[getRandomNumInt(0, enums.length - 1)]);
  }
  return sequenceList;
}

function getRandomNumInt(min: number, max: number) {
  const range = max - min;
  const rand = Math.random();
  return min + Math.round(rand * range);
}

function flat(seqList: string[]) {
  let sequence = "";
  for (let i = 0; i < seqList.length; i++) {
    sequence += seqList[i];
  }
  return sequence;
}


