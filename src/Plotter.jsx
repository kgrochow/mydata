import React from 'react';
import styled from 'styled-components';

import {XYPlot, ArcSeries, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';
import "react-vis/dist/style.css";

const PreviewContainer = styled.pre`
    font-family: Consolas;
    font-size: 14px;
    font-weight: bold;
    white-space: pre-wrap;
    background-color: #282c34;
    border: solid 1px #ccc;
    color: #9197a3;
    padding: 20px;
    min-height: 400px;
`;

const Plotter = (props) => {
    const { node } = props;

    if (!node) {
        return null;
    }

    const o = {
        id: node.id,
        name: node.name,
        children: node.children ? node.children.length : 0,
        parent: node.parent ? node.parent.id : null,
        state: node.state
    };

    if (node.loadOnDemand !== undefined) {
        o.loadOnDemand = node.loadOnDemand;
    }

    const innerHTML = JSON.stringify(o, null, 2).replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');

    const PI = Math.PI
    const myData = [
        {angle0: 0, angle: PI / 4, radius: 2, radius0: 0, color: "red"},
        {angle0: PI / 4, angle: 2 * PI / 4, radius: 2, radius0: 0, color: "orange"},
        {angle0: 2 * PI / 4, angle: 3 * PI / 4, radius: 2, radius0: 0, color: "blue"},
        {angle0: 3 * PI / 4, angle: 4 * PI / 4, radius: 2, radius0: 0, color: "yellow"},
        {angle0: 4 * PI / 4, angle: 5 * PI / 4, radius: 2, radius0: 0, color: "green"},
        {angle0: 5 * PI / 4, angle: 8 * PI / 4, radius: 2, radius0: 0, color: "brown"}
     ]

    return (
        // <PreviewContainer
        //     dangerouslySetInnerHTML={{__html: innerHTML}}
        // />
        
        <XYPlot
            xDomain={[-5, 5]}
            yDomain={[-5, 5]}
            width={300}
            height={300}>
            <ArcSeries
                animation
                // radiusType={'literal'}
                // center={{x: -2, y: 2}}
                data={myData}
                colorType={'literal'}/>
        </XYPlot>
    );
};

export default Plotter;
