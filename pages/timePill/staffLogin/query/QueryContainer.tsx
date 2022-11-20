// import useAxios from 'axios-hooks';
import { FormEventHandler, useEffect, useState } from 'react';
// import Api from '../../apis';
import QueryView from './QueryView';
import { useRouter } from 'next/router';

export default function QueryContainer() {
    const router = useRouter();
    useEffect(() => {

    }, []);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const date = formData.get('date');
        const content = formData.get('content') as string;
        const tip = formData.get('tip') as string;

        console.log('\nform中的内容：')
        console.log('【name, email, date】',name, email, date)
        console.log('【content, tip】',content, tip)
    };


    return <QueryView {...{handleSubmit}}/>; // 导出view 传入参数。
}