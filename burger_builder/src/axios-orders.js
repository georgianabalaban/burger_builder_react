import axios from 'axios';

const instance = axios.create({
   baseURL: 'https://reactcourse-burgerapp.firebaseio.com/'
});

instance.defaults.headers.common['Authorization'] = 'Auth token';
instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
export default instance;