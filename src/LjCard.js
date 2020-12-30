import React from 'react';
import {
    Card,
    CardContent,
} from '@react-md/card';

export default class LjCard extends React.Component {
    render() {
        return <Card>
            <CardContent>
                {this.props.children}
            </CardContent>
        </Card>
    }
}