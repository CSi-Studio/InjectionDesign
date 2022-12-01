import { Typography } from "antd"


export default (props: {errorInfo: string;text: React.ReactNode})=>{
    return <>
    {props.errorInfo?.length ? <>
        <Typography.Text type='danger' ellipsis={{ tooltip: props.errorInfo }}>{props.errorInfo}</Typography.Text></> : null}
</>
}
