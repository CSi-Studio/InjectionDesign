import moment from "moment";

export function format(datatime: string) {
  return moment(datatime).format('YYYY-MM-DD HH:mm:ss')
}

export function formatNoYear(datatime: string){
  return moment(datatime).format('MM-DD HH:mm:ss')
}
