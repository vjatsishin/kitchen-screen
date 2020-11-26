import axios from 'axios';
import store from "@/store/store";

// axios.interceptors.request.use(function (config) {
//     //add token
//     // var client_token = (localStorage.getItem("client-token") != null) ? localStorage.getItem("client-token") : "";
//     var client_token = store.state.token != null ? store.state.token : "";
//     // console.log("api, token", client_token)
//     config.headers = {"client-token":client_token};

//     //set waiting status
//     store.commit('setIsWaiting', true);
//     return config;
//   }, function (error) {
//     return Promise.reject(error);
// });

axios.interceptors.response.use(function (response) {
    console.log("api", response)
    if(response.data.status === "error"){
        let errors = response.data.error;
        for(let e in errors) {
            console.log("api", errors[e])
            if(errors[e] === "you token is not valid"){
                store.commit('LOGOUT');
                break;
            }
        }
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});

export class User{
    // isLoggedIn(){
    //     return axios.get(`/user/is_loggedin/`);
    // }

    // logOut(){
    //     return axios.get(`/user/logout/`);
    // };

    // verification(phone){
    //     return axios.get(`/user/verification/` + phone);
    // };

    // registration(phone, code){
    //     return axios.get(`/user/registration/` + phone + '/' + code);
    // };
}