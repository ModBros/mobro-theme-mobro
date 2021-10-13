import BasicChart from "theme/components/BasicChart";
import GraphIcon from "theme/icons/chart_graph.svg";

mobro.utils.icons.addIcon("widget.graph", GraphIcon);
mobro.hooks.addDataComponent({
    name: "basic-chart",
    label: "Basic Chart",
    icon: "widget.graph",
    component: BasicChart,
    config: {
        showLabel: {
            type: 'checkbox'
        },
        label: {
            type: 'input'
        },
        displayType: {
            type: "select",
            options: [
                {label: "Line", value: "line"},
                {label: "Pie", value: "pie"}
            ]
        },
        channel: {
            type: "channel"
        },
        height: {
            type: 'numeric'
        },
        color: {
            type: "color"
        },
        limits: {
            type: "fieldset",
            label: "Limits",
            collapsible: true,
            collapsed: true,
            children: {
                min: {
                    type: "numeric"
                },
                warning: {
                    type: "numeric",
                    info: "Threshold for yellow (warning)."
                },
                warningColor: {
                    type: "color"
                },
                danger: {
                    type: "numeric",
                    info: "Threshold for red (danger)."
                },
                dangerColor: {
                    type: "color"
                },
                max: {
                    type: "numeric"
                }
            }
        }
    },
    defaultValues: {
        showLabel: true
    }
});
