
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { View, Container, Text, Icon, Button } from 'native-base';
import { themeDark, themeLight, useTheme } from './Theme';

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
        flex: 9999999999,
        backgroundColor: useTheme('colors.background'),
    },
    icon: {
        fontSize: 100, 
        color: useTheme('colors.text'),
    },
    text: {
        color: useTheme('colors.text'),
        marginTop: 20, 
        marginBottom: 20,
    },
    buttonContainer: {
        justifyContent: 'center', 
        alignItems: 'center'
    }
});

export default ErrorPage;
