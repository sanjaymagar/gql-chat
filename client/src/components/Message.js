import React from 'react';
import { gql, useSubscription } from '@apollo/client';

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      user
      content
    }
  }
`;

export const Message = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES);
  if (!data) return null;
  return (
    <>
      {data.messages.map(({ id, user: currentUser, content }) => (
        <div
          key={id}
          style={{
            display: 'flex',
            justifyContent: user === currentUser ? 'flex-end' : 'flex-start',
            padding: '1em',
          }}>
          {user !== currentUser && (
            <div
              style={{
                height: 35,
                width: 35,
                borderRadius: 17,
                marginRight: '.5em',
                border: '2px solid #E5E6EA',
                alignSelf: 'flex-end',
                fontSize: 15,
                paddingTop: 5,
                textAlign: 'center',
              }}>
              {user.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div
            style={{
              backgroundColor: user === currentUser ? '#58BF56' : '#E5E6EA',
              padding: '1em',
              borderRadius: '1em',
              color: user === currentUser ? 'white' : 'black',
              maxWidth: '60%',
            }}>
            {content}
          </div>
        </div>
      ))}
    </>
  );
};
