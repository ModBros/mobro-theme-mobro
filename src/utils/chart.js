import mobro from "mobro";

export function mapChannelDataToSingleChartData(channelData) {
    return mobro.utils.helper.map(channelData, (item, index) => ({
        name: index,
        value: mobro.utils.channelData.extractValue(item)
    }));
}

import {colorToRgba} from './color'
import {getWidgetFontFamily} from './widget'

export const defaultFontColor = 'black';
export const defaultFrontColor = 'rgb(0, 0, 0)';
export const defaultBackColor = '#efefef';

export function basicTextColor(configRef, layoutConfigRef) {
    return colorToRgba(configRef?.current?.widgetFontColor, colorToRgba(layoutConfigRef?.current?.widgetFontColor, defaultFontColor));
}

export function valueTextColor(configRef) {
    return colorToRgba(configRef?.current?.color, defaultFrontColor);
}

export function frontColor(configRef) {
    return valueTextColor(configRef);
}

export function backColor(configRef) {
    return colorToRgba(configRef?.current?.backColor, defaultBackColor);
}

export function maxValue(configRef, channelData, key = 'max', fallback = 100) {
    if (key && configRef.current?.[key]) {
        return parseInt(configRef.current[key])
    }

    if (channelData?.current) {
        if (mobro.utils.channelData.isPercentageData(channelData.current)) {
            return 100;
        }

        return mobro.utils.channelData.extractRawMaxValue(channelData.current)
    }

    return fallback;
}

export function minValue(configRef, key = 'min', fallback) {
    if (key && configRef.current?.[key]) {
        return parseInt(configRef.current[key])
    }

    return fallback;
}

export function redrawDoughnutOrGauge(
    configRef,
    layoutConfigRef,
    channelData,
    basicTextFontColor = basicTextColor,
    valueTextFontColor = valueTextColor
) {
    return function () {
        if (!channelData.current) {
            return;
        }

        const yFactor = configRef.current?.showLabel ? 1.5 : 1.35;
        const centerX = this.plotWidth / 2 + this.plotLeft;
        const centerY = this.plotHeight / yFactor + this.plotTop;
        const valueFontSize = Math.min(this.plotWidth, this.plotHeight) / 4
        const value = mobro.utils.channelData.extractValue(channelData.current);
        const unit = mobro.utils.channelData.extractRawUnit(channelData.current);

        const labelFontSize = Math.min(this.plotWidth, this.plotHeight) / 8;
        const label = configRef.current?.label || mobro.utils.channelData.extractLabel(channelData.current);
        const labelY =  this.plotHeight + this.plotTop - (labelFontSize / 2);

        this.widgetValue
            .attr({
                text: (value ?? '') + `<span style="font-size: ${valueFontSize / 2}px; font-weight: normal;">&nbsp;${unit ?? ''}</span>`,
                x: centerX,
                y: centerY
            })
            .css({
                fontWeight: 'bold',
                color: valueTextFontColor(configRef),
                fontSize: `${valueFontSize}px`,
                fontFamily: getWidgetFontFamily(configRef.current, layoutConfigRef.current)
            });

        this.widgetLabel
            .attr({
                text: configRef.current?.showLabel ? label : '',
                x: centerX,
                y: labelY
            })
            .css({
                color: basicTextFontColor(configRef),
                fontSize: `${labelFontSize}px`,
                fontFamily: getWidgetFontFamily(configRef.current, layoutConfigRef.current)
            });
    }
}

export function loadDoughnutOrGauge(
    configRef,
    layoutConfigRef,
    basicTextFontColor = basicTextColor,
    valueTextFontColor = valueTextColor
) {
    return function () {
        this.widgetValue = this.renderer.text('')
            .attr({
                align: 'center',
                zIndex: 2
            })
            .css({
                color: valueTextFontColor(configRef),
                fontFamily: getWidgetFontFamily(configRef.current, layoutConfigRef.current)
            })
            .add();

        this.widgetLabel = this.renderer.text('')
            .attr({
                align: 'center',
                zIndex: 2
            })
            .css({
                color: valueTextFontColor(configRef),
                fontFamily: getWidgetFontFamily(configRef.current, layoutConfigRef.current)
            })
            .add();
    }
}

export function getColorForCurrentValue(channelDataRef, configRef) {
    const value = parseFloat(mobro.utils.channelData.extractValue(channelDataRef.current));

    let color = colorToRgba(configRef.current.color, defaultFrontColor);

    if (!value) {
        return color
    }

    const warning = parseInt(configRef.current.warning);
    const danger = parseInt(configRef.current.danger);

    if (value >= danger) {
        color = colorToRgba(configRef.current.dangerColor, defaultFrontColor);
    } else if (value >= warning) {
        color = colorToRgba(configRef.current.warningColor, defaultFrontColor);
    }

    return color;
}