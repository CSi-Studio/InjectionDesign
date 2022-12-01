const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const date2str = (date : Date | string) : string =>  {
    if(date === undefined) return '';
    const cTime = new Date(date)

    return month[cTime.getMonth()] + " " + cTime.getDate() + " " + cTime.getFullYear()
}
