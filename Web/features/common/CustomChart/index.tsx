import React, { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import './style.scss'
import { STUDY_SCORE_DETAIL_CORRECT, STUDY_SCORE_DETAIL_IN_CORRECT, STUDY_SCORE_DETAIL_NO_STUDY } from "../../../modules/share/constraint";
import { useSelector } from "../../../app/hooks";
import { useMediaQuery, useTheme } from "@mui/material";
import moment from "moment";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function CustomChart({
    barChartData, lineChartData, titleChart, isHideNoStudy, isProfileResult, stacked, type
}: {
    barChartData?: any, lineChartData?: any, titleChart: string, isHideNoStudy?: boolean, isProfileResult?: boolean, stacked?: boolean, type?: string
}) {
    const currentTopic = useSelector((state) => state.topicState.currentTopic)
    const mapTopicProgress = useSelector(state => state.topicState.topicProgresses)
    const currentTopicProgress = mapTopicProgress[currentTopic?._id];
    const theme = useTheme()
    const isLgDesktopUI = useMediaQuery(theme.breakpoints.down('xxl'))

    const fontStyleText = useMemo(() => {
        return {
            family: 'SVN-Poppins',
            size: isLgDesktopUI ? 12 : 16,
            weight: 600
        }
    }, [isLgDesktopUI])

    // infor bar chart
    const optionsOfBarChart = useMemo(() => {
        return {
            // responsive: true,
            plugins: {
                legend: {
                    position: "right" as const,
                    align: 'end',
                    labels: {
                        font: fontStyleText,
                        boxWidth: 20
                    }
                },
                title: {
                    display: true,
                    font: {
                        family: 'SVN-Poppins',
                        size: isLgDesktopUI ? 22 : 26
                    },
                    text: titleChart,
                    color: '#3C3B40'
                },
                tooltip: {
                    mode: "index",
                    intersect: false,
                    bodyFontSize: isLgDesktopUI ? 16 : 20,
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label || ''}: ${ctx.parsed.y} ${isProfileResult ? '%' : "câu"}`
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: fontStyleText
                    },
                    title: {
                        font: fontStyleText,
                        display: true
                    },
                    stacked: stacked ?? false,
                },
                y: {
                    min: 0,
                    max: isProfileResult ? 100 : currentTopicProgress?.totalCardNum,
                    ticks: {
                        font: fontStyleText,
                        // callback: function (value) {
                        //     return value + `${isProfileResult ? '%' : ' câu'}`
                        // }
                    },
                    title: {
                        text: isProfileResult ? `Phần trăm (%)` : 'Số câu',
                        font: fontStyleText,
                        display: true
                    },
                    stacked: stacked ?? false,
                }
            },
            maintainAspectRatio: false,
        }
    }, [titleChart, currentTopicProgress, isLgDesktopUI])

    const dataOfBarChart = {
        labels: barChartData?.map(item => {
            return item.label
        }),
        datasets: [
            {
                label: "Đúng",
                data: barChartData?.map(item => item.data[STUDY_SCORE_DETAIL_CORRECT] || 0),
                backgroundColor: "#33CD99",
                maxBarThickness: 20,
                barThickness: 10,
            },
            {
                label: "Sai",
                data: barChartData?.map(item => item.data[STUDY_SCORE_DETAIL_IN_CORRECT] || 0),
                backgroundColor: "#FA6666",
                maxBarThickness: 20,
                barThickness: 10,
            }
        ]
    }

    // infor line chart
    const optionsOfLineChart = {
        // responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: titleChart,
                font: {
                    family: 'SVN-Poppins',
                    size: isLgDesktopUI ? 22 : 26
                },
            },
            tooltip: {
                mode: "index",
                intersect: false,
                bodyFontSize: isLgDesktopUI ? 16 : 20,
                callbacks: {
                    label: (ctx) => {
                        var d = moment.duration(ctx.parsed.y, 'seconds');
                        var hours = Math.floor(d.hours());
                        var mins = Math.floor(d.minutes()) - hours * 60;

                        return `${ctx.dataset.label || ''}: ${hours}h${mins}p`
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    font: fontStyleText,
                },
                // title: {
                //     text: 'Ngày',
                //     font: fontStyleText,
                //     display: true
                // }
            },
            y: {
                ticks: {
                    font: fontStyleText,
                    callback: function (value) {
                        var d = moment.duration(value, 'seconds');
                        var hours = Math.floor(d.hours());
                        var mins = Math.floor(d.minutes()) - hours * 60;

                        return `${hours}h${mins}p`
                    },
                },
            }
        },
        elements: {
            line: {
                borderColor: '#1DD6FF',
                backgroundColor: '#1DD6FF',
                borderWidth: isLgDesktopUI ? 3 : 4,
            },
            point: {
                pointRadius: isLgDesktopUI ? 6 : 8,
                pointHoverRadius: isLgDesktopUI ? 6 : 8,
                pointBorderWidth: 2,
                pointBorderColor: '#1DD6FF',
                pointBackgroundColor: '#B5F2FF'
            }
        },
        maintainAspectRatio: false,
    };

    const dataOfLineChart = useMemo(() => {
        return {
            labels: lineChartData?.map(item => {
                return moment(item._id).format('DD/MM')
            }),
            datasets: [
                {
                    label: 'Thời gian',
                    data: lineChartData?.map(item => {
                        return item.totalTimeByDay
                    }),
                    fill: false,
                }
            ]
        }
    }, [isLgDesktopUI, lineChartData, titleChart])

    if (!isHideNoStudy) {
        dataOfBarChart.datasets.push({
            label: "Chưa làm",
            data: barChartData?.map(item => item.data[STUDY_SCORE_DETAIL_NO_STUDY] || 0),
            backgroundColor: "#B7B7B7",
            maxBarThickness: 20,
            barThickness: 10,
        })
    }

    const mapTypesChart = {
        'bar': {
            data: dataOfBarChart,
            options: optionsOfBarChart
        },
        'line': {
            data: dataOfLineChart,
            options: optionsOfLineChart
        }
    }

    return <div className="practice-view-chart" >
        {type === 'bar' && <Bar options={mapTypesChart[type].options as any} data={mapTypesChart[type].data} />}
        {type === 'line' && <Line options={mapTypesChart[type].options as any} data={mapTypesChart[type].data} />}
    </div>
}

export default CustomChart
