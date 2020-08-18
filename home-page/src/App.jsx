import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';

import { Container } from 'shards-react';

import Chat from 'chat/Chat';

const App = () => (
  <Container>
    <div className='other-app'>
      <p className='content'>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo quam, id
        vitae asperiores assumenda consequatur repellat fugit culpa quas
        possimus!
      </p>
      <div className='chat-window'>
        <h4 className='title'>Chat Window</h4>
      </div>
      <Chat />
      <p className='content'>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto
        earum officiis debitis exercitationem laborum vitae consectetur non rem
        excepturi. Odio at beatae ut reprehenderit. Sit.
      </p>
    </div>
  </Container>
);

ReactDOM.render(<App />, document.getElementById('app'));
