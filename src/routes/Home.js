import Qweet from 'components/Qweet';
import QweetFactory from 'components/QweetFactory';
import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';

const Home = ({ userObj }) => {
    const [qweets, setQweets] = useState([]);
    useEffect(() => {
        dbService.collection('qweets').onSnapshot((snapshot) => {
            const qweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setQweets(qweetArray);
        });
    }, []);
    return (
        <div className="container">
            <QweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {qweets.map((qweet) => (
                    <Qweet
                        key={qweet.id}
                        qweetObj={qweet}
                        isOwner={qweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};
export default Home;
