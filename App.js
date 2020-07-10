import React, {Fragment, Component} from 'react';
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';

import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

export default class App extends Component {
  state = {
    loading: false,
    user: null,
  };

  getUserCallback = (error, result) => {
    if (error) {
      console.log('getUserError');
    } else {
      this.setState({user: result, loading: false});
    }
  };

  getUserInfo = (token) => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken: token,
        parameters: {
          fields: {string: 'email, name'},
        },
      },
      this.getUserCallback,
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  };

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            {this.state.loading && <ActivityIndicator />}
          </View>
          {this.state.user && (
            <Fragment>
              <Text style={styles.userName}>{this.state.user.name} </Text>
              <Text style={styles.userEmail}>{this.state.user.email} </Text>
            </Fragment>
          )}
          <LoginButton
            permissions={['public_profile', 'email']}
            onLoginFinished={async (error, result) => {
              if (error) {
                console.log('auth error', error);
              } else if (result.isCancelled) {
                console.log('isCancelled');
              } else {
                console.log('aqui');
                const accessData = await AccessToken.getCurrentAccessToken();
                this.getUserInfo(accessData.accessToken);
                console.log(accessData);
              }
            }}
          />
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  userName: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 18,
  },
  userEmail: {
    color: '#888',
    fontSize: 14,
  },
});
