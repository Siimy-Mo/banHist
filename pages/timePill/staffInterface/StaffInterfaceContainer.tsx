// import useAxios from 'axios-hooks';
import { FormEventHandler, useEffect, useCallback, useState } from 'react';
import Api from '../../../apis';
import StaffInterfaceView from './StaffInterfaceView';
import { useRouter } from 'next/router';
import useAxios from 'axios-hooks';
import axios from 'axios';
import { Alert } from 'flowbite-react';


const apiSetting = new Api();

const status =  //子组件不用所以这里不放在cxt中
{
    received: 0,  //未到期
    confirmed: 0,  //店员确认
    informed: 0,  //店员已发邮件
    expire: 0,  //已到期，未领取
    finish: 0,  //完成，已领取
    unused: 0, //完成，未领取
}


interface headerForm {
    'Content-Type': string,
    Authorization: string,
};

export default function StaffInterfaceContainer() {
    // const [tableDisplay, setTableDisplay] = useState(0)
    const [checkid, setCheckid] = useState(-1)
    const [targetStatus, setTargetStatus] = useState([])
    const [headers, setHeader] = useState<headerForm>()

    const router = useRouter();
    const [{ data: allPillsData }, getAllPills] = useAxios({},
        { manual: true }
    );
    const [{ data: changePillStatusData }, changePillStatus] = useAxios({},
        { manual: true }
    );
    const [{ data: sendEmailConfirmData }, sendEmailConfirm] = useAxios({},
        { manual: true }
    );


    const getNum = (data: any, target: string) => {
        let num = 0
        data.map((item: any) => {
            (item.status == target) ?
                num += 1 : num = num
        })
        return num
    }

    const getPills = async (header: any) => {
        // console.log('GetPills in Interface:')
        const res = await getAllPills(apiSetting.PillStatus.getAllPills(header))
        if (res.data.success) {
            const pills = res.data.doc
            status.received = getNum(pills, 'received')
            status.confirmed = getNum(pills, 'confirmed')
            status.informed = getNum(pills, 'informed')
            status.expire = getNum(pills, 'expire')
            status.finish = getNum(pills, 'finish')
            status.unused = getNum(pills, 'unused')
        };
    }


    const Logout = useCallback(() => {
        localStorage.removeItem('authorization');
        localStorage.removeItem('email');
        document.cookie = `authorization=null; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
        alert('账户已登出')
        router.reload();
    }, [router]);

    const sendEmail = async (code: number) => {
        console.log('sendEmail Function:')
        const res = await sendEmailConfirm(apiSetting.PillStatus.sendEmailConfirm(headers, code))
        if (res.data.success) {
            alert('成功发送邮件！')
        }
    }

    const changePill = async (checkid: number, targetStatus: string) => {
        if (targetStatus == 'informed') {
            if (confirm('是否确认发送邮件')) {
                sendEmail(checkid)
                const res = await changePillStatus(apiSetting.PillStatus.changePillStatus(headers, checkid, targetStatus))
                if (res.data.success) {
                    getPills(headers)
                    // console.log(res)
                    router.reload()
                };
            }
        } else {
            const res = await changePillStatus(apiSetting.PillStatus.changePillStatus(headers, checkid, targetStatus))
            if (res.data.success) {
                // console.log(res)
                getPills(headers)
                router.reload()
            };
        }
    };

    const changePills2expire = async (checkid: Array<number>) => {
        for (let i in targetStatus) {
            if (targetStatus[i] != -1) {
                console.log(checkid[i])
                const res = await changePillStatus(apiSetting.PillStatus.changePillStatus(headers, checkid[i], 'expire'))
                if (res.data.success) {
                    continue
                };
            }
        }
        router.reload();
    };

    // 检查token，不然跳转至login
    useEffect(() => {
        // axios.defaults.headers.common['authorization'] =
        //     localStorage.getItem('authorization') || '';
        const data = localStorage.getItem('authorization');
        if (data) {
            const header = {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + data,
            };
            setHeader(header)
            //do something
            // axios.get('https://futureword.m2mda.com/api/capsules/search')
            // axios.get('https://randomuser.me/api/') // 是可以用的
            // axios({
            //     method: 'get',
            //     url: 'https://futureword.m2mda.com/api/capsules',
            //     headers: headers,
            // })
            //     .then((res) => {
            //         console.log(res.data)
            //     })
            getPills(header)
            // console.log(status)
        } else {
            router.push('./staffLogin');
        }
    }, []);

    //父组件的function:
    useEffect(() => {
        // console.log('父组件的function：',checkid, targetStatus)
        if (targetStatus[0] == -1) {
            changePills2expire(targetStatus)
        } else if (checkid != -1) { // 初始化的时候有影响
            changePill(checkid, targetStatus[0])
        }
    }, [checkid, targetStatus])


    return (
        <StaffInterfaceView {...{ headers, status, setCheckid, setTargetStatus, Logout }} />
    )

}
