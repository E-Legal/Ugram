import axios from 'axios'
import cookie from 'react-cookies'
import env from './utils/env'
import { ImageToUpload } from "./component/upload_images_components/UploadPage";

const url = env.url;
const login_url = env.url;

export interface IError {
    code: number;
    message: string;
}

export interface IResult {
    code: number;
    data: string | object;
}

export async function deleteAccount() {
    const token = cookie.load("token")
    return await axios.delete(url + "/users", {
        headers: {
            'Authorization': token
        }
    })
}

export async function updateProfileinfos(data: object): Promise<any> {
    const token = cookie.load("token")
    return await axios.put(url + "/users", data, {
        headers: {
            'Authorization': token
        }
    })
}

export async function getProfileInfos(userId: string): Promise<any> {
    const token = cookie.load("token")
    return await axios.get(url + "/users/" + userId, {
        headers: {
            'Authorization': token
        }
    })
}

export async function getNotification(): Promise<any> {
    const token = cookie.load("token")
    return await axios.get(url + "/notifications", {
        headers: {
            'Authorization': token
        }
    })
}

export const searchDescription = async (queryString: String): Promise<any> => {
    return await axios.get(url + "/search/images/desc", {
        headers: {
            'Authorization': cookie.load("token")
        },
        params: {
            q: queryString
        }
    });
};

export const searchHashtag = async (queryString: String): Promise<any> => {
    return await axios.get(url + "/search/images/tag", {
        headers: {
            'Authorization': cookie.load("token")
        },
        params: {
            q: queryString
        }
    });
};

export const allUsers = async (): Promise<any> => {
    return await axios.get(url + "/users", {
        headers: {
            'Authorization': cookie.load("token")
        }
    });
};

export const deleteImage = async (id: any): Promise<any> => {
    return await axios.delete(url + "/images/" + id, {
        headers: {
            'Authorization': cookie.load("token")
        }
    });
};

export const editImage = async (id: any, imageDetails: any): Promise<any> => {
    return await axios.put(url + "/images/" + id, {
        title: imageDetails.title,
        description: imageDetails.description,
        tags: imageDetails.tags
    }, {
        headers: {
            'Authorization': cookie.load("token")
        }
    });
};

export const getImage = async (id: any): Promise<any> => {
    return await axios.get(url + "/images/" + id, {
        headers: {
            'Authorization': cookie.load("token")
        }
    });
};

export const reactImage = async (id: any): Promise<any> => {
    return await axios.post(url + "/images/" + id + "/react", {}, {
        headers: {
            'Authorization': cookie.load("token")
        }
    });
};

export const unreactImage = async (id: any): Promise<any> => {
    return await axios.post(url + "/images/" + id + "/unreact", {}, {
        headers: {
            'Authorization': cookie.load("token")
        }
    });
};

export const addComment = async (id: any, text: string): Promise<any> => {
    return await axios.post(url + "/images/" + id + "/comment", {
        text: text
    }, {
        headers: {
            'Authorization': cookie.load("token")
        }
    });
};

export const getAllImages = async (id: any): Promise<any> => {
    return await axios.get(url + "/users/" + id + "/images/", {
        headers: {
            'Authorization': cookie.load("token")
        }
    });
};

export const searchUsers = async (queryString: String): Promise<any> => {
    return await axios.get(url + "/search/users", {
        headers: {
            'Authorization': cookie.load("token")
        },
        params: {
            q: queryString
        }
    });
};

export const getSearch = async (type: String, queryString: String): Promise<any> => {
    let route;
    switch (type) {
        case "Description":
            route = "/images/desc";
            break;
        case "Utilisateurs":
            route = "/users";
            break;
        case "Hashtag":
            route = "/images/tag"
    }

    return await axios.get(url + "/search" + route, {
        headers: {
            'Authorization': cookie.load("token")
        },
        params: {
            q: queryString
        }
    });
};
export async function UserLogin(email: string, password: string): Promise<any> {
    return await axios.post(login_url + "/login", {
        email: email,
        password: password,
    })
}

export async function googleLogin(params: object): Promise<any> {
    return await axios.post(login_url + '/google/login', params);
}

export async function UserRegister(username: string, name: string, last_name: string, email: string, phone_number: string, password: string): Promise<any> {
    return await axios.post(login_url + "/register", {
        username, name, last_name, email, phone_number, password,
    })
}

export async function uploadImage(imageDetails: ImageToUpload) {
    const data = new FormData();

    data.append('file', imageDetails.file as any);

    const tagsArray = imageDetails.tags.split(' ');

    return axios.post(url + "/images", data, {
        headers: {
            'Authorization': cookie.load("token")
        },
        params: {
            title: imageDetails.title,
            description: imageDetails.description,
            tags: tagsArray
        }
    }
    )
}

export async function getPopularTags() {
    return await axios.get(url + "/popular/tags", {
        headers: {
            'Authorization': cookie.load("token")
        }
    });
}