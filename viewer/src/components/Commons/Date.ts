import moment from "moment";

export function format(datatime: string) {
  return moment(datatime).format('YYYY-MM-DD HH:mm:ss')
}
