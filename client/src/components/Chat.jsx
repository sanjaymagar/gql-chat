import React, { useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useMutation,
  gql,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { Container, Row, FormInput, Col, Button } from 'shards-react';

import { Message } from './Message';

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true,
  },
});
const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
  link: wsLink,
});

const POST_MESSAGE = gql`
  mutation($user: String!, $content: String!) {
    onMessage(user: $user, content: $content)
  }
`;

const Chat = () => {
  const [state, setState] = useState({
    user: 'sanjmagr',
    content: '',
  });
  const { user, content } = state;

  const [onMessage] = useMutation(POST_MESSAGE);

  const onSend = () => {
    if (content.length > 0) {
      onMessage({
        variables: state,
      });
    }

    setState({
      ...state,
      content: '',
    });
  };
  return (
    <Container>
      <Message {...{ user }} />
      <Row>
        <Col xs={2} style={{ padding: 0 }}>
          <FormInput
            label='User'
            value={user}
            onChange={evt =>
              setState({
                ...state,
                user: evt.target.value,
              })
            }
          />
        </Col>
        <Col xs={8}>
          <FormInput
            label='Content'
            value={content}
            onChange={evt =>
              setState({
                ...state,
                content: evt.target.value,
              })
            }
            onKeyUp={evt => {
              if (evt.keyCode === 13) {
                onSend();
              }
            }}
          />
        </Col>
        <Col xs={2} style={{ padding: 0 }}>
          <Button
            theme='light'
            onClick={() => onSend()}
            style={{ width: '100%' }}>
            Send
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default () => (
  <ApolloProvider {...{ client }}>
    <Chat />
  </ApolloProvider>
);
