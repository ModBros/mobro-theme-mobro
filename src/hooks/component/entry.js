const Grid = mobro.hooks.getComponent('grid.grid');

mobro.hooks.redux.mapStateToProps("entry", (event) => {
    event.mergeMapStateToProps({
        layoutConfig: mobro.reducers.layout.getLayoutConfig(event.getState())
    });
})

mobro.hooks.component("entry", (Component) => (props) => {
    const {
        layoutConfig,
        layout
    } = props;

    const style = {};

    if(layoutConfig?.widgetFontSize) {
        style.fontSize = `${layoutConfig?.widgetFontSize}px`;
    }

    return (
        <div style={style} className={"d-flex w-100"}>
            <Grid
                components={mobro.utils.component.getComponentsFromConfig(layout)}
                gutter={12}
                cols={{lg: 24, md: 18, sm: 12, xs: 6, xxs: 2}}
            />
        </div>
    );
});