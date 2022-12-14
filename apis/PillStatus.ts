// apis/Classification.ts
import { AxiosRequestConfig } from 'axios';
import { stat } from 'fs';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 记得加 token！
export default class PillStatus {
    getAllPills(headers:any){
        const requestHeader: AxiosRequestConfig = {
            baseURL: baseURL,
            headers:headers,
            url: `/api/capsules`,
            method: 'GET',
        };
        return requestHeader;
    }

    getAllPillsWithStatus(headers:any, status?: string){
        const requestHeader: AxiosRequestConfig = {
            baseURL: baseURL,
            headers:headers,
            url: `/api/capsules?status=${status}`,
            method: 'GET',
        };
        return requestHeader;
    }

    // /api/capsules/1
    changePillStatus(headers:any, code:number, status:string) {
        const requestHeader: AxiosRequestConfig = {
            baseURL: baseURL,
            headers:headers,
            url: `/api/capsules/${code}`,
            method: 'PUT',
            data: {
                status,
            }
        };
        return requestHeader;
    }


    sendEmailConfirm(headers:any, code:number){
        const requestHeader: AxiosRequestConfig = {
            baseURL: baseURL,
            headers:headers,
            url: `/api/capsules/${code}/send_email`,
            method: 'POST',
        };
        return requestHeader;
    }


    // data:
    // { 
    //     code: "050363"
    // }

    queryPill(headers:any, code:string){
        const requestHeader: AxiosRequestConfig = {
            baseURL: baseURL,
            headers:headers,
            url: `/api/capsules/search?code=${code}`,
            // url: `/api/capsules/search?code=884431`,
            method: 'GET',
        };
        return requestHeader;
    }
}
