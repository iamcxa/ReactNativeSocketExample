import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Button,
  Text,
  Alert,
} from 'react-native';
import net from 'net';

// var net = require('net');

const server = {
  // host: '127.0.0.1',
  host: '192.168.168.138',
  port: 3000,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    paddingTop: 16,
  },
  content: {
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'lightblue',
    width: 200,
    height: 50,
  },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      error: '',
      socket: null,
      isOpen: false,
    };
  }

  componentDidMount() {
    const client = net.createConnection(server, () => {
      this.onUpdateChatter(
        'opened client on ' + JSON.stringify(client.address()),
      );
      client.write('Hello, server! Love, Client.');

      this.setState({
        socket: client,
      });
    });

    client.on('connect', () => {
      this.onUpdateChatter('Client: i`m connected');
    });

    client.on('ready', () => {
      this.onUpdateChatter('Client：i`m ready');
    });

    client.on('data', data => {
      this.onUpdateChatter('Client Received: ' + data);
    });

    client.on('error', error => {
      this.onUpdateChatter('client error ' + error);
    });

    client.on('close', e => {
      this.onUpdateChatter('client close');

      client.setTimeout(1000, () => {
        this.onUpdateChatter('wait for reconnect....');
        client.connect(server);
      });
    });
  }

  onUpdateChatter = msg => {
    this.setState(state => ({
      data: state.data.concat([`\n${msg}`]),
    }));
  };

  onSendData = () => {
    if (this.state.socket) {
      this.state.socket.write('send a new message!');
    }
  };

  render() {
    const {data, error} = this.state;
    return (
      <SafeAreaView>
        <Text style={styles.title}>Received data</Text>
        <Text style={styles.content}>{data}</Text>
        <Text style={styles.title}>Error</Text>
        <Text style={styles.content}>{error}</Text>
        <Text> </Text>
        <Button
          title="Send Data"
          style={styles.button}
          onPress={this.onSendData}
        />
      </SafeAreaView>
    );
  }
}
