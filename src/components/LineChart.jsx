import {useState, useRef} from 'react';
import Chart from 'theme/components/Chart.container';
import {defaultFontColor, getColorForCurrentValue, maxValue, minValue} from 'theme/utils/chart'
import {colorToRgba} from 'theme/utils/color'
import {getWidgetFontColor, getWidgetFontFamily} from 'theme/utils/widget'

const defaultLineColor = 'rgba(0, 0, 0, 1)';

function createOptions(configRef, layoutConfigRef, channelDataRef, settings, optionsRef) {
    const min = minValue(configRef, 'min', null);
    const max = maxValue(configRef, null, 'max', null);

    return {
        colors: [colorToRgba(configRef.current?.color, defaultLineColor)],
        chart: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            animation: {
                duration: 500
            }
        },
        title: {
            text: undefined,
            floating: true
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
        tooltip: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        xAxis: {
            visible: false,
        },
        yAxis: {
            endOnTick: true,
            gridLineWidth: 0,
            startOnTick: true,
            tickAmount: 2,
            tickWidth: 0,
            min: min,
            max: max,
            title: {
                text: undefined
            },
            opposite: true,
            labels: {
                style: {
                    fontFamily: getWidgetFontFamily(configRef.current, layoutConfigRef.current),
                    color: colorToRgba(getWidgetFontColor(configRef.current, layoutConfigRef.current), defaultFontColor)
                }
            }
        },
        plotOptions: {
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
            marker: {
                enabled: false
            },
            enableMouseTracking: false,
            lineWidth: configRef.current.lineWidth || 2,
            data: optionsRef.current?.series?.[0]?.data ?? (function () {
                const data = [];
                const time = (new Date()).getTime();

                for (let i = 0; i < 14; i++) {
                    data.push({
                        x: time - i * 1000,
                        y: 0
                    });
                }

                return data.reverse();
            })()
        }]
    }
}

function ChartLabel(props) {
    const {
        config
    } = props;

    const [channelData, setChannelData] = useState(null);

    mobro.utils.component.useChannelListener(config?.channel, (data) => {
        setChannelData(data);
    });

    if(!config?.showLabel) {
        return null;
    }

    const label = config?.label ? config?.label : mobro.utils.channelData.extractLabel(channelData);

    return (
        <div className={'w-100 d-flex align-items-center justify-content-between mb-2'}>
            <span className="text-left d-block">
                {label}
            </span>
            <strong className="text-right">
                {mobro.utils.channelData.extractValue(channelData)}<span>{mobro.utils.channelData.extractRawUnit(channelData)}</span>
            </strong>
        </div>
    );
}

function LineChart(props) {
    const {
        ...chartProps
    } = props;

    const container = useRef(null);
    const containerSize = useRef([0, 0]);

    return (
        <div className={'d-flex flex-column w-100'} ref={container}>
            <ChartLabel config={props.config}/>

            <Chart
                {...chartProps}
                createOptions={createOptions}
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
                writeDataToSeries={(channelDataRef, optionsRef, configRef, layoutConfigRef, chartRef) => {
                    const [width, height] = containerSize.current;
                    const [currentWidth, currentHeight] = [container.current.offsetWidth, container.current.offsetHeight];

                    if(width !== currentWidth || height !== currentHeight) {
                        chartRef.current?.chart?.reflow();
                    }

                    const point = [
                        (new Date()).getTime(),
                        parseFloat(mobro.utils.channelData.extractValue(channelDataRef.current))
                    ];

                    chartRef.current?.chart?.series?.[0]?.addPoint(point, false, true);

                    optionsRef.current.colors = [getColorForCurrentValue(channelDataRef, configRef)]
                }}
                adaptOptions={(channelDataRef, optionsRef, configRef) => {
                }}
            />
        </div>
    );
}

export default LineChart;