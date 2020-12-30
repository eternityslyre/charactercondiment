import React from 'react';
import {
    Card,
    CardContent,
} from '@react-md/card';

export default class LjCard extends React.Component {
    render() {
        const {children, isActive, onClick} = this.props;

        return <Card onClick={onClick} style={{cursor: 'pointer'}}>
            <CardContent>
                {
                    isActive
                        ? <span style={{fontWeight: '700'}}>{children}</span>
                        : children
                }
            </CardContent>
        </Card>
    }
}