import Qweet from "components/Qweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [qweet, setQweet] = useState("");
    const [qweets, setQweets] = useState([]);

    // 아래와 같은 방법은 오래된 데이터를 가져온다
    // const getQweets = async () => {
    //     const dbQweets = await dbService.collection("qweets").get();
    //     dbQweets.forEach((document) => {
    //         const qweetObj = {
    //             ...document.data(),
    //             id: document.id,
    //         };
    //         setQweets((prev) => [qweetObj, ...prev]);
    //     });
    // };

    useEffect(() => {
        dbService
            .collection("qweets")
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                const qweetArray = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setQweets(qweetArray);
            });
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        await dbService.collection("qweets").add({
            text: qweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });

        setQweet("");
    };

    const onChange = (e) => {
        const {
            target: { value },
        } = e;

        setQweet(value);
    };

    return (
        <div>
            <form>
                <input
                    type="text"
                    placeholder="What's on your mind ?"
                    maxLength={120}
                    value={qweet}
                    onChange={onChange}
                />
                <input type="submit" value="Qweet" onClick={onSubmit} />
            </form>
            <div>
                {qweets.map((qweet) => (
                    <Qweet
                        key={qweet.id}
                        qweetObj={qweet}
                        isOwner={userObj.uid === qweet.creatorId}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
