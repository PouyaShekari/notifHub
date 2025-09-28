import axios from "axios";
import config from "./../config";
import toast from "react-hot-toast";
import {clearDB} from "./db";

// Create a single axios instance
const axiosInstance = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  },
});

// Add request interceptor for token
axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    function (response) {
      return response.data ? response.data : response;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      let message;
      const originalRequest = error?.config;

      switch (error?.response?.status) {
        case 500:
          message = "خطای سرور رخ داده است.";
          break;
        case 401: {
          message = "";
          const accessToken = localStorage.getItem("accessToken");
          const refreshToken = localStorage.getItem("refreshToken");

          if (!originalRequest?._retry) {
            originalRequest._retry = true;

            // Return the promise chain to properly handle async operations
            return axiosInstance
                .post(`/account/RefreshToken`, { accessToken, refreshToken })
                .then(async ({ data }) => {
                  if (data?.accessToken !== localStorage.getItem("accessToken")) {
                    localStorage.setItem("accessToken", data?.accessToken);
                    localStorage.setItem("refreshToken", data?.refreshToken);
                    originalRequest.headers["Authorization"] = "Bearer " + data?.accessToken;
                  }

                  // Return the retry of the original request
                  return axiosInstance(originalRequest);
                })
                .catch(() => {
                  toast.error('نشست شما منقضی شده است.')
                  setTimeout(async ()=>{
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("loginTime")
                    localStorage.removeItem("userInfo")
                    localStorage.removeItem('activeApp');
                    localStorage.removeItem('connectionId');
                    await clearDB()
                    window.location.href = '/login';
                  },2000)
                });
          }

          // If already retried once, reject with message
          return Promise.reject(message || "Authentication failed");
        }

        case 404:
          message = "محتوای مورد نظر یافت نشد.";
          break;
        case 400:
          message = error?.response?.data?.Message;
          break;
        default:
          message = error.message || error?.Message || error;
      }
      return Promise.reject(message);
    }
);

class APIClient {
  /**
   * Fetches data from given url
   */
  get = (url, params) => {
    return axiosInstance.get(url, params); // Use axiosInstance instead of axios
  };

  /**
   * post given data to url
   */
  create = (url, data) => {
    return axiosInstance.post(url, data); // Use axiosInstance instead of axios
  };

  /**
   * Updates data
   */
  update = (url, data) => {
    return axiosInstance.put(url, data); // Use axiosInstance instead of axios
  };

  /**
   * Delete
   */
  delete = (url) => {
    return axiosInstance.put(url); // Use axiosInstance instead of axios (note: you might want .delete() instead of .put())
  };

  // ================ Specific API Functions ================ //

  register = (userData) => {
    return this.create("/account/Register", userData);
  };

  login = (credentials) => {
    return this.create("/account/login", credentials);
  };

  getCaptcha = (credentials) => {
    return this.get("/captcha/generateCaptcha", credentials);
  };

  getUserInfo = () => {
    return this.get("/User/GetUserInfo");
  }

  updateUserInfo = (userData) => {
    return this.create("/User/UpdateUserInfo", userData);
  }

  updatePassword = (userData) => {
    return this.create("/User/UpdatePassword", userData);
  }

  getPreviewMessages = () => {
    return this.get("/Message/GetPreviewMessages");
  }

  getMessages = (appId,take,page) => {
    return this.get(`/Message/GetMessageList?ApplicationId=${appId}&Take=${take}&Page=${page}`);
  }

  seenPerApplication = (appId) => {
    if(localStorage.getItem("connectionId")) return this.create(`/Message/SeenPerApplication?applicationId=${appId}&ConnectionId=${localStorage.getItem("connectionId")}`)
    else return this.create(`/Message/SeenPerApplication?applicationId=${appId}`);
  }

  changeDefaultPassword = (userData) => {
    return this.create("/Account/ForceChangePassword", userData);
  }
}

export { APIClient };