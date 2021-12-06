import { authHeader } from '../_helpers';
import { useConfig } from "../../config";
import axios from 'axios';

const config = useConfig()
const serverURL = config.serverUrl

export const packageService = {
    getOptions,
}

function getOptions() {
    
    return fetch(`${serverURL}/getPackageOptions`).then(handleResponse);
}
function handleResponse(response){
    return response.text().then(text => {
        let res = JSON.parse(text)
        console.log(res)
        let data = JSON.parse(res['data'])
        return data
        // let fields = JSON.parse(data[0]['fields'])
        // console.log(res,data,fields)
        // return fields
        return res
    })
}
