import axios from 'axios';

const API_URL = 'https://shearnode.com/api/v1/';
// const API_URL = 'http://10.0.2.2:5050/';

export const getQRInfo = async (data: any) => {
    try {
        console.log('requesting qr info', data);
        const res = await axios.post(`${API_URL}qrcode/decrypt`, { encryptData: data } );
        console.log("qrcode info:", res.data);
        return res.data.data;
    } catch (err) {
        console.log('error', err);
        return null;
    }
}

export const getIdentifierInfo = async (data: any) => {
    try {
        const res = await axios.post(`${API_URL}qrcode/serialdata/productinfo`, { data } );
        return res.data.data;
    } catch (err) {
        console.log('error', err);
        return null;
    }
}

export const CalculateRemainPeriod = (start: string, data: any) => {
    const {period, unit} = data;
    console.log(start, period, unit);
    let startDate = new Date(start.replaceAll('.', '-'));
    console.log(startDate);

    let newDate = new Date(startDate);

    if (unit == 0) {
        newDate.setDate(startDate.getDate() + period * 7);
    } else if (unit == 1) {
        newDate.setMonth(startDate.getMonth() + period);
    }

    let cDate = new Date();

    console.log(newDate, cDate);
    let duaration = Math.floor((newDate.getTime() - cDate.getTime()) / (24 * 60 * 60 * 1000));
    console.log(duaration);

    let res = '';
    if (duaration >= 7) {
        res += Math.floor(duaration / 7) + ' Weeks';
    }
    if (duaration >= 7 && duaration % 7 > 0) {
        res += ', ';
    }
    if (duaration % 7 > 0){
        res += (duaration % 7) + ' Days';
    }

    if (duaration < 0) {
        res = 'Expired';
    }

    return {duaration, string: res};

}