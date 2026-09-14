import { Container, useMediaQuery, Grid, CircularProgress, Autocomplete, TextField } from "@mui/material";
import { useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import Image from "next/image";
import './style.scss'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { apiGetClubsByDate } from "../../utils/api/clubsApi";
import { CONTACT_CLUB_TYPE, DOMAIN_ID_ALUMNI, RESPONSE_SUCCESS } from "../../utils/constraint";
import { apiGetUnitTrainings } from '../../utils/api/inforApi';
import { apiSearchStudent } from "../../utils/api/searchStudentApi";
import _ from "lodash";
import { makeStyles } from "@mui/styles";

export const itemsShow = 3

const useStyles = makeStyles({
    listbox: {
        maxHeight: "400px",
        overflowX: "scroll",
        width: "100%",
        '& li': {
            fontSize: '12px'
        },
        '&::-webkit-scrollbar': {
            width: '7px !important',
            height: '7px !important',
        },
        '&::-webkit-scrollbar-track': {
            borderRadius: '7px',
            background: '#f9f9f9'
        },
        '&::-webkit-scrollbar-thumb': {
            borderRadius: '7px',
            background: '#d0d0d0',
            '&:hover': {
                background: '#8a8a8a'
            }
        }
    },
    autocompleteRoot: {
        borderRadius: '12px',
        padding: "4px !important",
        '@media (max-width: 576px)': {
            width: '340px !important',
        },
        '@media (max-width: 376px)': {
            width: '300px !important',
        },
    },
    input: {
        fontSize: '14px !important'
    }
});

const optionsSession = [
    {
        label: "Khóa 55",
        value: 55
    },
    {
        label: "Khóa 56",
        value: 55
    },
    {
        label: "Khóa 57",
        value: 55
    }
]

function InforSearching({ title }: { title?: string }) {
    const theme = useTheme();
    const isLgDeskopUI = useMediaQuery(theme.breakpoints.down('xxl'));
    const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();
    const [showMoreItems, setShowmoreItems] = useState(itemsShow);
    const [inforDataArr, SetInforDataArr] = useState(null);
    const [optionsUnitTraning, setOptionsUnitTraining] = useState<Array<{ name?: string, id?: string }>>([]);
    const [dataUser, setDataUser] = useState<any[]>([]);
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);

    const getContactClubs = async () => {
        const contactClubsRes = await apiGetClubsByDate({
            reqQuery: {
                limit: 20,
                offset: 0,
                type: CONTACT_CLUB_TYPE,
            }
        })

        if (contactClubsRes.status === RESPONSE_SUCCESS) {
            let contactRes = contactClubsRes.data.filter(item => item.president !== null)
            SetInforDataArr(contactRes)
        }
    }

    useEffect(() => {
        getContactClubs()
    }, [])

    const getUnitTrainings = async () => {
        const unitTrainingRes = await apiGetUnitTrainings()
        if (unitTrainingRes?.data.length > 0) {
            setOptionsUnitTraining(prev => [...prev, ...unitTrainingRes.data.map(item => {
                return {
                    name: item.name,
                    id: item.id.toString()
                }
            })])
        }
    }

    useEffect(() => {
        getUnitTrainings()
    }, [])

    const handleShowMore = () => {
        setShowmoreItems(inforDataArr.length)
    }

    const handleShowLess = () => {
        setShowmoreItems(itemsShow)
    }

    const searchStudent = async (value) => {
        setSearchLoading(true)
        if (value?.trim()) {
            const datas = await apiSearchStudent({
                reqQuery: {
                    keyword: value?.trim(),
                    token: 'PNiIwCMI8VrDA16n3IQj-ALUMI',
                    sessionId: window.localStorage.getItem('session_id') || '7056B3FA-D20F-46BE-BE06-A65492321F3E-1671005449591_1671005449591'
                }
            })
            if (datas) {
                setDataUser(datas)
                setIsSearch(true)
            }
        } else {
            setDataUser([])
        }
        setSearchLoading(false)
    }

    let timeoutId = null;
    const handleSearchStudent = (event) => {
        if (event.keyCode === 13) {
            clearTimeout(timeoutId);
            let value = event.target.value;
            searchStudent(value)
        }
    }

    const handleSearchOnChange = (event) => {
        clearTimeout(timeoutId);
        if (event.target.value === '') {
            setIsSearch(false);
        } else {
            timeoutId = setTimeout(() => {
                let value = event.target.value;
                searchStudent(value);
            }, 2000);
        }
    };

    return (
        <Container maxWidth={isLgDeskopUI ? 'lg' : 'xl'}>
            <div id="infor-searching">
                <div className="infor-searching-header">
                    <div className="infor-searching-header-title title-h1">
                        <div className="title-h1-icon">
                            <Image src='/images/icon-head-subject.svg' layout='responsive' width={20} height={20} />
                        </div>
                        {title}
                    </div>
                    <div className="infor-searching-header-actions">
                        <div>
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                <Autocomplete
                                    // getOptionLabel={(option) => option.label || optionsUnitTraning[0].label}
                                    classes={{
                                        listbox: classes.listbox,
                                        inputRoot: classes.autocompleteRoot,
                                        input: classes.input
                                    }}
                                    size="small"
                                    id="combo-box-demo"
                                    options={optionsSession}
                                    renderInput={(params) => <TextField  {...params} InputLabelProps={{ shrink: true }} placeholder={"Tất cả"} label="Khóa học" />}
                                />
                            </FormControl>
                        </div>
                        <div >
                            <FormControl sx={{ m: 1, width: !isMobileUI ? 260 : '100%' }} size="small">
                                <Autocomplete
                                    getOptionLabel={(option) => option.name || optionsUnitTraning[0].name}
                                    classes={{
                                        listbox: classes.listbox,
                                        inputRoot: classes.autocompleteRoot,
                                        input: classes.input
                                    }}
                                    size="small"
                                    id="combo-box-demo"
                                    options={_.sortBy(optionsUnitTraning, [function (o) { return o?.name }])}
                                    renderInput={(params) => <TextField  {...params} InputLabelProps={{ shrink: true }} placeholder={"Tất cả"} label="Ngành học" />}
                                />
                            </FormControl>
                        </div>
                        <div className="infor-searching-header-actions-search">
                            <input type="search" placeholder="Tìm kiếm theo tên, mssv, email" onKeyDown={(event) => handleSearchStudent(event)} onChange={(event) => handleSearchOnChange(event)} />
                        </div>
                    </div>
                </div>
                <div className="infor-searching-body">
                    {
                        !searchLoading ?
                            isSearch ?
                                dataUser && dataUser.length > 0 ?
                                    <Grid container spacing={2}>
                                        {dataUser?.length > 0 && _.sampleSize(dataUser, 4).map((infor, index) => (
                                            <Grid item key={index} md={3} sm={6} xs={12}>
                                                <div className="infor-searching-body-item" data-aos="flip-right" onClick={() => window.location.href = `/tra-cuu/${infor.studentId}`}>
                                                    <div className="infor-searching-body-item-image">
                                                        <Image src={infor?.avatarUrl ? infor.avatarUrl : '/images/huy-hieu-hoi.png'} layout='responsive' width={50} height={50} objectFit="cover" />
                                                    </div>
                                                    <div className="infor-searching-body-item-title dot-2">
                                                        {infor?.fullName}
                                                    </div>
                                                    <div className="infor-searching-body-item-semester">
                                                        {infor?.className}
                                                    </div>
                                                    <div className="infor-searching-body-item-desc dot-2">
                                                        {infor?.schoolName}
                                                    </div>
                                                </div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    :
                                    <div style={{ display: 'flex', margin: '60px auto', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '234px' }}>
                                        Không tìm thấy kết quả
                                    </div>
                                :
                                <Grid container spacing={2}>
                                    {inforDataArr?.length > 0 && _.sampleSize(inforDataArr, 4).map((infor, index) => (
                                        <Grid item key={index} md={3} sm={6} xs={12}>
                                            <div className="infor-searching-body-item" data-aos="flip-right">
                                                <div className="infor-searching-body-item-image">
                                                    <Image src={infor.president?.avatarUrl?.includes('https') ? infor.president.avatarUrl : '/images/huy-hieu-hoi.png'} layout='responsive' width={50} height={50} objectFit="cover" />
                                                </div>
                                                <div className="infor-searching-body-item-title dot-2">
                                                    {infor.president?.fullName}
                                                </div>
                                                <div className="infor-searching-body-item-semester">
                                                    {infor.president?.className}
                                                </div>
                                                <div className="infor-searching-body-item-desc dot-2">
                                                    {infor.name}
                                                </div>
                                            </div>
                                        </Grid>
                                    ))}

                                    {/* <Grid item md={12} sm={12} xs={12}>
                                        <div className="infor-searching-body-actions">
                                            {showMoreItems === inforDataArr?.length
                                                ? <button onClick={handleShowLess}>Ẩn bớt</button>
                                                : <button onClick={handleShowMore}>Hiện thêm</button>
                                            }
                                        </div>
                                    </Grid> */}
                                </Grid>
                            :
                            <div style={{ display: 'flex', margin: '60px auto', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '234px' }}>
                                <CircularProgress />
                            </div>
                    }
                </div>
            </div>
        </Container >
    );
}

export default InforSearching;