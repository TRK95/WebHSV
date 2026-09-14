
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import 'antd/dist/antd.css';
import './index.css'
import { ADMIN, QUAN_LY_MAIL, CARER, SALE, LEADER_SALE } from './utils/contrants';
import App from './App';

const roles = localStorage.getItem('role_CRM')
const id = localStorage.getItem('account_CRM')
const dataRoles = roles ? JSON.parse(roles) : []
const datId = id
let dataTypeRole = -1
if (dataRoles?.find(item => item === 99)) {
    dataTypeRole = ADMIN
} else if (dataRoles?.find(item => item === 5)) {
    dataTypeRole = LEADER_SALE
} else if (dataRoles?.find(item => item === 1002)) {
    dataTypeRole = CARER
} else if (dataRoles?.find(item => item === 4)) {
    dataTypeRole = SALE
} else if (dataRoles?.find(item => item === 97)) {
    dataTypeRole = SALE
}

// if (datId && dataTypeRole >= 0) {
// const dataRoot = {
//     staffId: id as string,
//     role: dataTypeRole
// }
const dataRoot = {
    staffId: 'quan003',
    role: ADMIN
}
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("cms")
);
// } else {
//     ReactDOM.render(
//         <LoginComponent />,
//         document.getElementById("cms")
//     );
// }