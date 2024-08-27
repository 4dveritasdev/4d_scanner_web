import axios from 'axios';

const API_URL = 'https://shearnode.com/api/v1/';
// const API_URL = 'http://10.0.2.2:5050/';

export const getQRInfo = async (data: any) => {
    try {
        console.log('requesting qr info', data);
        const res = await axios.post(`${API_URL}qrcode/decrypt`, { encryptData: data } );
        console.log("qrcode info:", res.data);
        return res.data;
    } catch (err) {
        console.log('error', err);
        return null;
    }
}