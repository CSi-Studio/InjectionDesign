import qs from "qs";

export const notNull = (object: any) => {
  if (object !== null && object !== undefined) {
    return true;
  } else {
    return false;
  }
}

export const isNull = (object: any) => {
  if (object === null || object === undefined) {
    return true;
  } else {
    return false;
  }
}

export const notBlank = (object: any) => {
  if (object !== null && object !== undefined && object !== '') {
    return true;
  } else {
    return false;
  }
}

export const isBlank = (object: any) => {
  if (object === null || object === undefined || object === '') {
    return true;
  } else {
    return false;
  }
}

export function getParam(location: any, param: string) {
  return qs.parse(location.search.replace('?', ''))[param] as string;
}
