import axios from 'axios'

// export default {
//     getData: () =>
//     axios({
//         'method':'GET',
//         'url':'https://www.reddit.com/r/aww/top.json',
//         'headers': {
//             'accept': 'application/json',
//             'content-type':'application/json'

//         },
//         'params': {
//             't':'day',
//             'limit':1
//         },
//     })
// }

export default axios.create({
    baseURL: 'https://www.reddit.com/r/aww/top.json',
    responseType: 'json'
});