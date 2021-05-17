
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { View, Container, Text, Icon, Button } from 'native-base';

class ErrorPage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Container style={styles.container}>
                <Icon style={styles.icon} name="frown" type="FontAwesome5" />
                <Text style={styles.text}>Ops, something went wrong...</Text>
                <View style={styles.buttonContainer}>
                    <Button onPress={this.props.onReload}><Text>Retry</Text></Button>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 999999999999
    },
    icon: {
        fontSize: 100, 
        color: '#666',
    },
    text: {
        color: '#666',
        marginTop: 20, 
        marginBottom: 20
    },
    buttonContainer: {
        justifyContent: 'center', 
        alignItems: 'center'
    }
});

export default ErrorPage;
