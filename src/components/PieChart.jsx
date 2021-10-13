import {
    backColor, basicTextColor,
    frontColor,
    getColorForCurrentValue,
    loadDoughnutOrGauge,
    maxValue,
    redrawDoughnutOrGauge
} from 'theme/utils/chart'
import Chart from 'theme/components/Chart.container'

function createOptions(configRef, layoutConfigRef, channelDataRef) {
    const max = maxValue(configRef, channelDataRef, 'max');

    return {
        colors: [frontColor(configRef)],
        chart: {
            type: 'solidgauge',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            margin: [0, 0, 0, 0],
            spacing: [0, 0, 0, 0],
            events: {
                load: loadDoughnutOrGauge(configRef, layoutConfigRef),
                redraw: redrawDoughnutOrGauge(configRef, layoutConfigRef, channelDataRef)
            },
            animation: {
                duration: 500
            }
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        subtitle: {
            text: ''
        },
        pane: {
            center: ['50%', '70%'],
            size: '150%',
            startAngle: -115,
            endAngle: 115,
            background: {
                backgroundColor: backColor(configRef),
                innerRadius: '70%',
                outerRadius: '90%',
                borderWidth: 0,
                shape: 'arc'
            }
        },
        tooltip: {
            enabled: false
        },
        xAxis: {
            max: max,
            visible: false,
            endOnTick: false
        },
        yAxis: {
            length: 5,
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            tickLength: 0,
            labels: {
                enabled: false
            },
            endOnTick: false,
            min: 0,
            max: max
        },
        plotOptions: {
            solidgauge: {
                innerRadius: '70%',
                radius: '90%',
                dataLabels: {
                    enabled: false
                },
                series: {
                    animation: {
                        duration: 200
                    }
                }
            },
            series: {
                // necessary so that the start animation won't cause weird re-renderings
                // due to unfinished animations
                animation: false
            },
            column: {
                // remove border from bar
                borderWidth: 0
            }
        },
        series: [{
            data: [0]
        }]
    }
}

function DoughnutOrGauge(props) {
    const {
        extractMaxValue = maxValue,
        writeDataToSeries = (channelDataRef, optionsRef, configRef) => {},
        ...chartProps
    } = props;

    return (
        <Chart
            {...chartProps}
            configKeyToListen={[
                'showLabel',
                'label',
                'height',
                'color',
                'min',
                'warning',
                'warningColor',
                'danger',
                'dangerColor',
                'max'
            ]}
            writeDataToSeries={(channelDataRef, optionsRef, configRef) => {
                optionsRef.current.series[0].data = [parseFloat(mobro.utils.channelData.extractValue(channelDataRef.current))];

                writeDataToSeries(channelDataRef, optionsRef, configRef);
            }}
            adaptOptions={(channelDataRef, optionsRef, configRef) => {
                optionsRef.current.yAxis.max = extractMaxValue(configRef, channelDataRef);
                optionsRef.current.pane.background.backgroundColor = backColor(configRef);
            }}
        />
    );
}

function PieChart(props) {
    return (
        <Chart
            {...props}
            height={props.inline ? 50 : null}
            configKeyToListen={[
                'showLabel',
                'label',
                'height',
                'color',
                'min',
                'warning',
                'warningColor',
                'danger',
                'dangerColor',
                'max'
            ]}
            createOptions={(...args) => createOptions(...args, props.settings)}
            writeDataToSeries={(channelDataRef, optionsRef, configRef) => {
                optionsRef.current.series[0].data = [parseFloat(mobro.utils.channelData.extractValue(channelDataRef.current))];
                optionsRef.current.colors = [getColorForCurrentValue(channelDataRef, configRef)];
            }}
            adaptOptions={(channelDataRef, optionsRef, configRef) => {
                optionsRef.current.yAxis.max = maxValue(configRef, channelDataRef);
                optionsRef.current.pane.background.backgroundColor = backColor(configRef);
            }}
        />
    );
}

export default PieChart;
