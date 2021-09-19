import axios from "axios";
import { AuthApiData, AuthApiSchoolData } from "../../interface/AuthApiData";
import { FetchOptions } from "../../interface/FetchOptions";
import { v4 as uuidv4 } from 'uuid';
import { schoolFields } from "../../interface/School";

function setTokenExpiry(value: string) {
    const now = new Date();

    const item = {
        value: value,
        expiry: (now.getTime() + 300000),
    }
    localStorage.setItem("sessionId", JSON.stringify(item));
}

function getExpiredKey() {
    const localItem = localStorage.getItem('sessionId');
    if (!localItem) {
        return null;
    }
    const item = JSON.parse(localItem);
    const now = new Date();
    if (now.getTime() > item.expiry) {
        localStorage.removeItem('sessionId');
        return null;
    }
    return item.value;
}

export const getSchoolById = async (id: string): Promise<AuthApiSchoolData> => {
    const fetchOption: FetchOptions = {
        method: "GET",
        headers: { 
            "Content-Type": "application/json"
        }, 
        credentials: "omit",
    };
    return await fetch(`https://project-pkmon-server.herokuapp.com/${id}`, fetchOption)
        .then((res) => res.json())
        .catch(() => ({
            error: { message: "Unable to connect to server. Please try again" },
        }));
};

export const createSchool = async (formData: FormData): Promise<any> => {
    
    const sessionId = getExpiredKey();
    if (sessionId != null) {
        return await axios({
           method: "post",
           url:  `/${sessionId.value}`,
           data: formData,
           headers: {'Content-Type': "multipart/form-data"},
        }).then((res) => { return res.data }).catch(() => ({
            error: { message: "Unable to connect to server. Please try again" },
        }));
    } else {
        const tempID = uuidv4();
        setTokenExpiry(tempID);
        return await axios({
            method: "post",
            url:  `https://project-pkmon-server.herokuapp.com/${tempID}`,
            data: formData,
            headers: {'Content-Type': "multipart/form-data"},
         }).then((res) => { return res.data }).catch(() => ({
             error: { message: "Unable to connect to server. Please try again" },
         }));
    }

};

export const createSchoolNoImg = async (formData: schoolFields): Promise<any> => {
    
    const sessionId = getExpiredKey();
    if (sessionId != null) {
        const fetchOptions: FetchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: 'omit',
        };
        return await fetch(`https://project-pkmon-server.herokuapp.com/n/${sessionId.value}`, fetchOptions)
            .then((res) => res.json())
            .catch(() => ({
                error: { message: 'Unable to connect to server. Please try again' },
            }));
    } else {
        const tempID = uuidv4();
        setTokenExpiry(tempID);
        console.log(JSON.stringify(formData));
        debugger;
        const fetchOptions: FetchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: 'omit',
        };
        return await fetch(`https://project-pkmon-server.herokuapp.com/n/${tempID}`, fetchOptions)
            .then((res) => res.json())
            .catch(() => ({
                error: { message: 'Unable to connect to server. Please try again' },
            }));
    }

};

export const updateSchool = async (formData: FormData, id: string, creatorId: string): Promise<any> => {

    return await axios({
       method: "patch",
       url:  `https://project-pkmon-server.herokuapp.com/${id}/${creatorId}`,
       data: formData,
       headers: {'Content-Type': "multipart/form-data"},
    }).then((res) => { return res.data }).catch(() => ({
        error: { message: "Unable to connect to server. Please try again" },
    }));

};

export const updateSchoolNoImg = async (formData: schoolFields, id: string, creatorId: string): Promise<any> => {
    
        const fetchOptions: FetchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: 'omit',
        };
        return await fetch(`https://project-pkmon-server.herokuapp.com/n/${id}/${creatorId}}`, fetchOptions)
            .then((res) => res.json())
            .catch(() => ({
                error: { message: 'Unable to connect to server. Please try again' },
            }));
    

};

export const getAllSchools = async (): Promise<AuthApiData> => {
    const fetchOptions: FetchOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
    };
    return await fetch('https://project-pkmon-server.herokuapp.com/schools', fetchOptions)
        .then((res) => res.json())
        .catch(() => ({
            error: { message: 'Unable to connect to server. Please try again' },
        }));
};